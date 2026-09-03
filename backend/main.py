from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from routers import gallery, webhook

# นำเข้า Routers จากโฟลเดอร์ routers
from routers import wishes, admin, gallery

load_dotenv()

app = FastAPI(title="Hongshi Birthday API")

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