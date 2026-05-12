from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Sales.AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.upload import router as upload_router
from app.api.auth import router as auth_router
from app.api.superadmin import router as superadmin_router
from app.api.admin import router as admin_router

app.include_router(upload_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1/auth")
app.include_router(superadmin_router, prefix="/api/v1/superadmin")
app.include_router(admin_router, prefix="/api/v1/admin")

@app.get("/")
def home():
    return {"message": "Sales.AI Running!", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "healthy"}