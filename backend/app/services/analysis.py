# analysis.py
# This service sends transcript to Llama3
# And gets AI coaching feedback

import requests
import json

# Ollama runs locally on port 11434
OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"

def analyze_call(transcript: str) -> dict:
    """
    Send transcript to Llama3 for analysis
    
    Input:  transcript → the text from audio
    Output: AI coaching feedback
    """
    
    # This is our prompt
    # We tell AI exactly what to analyze
    prompt = f"""
You are an expert AI sales coach. 
Analyze this sales call transcript carefully.

Provide your analysis in this EXACT format:

SENTIMENT: [positive/negative/neutral]
CUSTOMER_MOOD: [one sentence about customer mood]
OBJECTIONS: [list the objections customer raised]
SALESPERSON_SCORE: [score out of 10]
STRENGTHS: [what salesperson did well]
WEAKNESSES: [what salesperson needs to improve]
COACHING_TIPS: [3 specific actionable tips]
SUMMARY: [2 sentence overall summary]

Sales Call Transcript:
{transcript}
"""

    try:
        print("Sending transcript to Llama3...")
        
        # Send request to Ollama
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False  # Wait for complete response
            },
            timeout=120  # Wait max 2 minutes
        )
        
        response.raise_for_status()
        
        # Get AI response
        ai_response = response.json()["response"]
        
        print("Analysis complete!")
        
        return {
            "success": True,
            "analysis": ai_response
        }
        
    except Exception as e:
        print(f"Analysis failed: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "analysis": None
        }