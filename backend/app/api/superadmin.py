# superadmin.py
# Super admin can see everything!

from fastapi import APIRouter, HTTPException, Header
from app.db.mongodb import get_db
from app.core.security import decode_token

router = APIRouter()

async def verify_superadmin(authorization: str = Header(None)):
    """Check if user is super admin"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authorized!")

    token = authorization.replace("Bearer ", "")
    data  = decode_token(token)

    if not data or data.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Super admin only!")

    return data

@router.get("/stats")
async def get_platform_stats(
    authorization: str = Header(None)
):
    """
    Get overall platform statistics
    Only super admin can see this!
    """
    await verify_superadmin(authorization)
    db = get_db()

    # Count everything
    total_orgs  = await db.organizations.count_documents({})
    total_users = await db.users.count_documents({})
    total_calls = await db.calls.count_documents({})

    return {
        "total_organizations": total_orgs,
        "total_users":         total_users,
        "total_calls":         total_calls
    }

@router.get("/organizations")
async def get_all_organizations(
    authorization: str = Header(None)
):
    """Get all registered organizations"""
    await verify_superadmin(authorization)
    db = get_db()

    orgs = []
    async for org in db.organizations.find({}):
        # Count members for each org
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
async def get_all_users(
    authorization: str = Header(None)
):
    """Get all registered users"""
    await verify_superadmin(authorization)
    db = get_db()

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