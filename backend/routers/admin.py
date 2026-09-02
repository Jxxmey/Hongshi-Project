from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
from database import db
import cloudinary.uploader

router = APIRouter(prefix="/admin", tags=["Admin"])

wishes_collection = db.wishes
stats_collection = db.stats
gallery_collection = db.gallery

# --- จัดการสถิติและคำอวยพร ---
@router.get("/stats")
async def get_stats():
    stats = await stats_collection.find_one({"_id": "site_stats"})
    return {"views": stats.get("views", 0)} if stats else {"views": 0}

@router.get("/reports")
async def get_reported_wishes():
    wishes = []
    cursor = wishes_collection.find({"reported": True}).sort("_id", -1)
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        wishes.append(document)
    return wishes

@router.post("/wishes/{wish_id}/dismiss")
async def dismiss_report(wish_id: str):
    obj_id = ObjectId(wish_id)
    await wishes_collection.update_one({"_id": obj_id}, {"$set": {"reported": False}})
    return {"message": "Report dismissed"}

@router.delete("/wishes/{wish_id}")
async def delete_wish(wish_id: str):
    obj_id = ObjectId(wish_id)
    await wishes_collection.delete_one({"_id": obj_id})
    return {"message": "Wish deleted"}

# ==========================================
# จัดการ Gallery
# ==========================================
@router.get("/gallery/pending")
async def get_pending_photos():
    photos = []
    cursor = gallery_collection.find({"status": "pending"}).sort("createdAt", -1)
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        photos.append(doc)
    return photos

@router.post("/gallery/{photo_id}/approve")
async def approve_photo(photo_id: str):
    obj_id = ObjectId(photo_id)
    await gallery_collection.update_one({"_id": obj_id}, {"$set": {"status": "approved"}})
    return {"message": "Photo approved"}

@router.delete("/gallery/{photo_id}")
async def reject_photo(photo_id: str):
    try:
        obj_id = ObjectId(photo_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid Photo ID")

    # 1. ค้นหารูปใน MongoDB ก่อนเพื่อเอา cloudinary_id
    photo = await gallery_collection.find_one({"_id": obj_id})
    
    if photo and "cloudinary_id" in photo:
        try:
            # 2. สั่งลบรูปออกจาก Cloudinary
            cloudinary.uploader.destroy(photo["cloudinary_id"])
        except Exception as e:
            print("Error deleting from Cloudinary:", e)
            
    # 3. ลบเอกสารออกจาก MongoDB
    await gallery_collection.delete_one({"_id": obj_id})
    
    return {"message": "Photo rejected and deleted completely"}