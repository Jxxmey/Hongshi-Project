from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from database import db
from utils.profanity import contains_profanity
import os
import requests

# --- นำเข้าส่วนที่เกี่ยวข้องกับ Rate Limit ---
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
# ----------------------------------------

router = APIRouter()

wishes_collection = db.wishes
stats_collection = db.stats

class WishModel(BaseModel):
    name: str
    message: str
    recaptchaToken: str # <--- เพิ่มตัวแปรสำหรับรับ Token ของ Captcha จากหน้าบ้าน

@router.post("/visit")
@limiter.limit("10/minute") # <--- ป้องกันการสแปมยอดวิว (จำกัด 10 ครั้ง/นาที/IP)
async def record_visit(request: Request): # <--- ต้องใส่ request เพื่อให้ limiter ดึง IP ได้
    await stats_collection.update_one(
        {"_id": "site_stats"},
        {"$inc": {"views": 1}},
        upsert=True
    )
    return {"message": "Visit recorded"}

@router.get("/wishes")
async def get_wishes():
    wishes = []
    cursor = wishes_collection.find({
        "$or": [{"reported": {"$exists": False}}, {"reported": False}]
    }).sort("_id", -1).limit(100)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        wishes.append(document)
    return wishes

@router.post("/wishes")
@limiter.limit("5/minute") # <--- ป้องกันการสแปมข้อความ (จำกัด 5 ข้อความ/นาที/IP)
async def create_wish(request: Request, wish: WishModel): # <--- ต้องใส่ request เสมอเมื่อใช้ limiter
    
    # 1. ตรวจสอบความถูกต้องของ reCAPTCHA
    RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")
    if RECAPTCHA_SECRET_KEY:
        try:
            captcha_response = requests.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={
                    "secret": RECAPTCHA_SECRET_KEY,
                    "response": wish.recaptchaToken
                }
            )
            captcha_result = captcha_response.json()
            if not captcha_result.get("success"):
                raise HTTPException(status_code=400, detail="การยืนยันตัวตนล้มเหลว (Captcha Failed) อาจเป็นบอท")
        except requests.exceptions.RequestException:
            raise HTTPException(status_code=500, detail="ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ตรวจสอบ Captcha ได้")

    # 2. ตรวจสอบคำหยาบ
    if contains_profanity(wish.name) or contains_profanity(wish.message):
        raise HTTPException(
            status_code=400,
            detail="ข้อความของคุณมีคำที่ไม่เหมาะสม กรุณาแก้ไขใหม่นะครับ 🩵"
        )
        
    # 3. เตรียมข้อมูลสำหรับบันทึกลง Database (ไม่เอา recaptchaToken บันทึกลงไป)
    new_wish = {
        "name": wish.name,
        "message": wish.message,
        "reported": False
    }
    
    result = await wishes_collection.insert_one(new_wish)
    new_wish["id"] = str(result.inserted_id)
    if "_id" in new_wish:
        del new_wish["_id"]
    return new_wish