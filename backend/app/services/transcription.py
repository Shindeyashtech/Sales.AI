# transcription.py
# Now using Groq Whisper API!
# FREE and works on any server!

from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def transcribe_audio(file_path: str) -> dict:
    """
    Convert audio file to text
    Using Groq Whisper API (FREE!)

    Input:  file_path
    Output: transcript dict
    """

    try:
        print(f"Transcribing with Groq: {file_path}")

        # Open audio file
        with open(file_path, "rb") as audio_file:

            # Send to Groq Whisper
            transcription = client.audio.transcriptions.create(
                model="whisper-large-v3",
                file=audio_file,
                response_format="verbose_json"
            )

        print("Transcription complete!")

        return {
            "success":    True,
            "transcript": transcription.text,
            "language":   getattr(
                transcription, 'language', 'en'
            ),
            "segments":   getattr(
                transcription, 'segments', []
            )
        }

    except Exception as e:
        print(f"Transcription failed: {str(e)}")
        return {
            "success":    False,
            "error":      str(e),
            "transcript": None,
            "language":   "en"
        }