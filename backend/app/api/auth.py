# auth.py API routes
# Handles register and login

from fastapi import APIRouter, HTTPException
from app.schemas.auth import (
    RegisterOrganization,
    RegisterEmployee,
    LoginRequest,
    TokenResponse
)
from app.models.user import user_model, user_response
from app.models.organization import organization_model, org_response
from app.core.security import hash_password, verify_password, create_token
from app.db.mongodb import get_db
from bson import ObjectId

router = APIRouter()

@router.post("/register/organization")
async def register_organization(data: RegisterOrganization):
    """
    Register a new organization + admin account

    Steps:
    1. Check email not already used
    2. Create organization
    3. Create admin user
    4. Return token
    """
    db = get_db()

    # Check if email already exists
    existing = await db.users.find_one({"email": data.email.lower()})
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered!"
        )

    # Create organization
    org = organization_model(
        name=        data.org_name,
        admin_email= data.email
    )
    org_result = await db.organizations.insert_one(org)
    org_id     = str(org_result.inserted_id)

    # Create admin user
    user = user_model(
        name=     data.name,
        email=    data.email,
        password= hash_password(data.password),
        org_id=   org_id,
        role=     "admin"
    )
    await db.users.insert_one(user)

    # Get org code to show user
    saved_org = await db.organizations.find_one(
        {"_id": org_result.inserted_id}
    )

    return {
        "message":  "Organization created successfully!",
        "org_name": data.org_name,
        "org_code": saved_org["org_code"],
        "role":     "admin"
    }


@router.post("/register/employee")
async def register_employee(data: RegisterEmployee):
    """
    Register employee using organization code

    Steps:
    1. Find organization by org_code
    2. Check email not already used
    3. Create employee account
    4. Return token
    """
    db = get_db()

    # Find organization by code
    org = await db.organizations.find_one(
        {"org_code": data.org_code.upper()}
    )
    if not org:
        raise HTTPException(
            status_code=404,
            detail="Organization code not found!"
        )

    # Check email not already used
    existing = await db.users.find_one(
        {"email": data.email.lower()}
    )
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered!"
        )

    # Create employee
    user = user_model(
        name=     data.name,
        email=    data.email,
        password= hash_password(data.password),
        org_id=   str(org["_id"]),
        role=     "employee"
    )
    await db.users.insert_one(user)

    return {
        "message":  "Account created successfully!",
        "org_name": org["name"],
        "role":     "employee"
    }


@router.post("/login")
async def login(data: LoginRequest):
    """
    Login with email and password
    Returns JWT token
    """
    db = get_db()

    # Find user by email
    user = await db.users.find_one(
        {"email": data.email.lower()}
    )
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password!"
        )

    # Check password
    if not verify_password(data.password, user["password"]):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password!"
        )

    # Get organization
    org = await db.organizations.find_one(
        {"_id": ObjectId(user["org_id"])}
    )

    # Create JWT token
    token = create_token({
        "user_id":  str(user["_id"]),
        "email":    user["email"],
        "role":     user["role"],
        "org_id":   user["org_id"]
    })

    return {
        "access_token": token,
        "token_type":   "bearer",
        "user_name":    user["name"],
        "user_role":    user["role"],
        "org_id":       user["org_id"],
        "org_name":     org["name"] if org else "Unknown"
    }