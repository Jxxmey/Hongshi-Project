from fastapi import APIRouter, HTTPException, Request, Query
from pydantic import BaseModel
from database import db
from utils.profanity import contains_profanity
import os
import requests

# +++ นำเข้าสำหรับการจัดการ ID ของ MongoDB +++
from bson import ObjectId
from bson.errors import InvalidId

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
    recaptchaToken: str 
    isConsentGiven: bool = False # <--- 1. เพิ่มตัวแปรสำหรับรับค่า Consent จากหน้าบ้าน

@router.post("/visit")
@limiter.limit("10/minute") 
async def record_visit(request: Request): 
    await stats_collection.update_one(
        {"_id": "site_stats"},
        {"$inc": {"views": 1}},
        upsert=True
    )
    return {"message": "Visit recorded"}

@router.get("/wishes")
async def get_wishes(
    skip: int = Query(0, ge=0, description="จำนวนที่ต้องการข้าม"),
    limit: int = Query(20, ge=1, le=100, description="จำนวนที่ต้องการดึง (สูงสุด 100)")
):
    wishes = []
    # รองรับทั้งข้อมูลใหม่ที่มี status และข้อมูลเก่าที่ไม่มี status
    query = {
        "$or": [
            {"status": "approved"}, 
            {"status": {"$exists": False}, "reported": False},
            {"status": {"$exists": False}, "reported": {"$exists": False}}
        ]
    }
    
    # นับจำนวนทั้งหมดเพื่อให้ Frontend รู้ว่าโหลดหมดหรือยัง
    total_count = await wishes_collection.count_documents(query)
    
    # เพิ่ม .skip() และ .limit()
    cursor = wishes_collection.find(query).sort("_id", -1).skip(skip).limit(limit)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        wishes.append(document)
        
    return {
        "total": total_count,
        "skip": skip,
        "limit": limit,
        "items": wishes
    }

@router.post("/wishes")
@limiter.limit("5/minute") 
async def create_wish(request: Request, wish: WishModel): 
    
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

    # 2. ตรวจสอบคำหยาบ (ตั้งสถานะเป็น pending แทนการโยน Error)
    has_profanity = contains_profanity(wish.name) or contains_profanity(wish.message)
    status = "pending" if has_profanity else "approved"
        
    # 3. เตรียมข้อมูลสำหรับบันทึกลง Database (ไม่เอา recaptchaToken บันทึกลงไป)
    new_wish = {
        "name": wish.name,
        "message": wish.message,
        "isConsentGiven": wish.isConsentGiven, # <--- 2. บันทึกค่า Consent ลง Database
        "reported": False,
        "status": status  # <--- บันทึกสถานะเพื่อใช้จัดหมวดหมู่
    }
    
    result = await wishes_collection.insert_one(new_wish)
    new_wish["id"] = str(result.inserted_id)
    if "_id" in new_wish:
        del new_wish["_id"]
        
    # คืนค่าข้อความแจ้งเตือนที่แตกต่างกันถ้ามีคำสุ่มเสี่ยง
    if has_profanity:
        return {"message": "คำอวยพรของคุณถูกส่งแล้ว แต่อยู่ระหว่างรอผู้ดูแลตรวจสอบเนื่องจากอาจมีคำที่ไม่เหมาะสม 🩵", "data": new_wish}
    
    return {"message": "ส่งคำอวยพรสำเร็จ!", "data": new_wish}

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++
# +++ เพิ่ม API รับการแจ้งรีพอร์ต (Report) จากผู้ใช้ทั่วไป +++
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++
@router.post("/wishes/{wish_id}/report")
@limiter.limit("10/minute") # จำกัดเพื่อป้องกันคนกดสแปมปุ่ม Report เล่น
async def report_wish(request: Request, wish_id: str):
    try:
        obj_id = ObjectId(wish_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="รูปแบบ ID ไม่ถูกต้อง (Invalid Wish ID format)")
        
    # ค้นหาข้อความแล้วอัปเดตค่า 'reported' ให้เป็น True และตั้ง 'status' เป็น pending 
    # (เพื่อซ่อนออกจากหน้าเว็บทันที และส่งเข้าหน้า AdminReports)
    result = await wishes_collection.update_one(
        {"_id": obj_id}, 
        {"$set": {
            "reported": True,
            "status": "pending" 
        }}
    )
    
    if result.modified_count == 0:
        # กรณีหาเอกสารไม่เจอ หรืออาจจะถูกรายงาน/ลบไปแล้ว
        raise HTTPException(status_code=404, detail="ไม่พบข้อความนี้ หรืออาจถูกแจ้งรายงานไปแล้ว")
        
    return {"message": "รายงานข้อความสำเร็จ ผู้ดูแลจะตรวจสอบโดยเร็วที่สุด"}