# upload.py
# Now saves calls to MongoDB!
from bson import ObjectId
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Header
from app.services.transcription import transcribe_audio
from app.services.analysis import analyze_call
from app.models.call import call_model, call_response
from app.core.security import decode_token
from app.db.mongodb import get_db
import os
import tempfile

router = APIRouter()

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'flac', 'ogg'}

def allowed_file(filename):
    extension = filename.rsplit('.', 1)[-1].lower()
    return extension in ALLOWED_EXTENSIONS

@router.post("/upload")
async def upload_call(
    file:             UploadFile = File(...),
    salesperson_name: str        = Form("Unknown"),
    authorization:    str        = Header(None)
):
    """
    Upload audio file and analyze it
    Saves result to MongoDB
    """

    # Get user from token
    user_id = "anonymous"
    org_id  = "anonymous"

    if authorization:
        token = authorization.replace("Bearer ", "")
        data  = decode_token(token)
        if data:
            user_id = data.get("user_id", "anonymous")
            org_id  = data.get("org_id",  "anonymous")

    # Check file type
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type!"
        )

    # Save file temporarily
    temp_dir  = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)
    content   = await file.read()

    with open(temp_path, "wb") as f:
        f.write(content)

    try:
        # Transcribe audio
        print("Starting transcription...")
        transcription_result = transcribe_audio(temp_path)

        if not transcription_result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Transcription failed!"
            )

        transcript = transcription_result["transcript"]

        # Analyze with AI
        print("Starting AI analysis...")
        analysis_result = analyze_call(transcript)

        parsed = analysis_result.get("parsed") or {}

        # Save to MongoDB
        db   = get_db()
        call = call_model(
            user_id=          user_id,
            org_id=           org_id,
            salesperson_name= salesperson_name,
            filename=         file.filename,
            size_mb=          round(len(content) / (1024*1024), 2),
            language=         transcription_result["language"],
            transcript=       transcript,
            analysis=         analysis_result.get("analysis", ""),
            parsed=           parsed
        )

        result = await db.calls.insert_one(call)
        call["_id"] = result.inserted_id

        print(f"Call saved to MongoDB! ID: {result.inserted_id}")

        return call_response(call)

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


@router.get("/calls")
async def get_calls(
    authorization: str = Header(None)
):
    """
    Get calls based on user role:
    - Admin    → all org calls
    - Employee → own calls only
    """

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Not authorized!"
        )

    token = authorization.replace("Bearer ", "")
    data  = decode_token(token)

    if not data:
        raise HTTPException(
            status_code=401,
            detail="Invalid token!"
        )

    db      = get_db()
    user_id = data.get("user_id")
    org_id  = data.get("org_id")
    role    = data.get("role")

    # Admin sees all org calls
    # Employee sees only own calls
    if role == "admin":
        query = {"org_id": org_id}
    else:
        query = {
            "org_id":  org_id,
            "user_id": user_id
        }

    calls = []
    async for call in db.calls.find(query).sort(
        "uploaded_at", -1
    ):
        calls.append(call_response(call))

    return {"calls": calls}

@router.delete("/calls/{call_id}")
async def delete_own_call(
    call_id:       str,
    authorization: str = Header(None)
):
    """
    Employee deletes their OWN call only
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Not authorized!"
        )

    token   = authorization.replace("Bearer ", "")
    data    = decode_token(token)
    user_id = data.get("user_id")
    db      = get_db()

    # Find call - must belong to this user
    call = await db.calls.find_one({
        "_id":     ObjectId(call_id),
        "user_id": user_id
    })

    if not call:
        raise HTTPException(
            status_code=404,
            detail="Call not found!"
        )

    await db.calls.delete_one({"_id": ObjectId(call_id)})
    return {"message": "Call deleted!"}