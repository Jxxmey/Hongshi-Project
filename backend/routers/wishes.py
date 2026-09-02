from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import db
from utils.profanity import contains_profanity

router = APIRouter()

wishes_collection = db.wishes
stats_collection = db.stats

class WishModel(BaseModel):
    name: str
    message: str

@router.post("/visit")
async def record_visit():
    await stats_collection.update_one(
        {"_id": "site_stats"},
        {"$inc": {"views": 1}},
        upsert=True
    )
    return {"message": "Visit recorded"}

@router.get("/wishes")
async def get_wishes():
    wishes = []
    cursor = wishes_collection.find({
        "$or": [{"reported": {"$exists": False}}, {"reported": False}]
    }).sort("_id", -1).limit(100)
    
    async for document in cursor:
        document["id"] = str(document["_id"])
        del document["_id"]
        wishes.append(document)
    return wishes

@router.post("/wishes")
async def create_wish(wish: WishModel):
    if contains_profanity(wish.name) or contains_profanity(wish.message):
        raise HTTPException(
            status_code=400,
            detail="ข้อความของคุณมีคำที่ไม่เหมาะสม กรุณาแก้ไขใหม่นะครับ 🩵"
        )
        
    new_wish = wish.model_dump()
    new_wish["reported"] = False
    
    result = await wishes_collection.insert_one(new_wish)
    new_wish["id"] = str(result.inserted_id)
    if "_id" in new_wish:
        del new_wish["_id"]
    return new_wish