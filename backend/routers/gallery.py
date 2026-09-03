from fastapi import APIRouter, UploadFile, File, Form, HTTPException, BackgroundTasks
from database import db
from datetime import datetime
import cloudinary
import cloudinary.uploader
import os

# นำเข้าฟังก์ชันแจ้งเตือน LINE (สมมติว่าคุณสร้างไฟล์ไว้ที่ utils/line_notify.py)
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
async def upload_photo(
    background_tasks: BackgroundTasks, # <--- 1. เพิ่ม BackgroundTasks ตรงนี้
    image: UploadFile = File(...),
    uploaderName: str = Form("Anonymous LYKYOU")
):
    # 1. ตรวจสอบชนิดไฟล์ (รับเฉพาะรูปภาพ)
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="ไฟล์ที่อัปโหลดต้องเป็นรูปภาพเท่านั้น")

    try:
        # อ่านไฟล์รูปภาพ
        contents = await image.read()
        
        # 2. อัปโหลดขึ้น Cloudinary
        upload_result = cloudinary.uploader.upload(
            contents, 
            folder="hongshi_gallery"
        )
        
        # ดึง URL แบบปลอดภัย (https) และ ID ของรูปมาเก็บไว้
        image_url = upload_result.get("secure_url")
        public_id = upload_result.get("public_id")

        # 3. บันทึกลง MongoDB พร้อมตั้งสถานะเป็น "pending"
        new_photo = {
            "imageUrl": image_url,
            "cloudinary_id": public_id,
            "uploaderName": uploaderName,
            "status": "pending",
            "createdAt": datetime.utcnow()
        }
        
        await gallery_collection.insert_one(new_photo)
        
        # 4. สั่งให้ส่งแจ้งเตือน LINE ทำงานอยู่เบื้องหลัง (Background Task)
        # ส่งลิงก์ Cloudinary และชื่อคนอัปโหลดไปให้ฟังก์ชัน
        background_tasks.add_task(send_image_upload_notification, image_url, uploaderName)
        
        return {"message": "อัปโหลดสำเร็จ รอแอดมินตรวจสอบครับ"}
        
    except Exception as e:
        print(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail="เกิดข้อผิดพลาดในการอัปโหลด")