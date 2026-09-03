from fastapi import APIRouter, Request
from database import db
from bson import ObjectId
import requests
import os

router = APIRouter(prefix="/webhook", tags=["Webhook"])

@router.post("/line")
async def line_webhook(request: Request):
    # รับข้อมูลที่ LINE ส่งมา
    body = await request.json()
    events = body.get("events", [])
    
    for event in events:
        # ตรวจสอบว่าเป็นการ "กดปุ่ม" (postback) ใช่หรือไม่
        if event.get("type") == "postback":
            data = event["postback"]["data"] # จะได้ค่า เช่น "approve_xxxx" หรือ "reject_xxxx"
            reply_token = event["replyToken"] # ใช้สำหรับตอบกลับ
            
            msg = ""
            
            # แยกคำสั่งกับ ID รูปออกจากกัน
            if data.startswith("approve_"):
                photo_id = data.replace("approve_", "")
                # อัปเดตฐานข้อมูล
                await db.gallery.update_one({"_id": ObjectId(photo_id)}, {"$set": {"status": "approved"}})
                msg = "✅ อนุมัติรูปภาพเรียบร้อยแล้ว รูปจะแสดงบนหน้าเว็บทันทีครับ"
                
            elif data.startswith("reject_"):
                photo_id = data.replace("reject_", "")
                # อัปเดตฐานข้อมูล
                await db.gallery.update_one({"_id": ObjectId(photo_id)}, {"$set": {"status": "rejected"}})
                msg = "❌ ปฏิเสธรูปภาพเรียบร้อยแล้ว"

            # ตอบกลับแอดมินว่าทำรายการสำเร็จ
            if msg:
                LINE_ACCESS_TOKEN = os.getenv("LINE_ACCESS_TOKEN")
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {LINE_ACCESS_TOKEN}"
                }
                reply_data = {
                    "replyToken": reply_token,
                    "messages": [{"type": "text", "text": msg}]
                }
                requests.post("https://api.line.me/v2/bot/message/reply", headers=headers, json=reply_data)

    # ส่ง HTTP 200 OK กลับไปให้ LINE รู้ว่าเรารับข้อมูลสำเร็จ
    return "OK"