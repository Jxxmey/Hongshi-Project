from fastapi import APIRouter, Request
from database import db
from bson import ObjectId
import requests
import os

router = APIRouter(prefix="/webhook", tags=["Webhook"])

@router.post("/line")
async def line_webhook(request: Request):
    body = await request.json()
    events = body.get("events", [])
    
    print("👉 ได้รับข้อมูล Webhook จาก LINE:", events) # <--- เพิ่มตรงนี้
    
    for event in events:
        if event.get("type") == "postback":
            data = event["postback"]["data"]
            reply_token = event["replyToken"]
            
            print(f"👉 มีคนกดปุ่ม: {data}") # <--- เพิ่มตรงนี้
            
            msg = ""
            if data.startswith("approve_"):
                photo_id = data.replace("approve_", "")
                await db.gallery.update_one({"_id": ObjectId(photo_id)}, {"$set": {"status": "approved"}})
                msg = "✅ อนุมัติรูปภาพเรียบร้อยแล้ว"
                print("👉 อัปเดต DB สำเร็จ กำลังจะส่งข้อความตอบกลับ") # <--- เพิ่มตรงนี้
                
            elif data.startswith("reject_"):
                photo_id = data.replace("reject_", "")
                await db.gallery.update_one({"_id": ObjectId(photo_id)}, {"$set": {"status": "rejected"}})
                msg = "❌ ปฏิเสธรูปภาพเรียบร้อยแล้ว"

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
                response = requests.post("https://api.line.me/v2/bot/message/reply", headers=headers, json=reply_data)
                print("👉 ผลการตอบกลับ LINE:", response.status_code, response.text) # <--- เพิ่มตรงนี้เพื่อดูว่า LINE ตอบกลับว่าอะไร

    return "OK"