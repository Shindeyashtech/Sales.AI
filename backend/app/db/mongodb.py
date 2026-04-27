# mongodb.py
# Connects our backend to MongoDB Atlas

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Get MongoDB URL from .env
MONGODB_URL   = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "salesai")

# Global database client
client = None
db     = None

async def connect_db():
    """Connect to MongoDB Atlas"""
    global client, db

    print("Connecting to MongoDB Atlas...")
    client = AsyncIOMotorClient(MONGODB_URL)
    db     = client[DATABASE_NAME]
    print("Connected to MongoDB Atlas! ✅")

    # Create indexes for faster queries
    await db.users.create_index("email", unique=True)
    await db.organizations.create_index("org_code", unique=True)

    return db

async def close_db():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("MongoDB connection closed!")

def get_db():
    """Get database instance"""
    return db