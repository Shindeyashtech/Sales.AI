from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def transcribe_audio(file_path: str) -> dict:
    try:
        print(f"Transcribing with Groq: {file_path}")
        with open(file_path, "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="verbose_json"
            )
        print("Transcription complete!")
        return {
            "success":    True,
            "transcript": transcription.text,
            "language":   getattr(transcription, 'language', 'en'),
            "segments":   getattr(transcription, 'segments', [])
        }
    except Exception as e:
        print(f"Transcription failed: {str(e)}")
        return {
            "success":    False,
            "error":      str(e),
            "transcript": None,
            "language":   "en"
        }