# organization.py
# Organization data structure for MongoDB

from datetime import datetime
import random
import string

def generate_org_code(length=8) -> str:
    """
    Generate unique organization code
    Example: "SALES123"
    Employees use this to join organization
    """
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choices(chars, k=length))

def organization_model(
    name:        str,
    admin_email: str,
    plan:        str = "free"
) -> dict:
    """
    Creates an organization document for MongoDB
    """
    return {
        "name":        name,
        "admin_email": admin_email.lower(),
        "org_code":    generate_org_code(),
        "plan":        plan,
        "created_at":  datetime.utcnow(),
        "is_active":   True,
        "members":     []
    }

def org_response(org: dict) -> dict:
    """
    Clean org data before sending to frontend
    """
    return {
        "id":          str(org["_id"]),
        "name":        org["name"],
        "org_code":    org["org_code"],
        "plan":        org["plan"],
        "admin_email": org["admin_email"],
        "created_at":  str(org["created_at"])
    }