# transcription.py
# This service converts audio file → text
# Using OpenAI Whisper (runs locally, free!)

import whisper
import os

# Load Whisper model once when server starts
# "base" model is good balance of speed and accuracy
# Other options: "tiny"(fastest), "small", "medium", "large"(best)
print("Loading Whisper model... please wait")
model = whisper.load_model("base")
print("Whisper model loaded!")

def transcribe_audio(file_path: str) -> dict:
    """
    Convert audio file to text
    
    Input:  file_path → location of audio file
    Output: dictionary with transcript and details
    """
    
    try:
        print(f"Transcribing: {file_path}")
        
        # This is the magic line!
        # Whisper listens to audio and converts to text
        result = model.transcribe(file_path)
        
        # result contains:
        # result["text"]     → full transcript
        # result["segments"] → text broken into time segments
        # result["language"] → detected language
        
        print("Transcription complete!")
        
        return {
            "success": True,
            "transcript": result["text"],
            "language": result["language"],
            "segments": result["segments"]
        }
        
    except Exception as e:
        print(f"Transcription failed: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "transcript": None
        }