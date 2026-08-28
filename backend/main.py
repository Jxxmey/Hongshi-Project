from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from bson.errors import InvalidId
import os
import re
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Hongshi Birthday API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.hongshi_project
wishes_collection = db.wishes

class WishModel(BaseModel):
    name: str
    message: str

# คลังคำหยาบเวอร์ชันปรับปรุง
BAD_WORDS = [
    "เหี้ย", "สัส", "สัด", "เย็ด", "ควย", "แตด", "หี", "จิ๋ม", "จู๋",
    "หน้าหี", "สันดาน", "จัญไร", "ระยำ", "เสือก", "พ่อตาย", "แม่ตาย",
    "fuck", "shit", "bitch", "cunt", "dick", "pussy", "asshole", "slut", "whore",
    "สึส", "เชี่ย", "สัสๆ", "ควัย", "ฆวย"
]

def contains_profanity(text: str) -> bool:
    if not text:
        return False
        
    text_lower = text.lower()
    text_clean = re.sub(r'[\s\.\-_]+', '', text_lower)

    for word in BAD_WORDS:
        word_clean = word.lower()
        if re.search(r'[a-z]', word_clean):
            pattern = r'\b' + re.escape(word_clean) + r'\b'
            if re.search(pattern, text_lower):
                return True
        else:
            word_clean_no_spaces = re.sub(r'[\s\.\-_]+', '', word_clean)
            if word_clean in text_lower or (word_clean_no_spaces and word_clean_no_spaces in text_clean):
                return True
    return False


# ==========================================
# ฝั่งผู้ใช้งานทั่วไป (Public API)
# ==========================================

@app.get("/wishes")
async def get_wishes():
    wishes = []
    # ดึงเฉพาะข้อความที่ "ไม่ได้ถูก report" และเพิ่มจำนวนลิมิตเป็น 100 ข้อความ
    cursor = wishes_collection.find({
        "$or": [{"reported": {"$exists": False}}, {"reported": False}]
    }).sort("_id", -1).limit(100)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        wishes.append(document)
    return wishes

@app.post("/wishes")
async def create_wish(wish: WishModel):
    if contains_profanity(wish.name) or contains_profanity(wish.message):
        raise HTTPException(
            status_code=400,
            detail="ข้อความของคุณมีคำที่ไม่เหมาะสม กรุณาแก้ไขใหม่นะครับ 🩵"
        )
        
    new_wish = wish.model_dump()
    new_wish["reported"] = False # กำหนดค่าเริ่มต้นว่ายังไม่ถูกแบน
    
    result = await wishes_collection.insert_one(new_wish)
    new_wish["id"] = str(result.inserted_id)
    if "_id" in new_wish:
        del new_wish["_id"]
    return new_wish

@app.post("/wishes/{wish_id}/report")
async def report_wish(wish_id: str):
    try:
        obj_id = ObjectId(wish_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Wish ID")
    
    # อัปเดตสถานะเป็นถูกรีพอร์ต
    result = await wishes_collection.update_one(
        {"_id": obj_id},
        {"$set": {"reported": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Wish not found")
    return {"message": "Reported successfully"}


# ==========================================
# ฝั่งผู้ดูแลระบบ (Admin API)
# ==========================================

@app.get("/admin/reports")
async def get_reported_wishes():
    wishes = []
    # ดึงเฉพาะข้อความที่ถูกรีพอร์ต
    cursor = wishes_collection.find({"reported": True}).sort("_id", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        wishes.append(document)
    return wishes

@app.post("/admin/wishes/{wish_id}/dismiss")
async def dismiss_report(wish_id: str):
    try:
        obj_id = ObjectId(wish_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Wish ID")
    
    # ยกเลิกการรีพอร์ต (ให้กลับไปแสดงบนจอ)
    await wishes_collection.update_one(
        {"_id": obj_id},
        {"$set": {"reported": False}}
    )
    return {"message": "Report dismissed"}

@app.delete("/admin/wishes/{wish_id}")
async def delete_wish(wish_id: str):
    try:
        obj_id = ObjectId(wish_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Wish ID")
        
    # ลบข้อความออกจากฐานข้อมูลถาวร
    await wishes_collection.delete_one({"_id": obj_id})
    return {"message": "Wish deleted"}