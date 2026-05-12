from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGODB_URL   = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "salesai")

client = None
db     = None

async def connect_db():
    global client, db
    print("Connecting to MongoDB Atlas...")

    client = AsyncIOMotorClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=5000,
        tls=True,
        tlsAllowInvalidCertificates=True,
        retryWrites=True
    )
    db = client[DATABASE_NAME]
    print("MongoDB client created! ✅")
    return db

async def close_db():
    global client
    if client:
        client.close()

def get_db():
    global client, db
    if db is None:
        client = AsyncIOMotorClient(
            MONGODB_URL,
            serverSelectionTimeoutMS=5000,
            tls=True,
            tlsAllowInvalidCertificates=True,
            retryWrites=True
        )
        db = client[DATABASE_NAME]
    return db