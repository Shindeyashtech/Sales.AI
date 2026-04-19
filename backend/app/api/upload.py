# upload.py
# Now includes transcription + analysis!

from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.transcription import transcribe_audio
from app.services.analysis import analyze_call
import os
import tempfile

router = APIRouter()

ALLOWED_EXTENSIONS = {'mp3', 'wav', 'm4a', 'flac', 'ogg'}

def allowed_file(filename):
    extension = filename.rsplit('.', 1)[-1].lower()
    return extension in ALLOWED_EXTENSIONS

@router.post("/upload")
async def upload_call(file: UploadFile = File(...)):
    """
    Main upload endpoint
    
    Steps:
    1. Validate file type
    2. Save file temporarily  
    3. Transcribe audio → text
    4. Analyze transcript with AI
    5. Return everything to frontend
    """

    # Step 1: Check file type
    if not allowed_file(file.filename):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Use MP3, WAV, M4A or FLAC"
        )

    # Step 2: Save file temporarily
    temp_dir = tempfile.gettempdir()
    temp_path = os.path.join(temp_dir, file.filename)

    content = await file.read()
    with open(temp_path, "wb") as f:
        f.write(content)

    try:
        # Step 3: Transcribe audio to text
        print("Starting transcription...")
        transcription_result = transcribe_audio(temp_path)

        if not transcription_result["success"]:
            raise HTTPException(
                status_code=500,
                detail=f"Transcription failed: {transcription_result['error']}"
            )

        transcript = transcription_result["transcript"]

        # Step 4: Analyze with Llama3
        print("Starting AI analysis...")
        analysis_result = analyze_call(transcript)

        # Step 5: Return everything
        return {
            "message": "Analysis complete!",
            "filename": file.filename,
            "size_mb": round(len(content) / (1024 * 1024), 2),
            "transcript": transcript,
            "language": transcription_result["language"],
            "analysis": analysis_result["analysis"],
            "status": "completed"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        # Always clean up temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)