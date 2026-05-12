from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL   = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "salesai")

_client = None
_db     = None

def get_db():
    global _client, _db
    if _db is None:
        _client = AsyncIOMotorClient(
            MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=30000
        )
        _db = _client[DATABASE_NAME]
    return _db

async def connect_db():
    get_db()
    print("MongoDB client ready!")

async def close_db():
    global _client
    if _client:
        _client.close()