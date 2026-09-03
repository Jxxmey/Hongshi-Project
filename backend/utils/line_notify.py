import os
import requests

def send_image_upload_notification(image_url: str, uploader_name: str, photo_id: str):
    LINE_ACCESS_TOKEN = os.getenv("LINE_ACCESS_TOKEN")
    LINE_TARGET_ID = os.getenv("LINE_TARGET_ID")
    
    if not LINE_ACCESS_TOKEN or not LINE_TARGET_ID:
        return False

    url = "https://api.line.me/v2/bot/message/push"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {LINE_ACCESS_TOKEN}"
    }
    
    # สร้าง Flex Message
    flex_message = {
        "type": "flex",
        "altText": f"มีคนฝากรูปใหม่จาก {uploader_name} รอการอนุมัติครับ",
        "contents": {
            "type": "bubble",
            "hero": {
                "type": "image",
                "url": image_url,
                "size": "full",
                "aspectRatio": "1:1",
                "aspectMode": "cover"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "📸 มีผู้ฝากรูปล่าสุด",
                        "weight": "bold",
                        "size": "xl"
                    },
                    {
                        "type": "text",
                        "text": f"ผู้ส่ง: {uploader_name}",
                        "margin": "md",
                        "color": "#666666"
                    }
                ]
            },
            "footer": {
                "type": "box",
                "layout": "horizontal",
                "spacing": "sm",
                "contents": [
                    {
                        "type": "button",
                        "style": "primary",
                        "color": "#2ecc71", # สีเขียว
                        "action": {
                            "type": "postback",
                            "label": "อนุมัติ",
                            "data": f"approve_{photo_id}", # ฝังคำสั่งอนุมัติและ ID
                            "displayText": "ฉันขออนุมัติรูปนี้" # ข้อความที่จะแสดงในแชทเมื่อกด
                        }
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "color": "#e74c3c", # สีแดง
                        "action": {
                            "type": "postback",
                            "label": "ปฏิเสธ",
                            "data": f"reject_{photo_id}", # ฝังคำสั่งปฏิเสธและ ID
                            "displayText": "ฉันขอปฏิเสธรูปนี้"
                        }
                    }
                ]
            }
        }
    }
    
    data = {
        "to": LINE_TARGET_ID,
        "messages": [flex_message]
    }
    
    try:
        requests.post(url, headers=headers, json=data)
        return True
    except:
        return False