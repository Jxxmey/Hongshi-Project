from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks, Request
from database import db
from datetime import datetime
import cloudinary
import cloudinary.uploader
import os
import requests # <--- นำเข้า requests สำหรับยิง API ตรวจสอบ Captcha กับ Google

# --- นำเข้าส่วนที่เกี่ยวข้องกับ Rate Limit ---
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
# ----------------------------------------

# นำเข้าฟังก์ชันแจ้งเตือน LINE
from utils.line_notify import send_image_upload_notification

router = APIRouter(prefix="/gallery", tags=["Gallery"])
gallery_collection = db.gallery

# ตั้งค่า Cloudinary (ดึงจากไฟล์ .env อัตโนมัติ)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

@router.get("")
async def get_approved_photos():
    photos = []
    # ดึงเฉพาะรูปที่สถานะ "approved"
    cursor = gallery_collection.find({"status": "approved"}).sort("createdAt", -1)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        photos.append(doc)
    return photos

@router.post("/upload")
@limiter.limit("3/minute") # <--- จำกัดการเข้าถึง: 1 IP อัปโหลดได้แค่ 3 ครั้งต่อนาที
async def upload_photo(
    request: Request, # <--- ต้องรับ parameter 'request' เสมอเพื่อให้ slowapi ดึง IP ได้
    background_tasks: BackgroundTasks,
    image: UploadFile = File(...),
    uploaderName: str = Form("Anonymous LYKYOU"),
    recaptchaToken: str = Form(...) # <--- รับค่า Token ของ Captcha ที่ส่งมาจาก Frontend
):
    # 1. ตรวจสอบความถูกต้องของ reCAPTCHA
    RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")
    if RECAPTCHA_SECRET_KEY:
        try:
            captcha_response = requests.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={
                    "secret": RECAPTCHA_SECRET_KEY,
                    "response": recaptchaToken
                }
            )
            captcha_result = captcha_response.json()
            if not captcha_result.get("success"):
                raise HTTPException(status_code=400, detail="การยืนยันตัวตนล้มเหลว (Captcha Failed) อาจเป็นบอท")
        except requests.exceptions.RequestException:
            raise HTTPException(status_code=500, detail="ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ตรวจสอบ Captcha ได้")

    # 2. ตรวจสอบชนิดไฟล์ (รับเฉพาะรูปภาพ)
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น")

    try:
        # อ่านไฟล์รูปภาพ
        contents = await image.read()
        
        # 3. อัปโหลดขึ้น Cloudinary
        upload_result = cloudinary.uploader.upload(
            contents, 
            folder="hongshi_gallery"
        )
        
        # ดึง URL แบบปลอดภัย (https) และ ID ของรูปมาเก็บไว้
        image_url = upload_result.get("secure_url")
        public_id = upload_result.get("public_id")

        # 4. บันทึกลง MongoDB พร้อมตั้งสถานะเป็น "pending"
        new_photo = {
            "imageUrl": image_url,
            "cloudinary_id": public_id,
            "uploaderName": uploaderName,
            "status": "pending",
            "createdAt": datetime.utcnow()
        }
        
        # เก็บผลลัพธ์การ insert เพื่อเอา ID ของรูป
        result = await gallery_collection.insert_one(new_photo)
        photo_id = str(result.inserted_id) # แปลง ObjectId เป็น String
        
        # 5. ส่งแจ้งเตือน LINE พร้อมแนบ photo_id ไปด้วย
        background_tasks.add_task(send_image_upload_notification, image_url, uploaderName, photo_id)
        
        return {"message": "อัปโหลดสำเร็จ รอแอดมินตรวจสอบครับ"}
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการอัปโหลด")