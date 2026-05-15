# chat.py
# AI Chatbot API endpoint

from fastapi import APIRouter
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are Sales.AI assistant, a helpful chatbot for the Sales.AI platform.

About Sales.AI:
- AI powered sales call analyzer
- Upload audio calls and get instant analysis
- Features: transcription, sentiment analysis, objection detection, coaching tips
- Three roles: Super Admin (platform owner), Org Admin (manager), Employee (salesperson)
- Free to start, paid plans available
- Built with React, FastAPI, MongoDB, Groq AI

Answer questions about:
- What Sales.AI does
- How to get started
- Features and pricing
- How to join an organization
- Technical questions

Keep answers short, friendly and helpful.
Use emojis occasionally to be friendly.
"""

@router.post("/chat")
async def chat(data: dict):
    """AI chatbot endpoint"""
    try:
        message = data.get("message", "")

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system",  "content": SYSTEM_PROMPT},
                {"role": "user",    "content": message}
            ],
            max_tokens=300,
            temperature=0.7
        )

        return {
            "response": response.choices[0].message.content
        }

    except Exception as e:
        return {
            "response": "Sorry, I'm having trouble right now. Please try again!"
        }