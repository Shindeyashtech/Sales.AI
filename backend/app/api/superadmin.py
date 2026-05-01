# superadmin.py
from fastapi import APIRouter, HTTPException, Header
from app.db.mongodb import get_db
from app.core.security import decode_token
from bson import ObjectId

router = APIRouter()

async def verify_superadmin(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authorized!")
    token = authorization.replace("Bearer ", "")
    data  = decode_token(token)
    if not data or data.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Super admin only!")
    return data

@router.get("/stats")
async def get_platform_stats(authorization: str = Header(None)):
    await verify_superadmin(authorization)
    db = get_db()
    total_orgs  = await db.organizations.count_documents(
    {"plan": {"$ne": "super"}}
)
    total_users = await db.users.count_documents(
    {"role": {"$ne": "superadmin"}}
)
    total_calls = await db.calls.count_documents({})
    return {
        "total_organizations": total_orgs,
        "total_users":         total_users,
        "total_calls":         total_calls
    }

@router.get("/organizations")
async def get_all_organizations(authorization: str = Header(None)):
    await verify_superadmin(authorization)
    db   = get_db()
    orgs = []
    async for org in db.organizations.find(
    {"plan": {"$ne": "super"}}
):
        member_count = await db.users.count_documents(
            {"org_id": str(org["_id"])}
        )
        call_count = await db.calls.count_documents(
            {"org_id": str(org["_id"])}
        )
        orgs.append({
            "id":          str(org["_id"]),
            "name":        org["name"],
            "org_code":    org.get("org_code", ""),
            "plan":        org.get("plan", "free"),
            "admin_email": org.get("admin_email", ""),
            "members":     member_count,
            "calls":       call_count,
            "created_at":  str(org.get("created_at", ""))
        })
    return {"organizations": orgs}

@router.get("/users")
async def get_all_users(authorization: str = Header(None)):
    await verify_superadmin(authorization)
    db    = get_db()
    users = []
    async for user in db.users.find({}):
        users.append({
            "id":         str(user["_id"]),
            "name":       user["name"],
            "email":      user["email"],
            "role":       user["role"],
            "org_id":     user["org_id"],
            "created_at": str(user.get("created_at", ""))
        })
    return {"users": users}

# ── DELETE ROUTES ──────────────────────────────────

@router.delete("/organization/{org_id}")
async def delete_organization(
    org_id:        str,
    authorization: str = Header(None)
):
    """
    Super admin deletes entire organization
    Also deletes all users and calls in that org!
    """
    await verify_superadmin(authorization)
    db = get_db()

    # Check org exists
    org = await db.organizations.find_one(
        {"_id": ObjectId(org_id)}
    )
    if not org:
        raise HTTPException(
            status_code=404,
            detail="Organization not found!"
        )

    # Delete all calls in org
    calls_deleted = await db.calls.delete_many(
        {"org_id": org_id}
    )

    # Delete all users in org
    users_deleted = await db.users.delete_many(
        {"org_id": org_id}
    )

    # Delete organization
    await db.organizations.delete_one(
        {"_id": ObjectId(org_id)}
    )

    return {
        "message":       "Organization deleted!",
        "calls_deleted": calls_deleted.deleted_count,
        "users_deleted": users_deleted.deleted_count
    }

@router.delete("/user/{user_id}")
async def delete_user_superadmin(
    user_id:       str,
    authorization: str = Header(None)
):
    """Super admin deletes any user"""
    await verify_superadmin(authorization)
    db = get_db()

    user = await db.users.find_one(
        {"_id": ObjectId(user_id)}
    )
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found!"
        )

    # Delete user's calls too
    await db.calls.delete_many({"user_id": user_id})

    # Delete user
    await db.users.delete_one({"_id": ObjectId(user_id)})

    return {"message": "User deleted successfully!"}

@router.delete("/call/{call_id}")
async def delete_call_superadmin(
    call_id:       str,
    authorization: str = Header(None)
):
    """Super admin deletes any call"""
    await verify_superadmin(authorization)
    db = get_db()

    await db.calls.delete_one({"_id": ObjectId(call_id)})
    return {"message": "Call deleted!"}