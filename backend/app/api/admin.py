# admin.py
# Org Admin routes

from fastapi import APIRouter, HTTPException, Header
from app.db.mongodb import get_db
from app.core.security import decode_token
from bson import ObjectId

router = APIRouter()

async def verify_admin(authorization: str):
    """Check if user is org admin"""
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Not authorized!"
        )
    token = authorization.replace("Bearer ", "")
    data  = decode_token(token)

    if not data or data.get("role") not in ["admin", "superadmin"]:
        raise HTTPException(
            status_code=403,
            detail="Admin access required!"
        )
    return data

@router.get("/team")
async def get_team(authorization: str = Header(None)):
    """
    Get all employees in organization
    With their call statistics
    """
    admin_data = await verify_admin(authorization)
    org_id     = admin_data.get("org_id")
    db         = get_db()

    team = []
    async for user in db.users.find({
    "org_id": org_id,
    "role":   "employee"  # Only show employees!
}):
        user_id = str(user["_id"])

        # Get call stats for this user
        total_calls = await db.calls.count_documents(
            {"user_id": user_id}
        )

        # Get average score
        scores = []
        async for call in db.calls.find({"user_id": user_id}):
            scores.append(call.get("score", 0))

        avg_score = round(
            sum(scores) / len(scores), 1
        ) if scores else 0

        # Get positive calls count
        positive = await db.calls.count_documents({
            "user_id":  user_id,
            "sentiment": "positive"
        })

        team.append({
            "id":           user_id,
            "name":         user["name"],
            "email":        user["email"],
            "role":         user["role"],
            "total_calls":  total_calls,
            "avg_score":    avg_score,
            "positive_calls": positive,
            "created_at":   str(user.get("created_at", ""))
        })

    return {"team": team}

@router.delete("/employee/{user_id}")
async def delete_employee(
    user_id:       str,
    authorization: str = Header(None)
):
    """
    Org admin deletes employee
    Also deletes their calls
    """
    admin_data = await verify_admin(authorization)
    org_id     = admin_data.get("org_id")
    db         = get_db()

    # Find user
    user = await db.users.find_one({
        "_id":    ObjectId(user_id),
        "org_id": org_id
    })

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Employee not found!"
        )

    # Cannot delete another admin
    if user["role"] == "admin":
        raise HTTPException(
            status_code=403,
            detail="Cannot delete admin account!"
        )

    # Delete their calls
    calls_deleted = await db.calls.delete_many(
        {"user_id": user_id}
    )

    # Delete user
    await db.users.delete_one({"_id": ObjectId(user_id)})

    return {
        "message":       "Employee deleted!",
        "calls_deleted": calls_deleted.deleted_count
    }

@router.delete("/call/{call_id}")
async def delete_call_admin(
    call_id:       str,
    authorization: str = Header(None)
):
    """
    Org admin deletes any call in their org
    """
    admin_data = await verify_admin(authorization)
    org_id     = admin_data.get("org_id")
    db         = get_db()

    # Find call
    call = await db.calls.find_one({
        "_id":    ObjectId(call_id),
        "org_id": org_id
    })

    if not call:
        raise HTTPException(
            status_code=404,
            detail="Call not found!"
        )

    await db.calls.delete_one({"_id": ObjectId(call_id)})
    return {"message": "Call deleted!"}