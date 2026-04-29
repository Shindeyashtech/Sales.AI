# security.py
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET    = os.getenv("JWT_SECRET", "supersecretkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE    = int(os.getenv("JWT_EXPIRE_MINUTES", 10080))

def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    pwd_bytes = password.encode('utf-8')
    salt      = bcrypt.gensalt()
    hashed    = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain: str, hashed: str) -> bool:
    """Verify password against hash"""
    return bcrypt.checkpw(
        plain.encode('utf-8'),
        hashed.encode('utf-8')
    )

def create_token(data: dict) -> str:
    """Create JWT token"""
    to_encode = data.copy()
    expire    = datetime.utcnow() + timedelta(minutes=JWT_EXPIRE)
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        JWT_SECRET,
        algorithm=JWT_ALGORITHM
    )

def decode_token(token: str) -> dict:
    """Decode JWT token"""
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM]
        )
    except JWTError:
        return None