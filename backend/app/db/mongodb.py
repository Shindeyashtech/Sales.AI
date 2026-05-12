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
    print(f"URL: {MONGODB_URL[:50]}...")

    client = AsyncIOMotorClient(
        MONGODB_URL,
        serverSelectionTimeoutMS=30000,
        connectTimeoutMS=30000,
        socketTimeoutMS=30000,
        tls=True,
        tlsAllowInvalidCertificates=True
    )

    db = client[DATABASE_NAME]
    await client.admin.command('ping')
    print("Connected to MongoDB Atlas! ✅")

    await db.users.create_index("email", unique=True)
    await db.organizations.create_index(
        "org_code", unique=True
    )
    return db

async def close_db():
    global client
    if client:
        client.close()

def get_db():
    return db