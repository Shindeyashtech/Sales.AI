# security.py
# Handles password hashing and verification

from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()

# Password hashing setup
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
JWT_SECRET    = os.getenv("JWT_SECRET", "supersecretkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE    = int(os.getenv("JWT_EXPIRE_MINUTES", 10080))

def hash_password(password: str) -> str:
    """
    Convert plain password to hashed version
    Example: "mypass123" → "$2b$12$xxxxx..."
    """
    return pwd_context.hash(password)

def verify_password(plain: str, hashed: str) -> bool:
    """
    Check if plain password matches hashed
    Returns True or False
    """
    return pwd_context.verify(plain, hashed)

def create_token(data: dict) -> str:
    """
    Create JWT token for logged in user
    Token expires after JWT_EXPIRE minutes
    """
    to_encode = data.copy()

    # Set expiry time
    expire = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE)
    to_encode.update({"exp": expire})

    # Create token
    token = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_token(token: str) -> dict:
    """
    Decode JWT token and get user data
    Returns None if token is invalid
    """
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
        return payload
    except JWTError:
        return None