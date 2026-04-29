# main.py
# FastAPI Backend with MongoDB

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.upload import router as upload_router
from app.api.auth import router as auth_router
from app.api.superadmin import router as superadmin_router
from app.db.mongodb import connect_db, close_db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Sales.AI Backend",
    description="AI Sales Call Analyzer API",
    version="2.0.0"
)

# D76TN48Z

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB when app starts
@app.on_event("startup")
async def startup():
    await connect_db()
    print("App started!")

# Close MongoDB when app stops
@app.on_event("shutdown")
async def shutdown():
    await close_db()
    print("App stopped!")

# Routes
app.include_router(
    upload_router,
    prefix="/api/v1",
    tags=["Upload"]
)
app.include_router(
    auth_router,
    prefix="/api/v1/auth",
    tags=["Authentication"]
)
app.include_router(
    superadmin_router,
    prefix="/api/v1/superadmin",
    tags=["Super Admin"]
)
@app.get("/")
def home():
    return {
        "message": "Sales.AI Backend Running!",
        "version": "2.0.0",
        "status":  "healthy"
    }

@app.get("/health")
def health():
    return {
        "status":   "healthy",
        "database": "MongoDB Atlas",
        "ai":       "TinyLlama"
    }
