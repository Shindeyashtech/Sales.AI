from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import Request
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

# Import all routers
from app.api.upload import router as upload_router
from app.api.auth import router as auth_router
from app.api.superadmin import router as superadmin_router
from app.api.admin import router as admin_router

# Register all routers
app.include_router(upload_router,    prefix="/api/v1",            tags=["Upload"])
app.include_router(auth_router,      prefix="/api/v1/auth",       tags=["Auth"])
app.include_router(superadmin_router,prefix="/api/v1/superadmin", tags=["SuperAdmin"])
app.include_router(admin_router,     prefix="/api/v1/admin",      tags=["Admin"])

@app.options("/{rest_of_path:path}")
async def preflight(request: Request, rest_of_path: str):
    return JSONResponse(
        content={},
        headers={
            "Access-Control-Allow-Origin":  "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
        }
    )

@app.get("/")
def home():
    return {"message": "Sales.AI Running!", "status": "healthy"}

@app.get("/health")
def health():
    return {"status": "healthy"}