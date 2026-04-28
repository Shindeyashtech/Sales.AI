# user.py
# User data structure for MongoDB

from datetime import datetime

def user_model(
    name:          str,
    email:         str,
    password:      str,
    org_id:        str,
    role:          str = "employee"
) -> dict:
    """
    Creates a user document for MongoDB

    Roles:
    - admin    → Can see all team calls
    - employee → Can see own calls only
    """
    return {
        "name":       name,
        "email":      email.lower(),
        "password":   password,    # already hashed
        "org_id":     org_id,
        "role":       role,
        "created_at": datetime.utcnow(),
        "is_active":  True
    }

def user_response(user: dict) -> dict:
    """
    Clean user data before sending to frontend
    Removes password for security!
    """
    return {
        "id":         str(user["_id"]),
        "name":       user["name"],
        "email":      user["email"],
        "org_id":     user["org_id"],
        "role":       user["role"],
        "created_at": str(user["created_at"])
    }