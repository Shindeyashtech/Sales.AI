# auth.py schemas
# Defines what data we expect from frontend

from pydantic import BaseModel, EmailStr

class RegisterOrganization(BaseModel):
    """
    When a company registers:
    They create organization + admin account
    """
    org_name:  str
    name:      str
    email:     EmailStr
    password:  str

class RegisterEmployee(BaseModel):
    """
    When employee joins:
    They use org_code to join their company
    """
    org_code:  str
    name:      str
    email:     EmailStr
    password:  str

class LoginRequest(BaseModel):
    """
    Login with email and password
    """
    email:    EmailStr
    password: str

class TokenResponse(BaseModel):
    """
    What we send back after login
    """
    access_token: str
    token_type:   str = "bearer"
    user_name:    str
    user_role:    str
    org_id:       str
    org_name:     str