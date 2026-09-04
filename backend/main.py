from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

# --- ส่วนที่เพิ่มเข้ามาสำหรับ Rate Limit ---
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
# -------------------------------------

# นำเข้า Routers จากโฟลเดอร์ routers
from routers import wishes, admin, gallery, webhook

load_dotenv()

# สร้างตัวจัดการ Rate Limit โดยดึง IP ของผู้ใช้งาน
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Hongshi Birthday API")

# --- นำ Limiter มาผูกกับตัวแอปพลิเคชันหลัก ---
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
# -----------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ระบบหน้าแรกแก้บัค 404
@app.get("/")
async def root():
    return {"message": "Welcome to Hongshi Birthday API! 🩵"}

# ผูก Routers เข้ากับแอปหลัก
app.include_router(wishes.router)
app.include_router(admin.router)
app.include_router(gallery.router)
app.include_router(webhook.router)