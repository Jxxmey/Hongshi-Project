import os
import requests

# ดึงค่าจาก Environment Variables
LINE_ACCESS_TOKEN = os.getenv("LINE_ACCESS_TOKEN", "ใส่_TOKEN_ของคุณที่นี่")
LINE_TARGET_ID = os.getenv("LINE_TARGET_ID", "ใส่_USER_ID_หรือ_GROUP_ID_ที่นี่")

def send_image_upload_notification(image_url: str, uploader_name: str = "ไม่ระบุชื่อ"):
    """
    ฟังก์ชันสำหรับส่ง Push Message ผ่าน LINE Messaging API
    """
    url = "https://api.line.me/v2/bot/message/push"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}"
    }
    
    # โครงสร้างข้อความที่จะส่ง (ส่งทั้งข้อความและรูปภาพ)
    data = {
        "to": LINE_TARGET_ID,
        "messages": [
            {
                "type": "text",
                "text": f"📸 มีคนฝากรูปใหม่จาก: {uploader_name}\nลิงก์รูปภาพ: {image_url}"
            },
            # หมายเหตุ: การจะให้รูปเด้งโชว์ในแชท URL ของรูปต้องเป็น HTTPS และเป็น Public
            {
                "type": "image",
                "originalContentUrl": image_url,
                "previewImageUrl": image_url
            }
        ]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status() # เช็คว่าเกิด Error หรือไม่
        print("ส่งการแจ้งเตือน LINE สำเร็จ!")
        return True
    except requests.exceptions.RequestException as e:
        print(f"เกิดข้อผิดพลาดในการส่ง LINE: {e}")
        return False