# analysis.py
# Now using Groq API instead of Ollama!
# Groq is FREE and much faster!

from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

def analyze_call(transcript: str) -> dict:
    """
    Send transcript to Groq/Llama3
    for AI analysis
    """

    prompt = f"""You are an expert AI sales coach.
Analyze this sales call transcript.
Reply in EXACTLY this format on separate lines:

SENTIMENT: positive
CUSTOMER_MOOD: write one sentence here
OBJECTIONS: objection1, objection2, objection3
SCORE: 7
STRENGTHS: strength1, strength2, strength3
WEAKNESSES: weakness1, weakness2, weakness3
TIP1: write first tip here
TIP2: write second tip here
TIP3: write third tip here
SUMMARY: write two sentences here

Rules:
- Do NOT add extra text
- Each item on its own line
- No "strength1=" format
- Just write values directly

Transcript:
{transcript}
"""

    try:
        print("Sending to Groq API...")

        # Call Groq API
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )

        # Get response text
        ai_response = response.choices[0].message.content

        print("=== GROQ RESPONSE ===")
        print(ai_response)
        print("=== END ===")

        # Parse response
        parsed = parse_analysis(ai_response)

        # Calculate our smart score
        our_score        = calculate_score(parsed)
        parsed['score']  = our_score

        print("=== PARSED ===")
        print(parsed)
        print("=== END ===")

        return {
            "success":  True,
            "analysis": ai_response,
            "parsed":   parsed
        }

    except Exception as e:
        print(f"Groq analysis failed: {str(e)}")
        return {
            "success":  False,
            "error":    str(e),
            "analysis": None,
            "parsed":   None
        }


def calculate_score(parsed: dict) -> int:
    """Smart scoring formula"""

    score = 5.0

    sentiment  = parsed.get('sentiment', 'neutral')
    strengths  = parsed.get('strengths', [])
    weaknesses = parsed.get('weaknesses', [])
    objections = parsed.get('objections', [])
    tips       = parsed.get('tips', [])

    if sentiment == 'positive':
        score += 2
    elif sentiment == 'negative':
        score -= 2

    score += len(strengths)  * 0.5
    score -= len(weaknesses) * 0.5
    score -= len(objections) * 0.5

    if len(tips) >= 3:
        score += 0.5

    score = max(1, min(10, score))
    return round(score)


def parse_analysis(text: str) -> dict:
    """Parse AI response into structured data"""

    result = {
        "sentiment":     "neutral",
        "customer_mood": "Not available",
        "objections":    [],
        "score":         0,
        "strengths":     [],
        "weaknesses":    [],
        "tips":          [],
        "summary":       "Not available"
    }

    try:
        lines = text.strip().split('\n')

        for line in lines:
            line = line.strip()
            if not line or ':' not in line:
                continue

            key, _, value = line.partition(':')
            key   = key.strip().upper().replace(' ', '_')
            value = value.strip()

            if not value:
                continue

            if key == 'SENTIMENT':
                result['sentiment'] = value.lower()

            elif key == 'CUSTOMER_MOOD':
                result['customer_mood'] = value

            elif key == 'OBJECTIONS':
                if value.lower() in [
                    'none', 'no objections', 'n/a'
                ]:
                    result['objections'] = []
                else:
                    cleaned = []
                    for item in value.split(','):
                        if '=' in item:
                            item = item.split('=', 1)[1]
                        item = item.strip()
                        if item and item.lower() != 'none':
                            cleaned.append(item)
                    result['objections'] = cleaned

            elif key == 'SCORE':
                try:
                    result['score'] = int(
                        value.split('/')[0]
                             .split('.')[0]
                             .strip()
                    )
                except:
                    result['score'] = 5

            elif key == 'STRENGTHS':
                cleaned = []
                for item in value.split(','):
                    if '=' in item:
                        item = item.split('=', 1)[1]
                    item = item.strip()
                    if item and item.lower() != 'none':
                        cleaned.append(item)
                result['strengths'] = cleaned

            elif key == 'WEAKNESSES':
                cleaned = []
                for item in value.split(','):
                    if '=' in item:
                        item = item.split('=', 1)[1]
                    item = item.strip()
                    if item and item.lower() != 'none':
                        cleaned.append(item)
                result['weaknesses'] = cleaned

            elif key == 'TIP1':
                result['tips'].append(value)

            elif key == 'TIP2':
                result['tips'].append(value)

            elif key == 'TIP3':
                result['tips'].append(value)

            elif key == 'SUMMARY':
                result['summary'] = value

    except Exception as e:
        print(f"Parse error: {str(e)}")

    return result


# # analysis.py
# import requests

# OLLAMA_URL = "http://localhost:11434/api/generate"
# MODEL_NAME = "llama3"

# def analyze_call(transcript: str) -> dict:

#     prompt = f"""You are an expert AI sales coach.
# Analyze this sales call transcript.
# Reply in EXACTLY this format on separate lines:

# SENTIMENT: positive
# CUSTOMER_MOOD: write one sentence here
# OBJECTIONS: objection1, objection2, objection3
# SCORE: 7
# STRENGTHS: strength1, strength2, strength3
# WEAKNESSES: weakness1, weakness2, weakness3
# TIP1: write first tip here
# TIP2: write second tip here
# TIP3: write third tip here
# SUMMARY: write two sentences here

# Do NOT add any extra text before or after.
# Do NOT combine lines together.
# Each item MUST be on its own line.

# Transcript:
# {transcript}
# """

#     try:
#         print("Sending transcript to Llama3...")

#         response = requests.post(
#             OLLAMA_URL,
#             json={
#                 "model": MODEL_NAME,
#                 "prompt": prompt,
#                 "stream": False
#             },
#             timeout=120
#         )

#         response.raise_for_status()
#         ai_response = response.json()["response"]

#         print("=== LLAMA3 RESPONSE ===")
#         print(ai_response)
#         print("=== END ===")

#         parsed = parse_analysis(ai_response)
#         our_score = calculate_score(parsed)
#         parsed['score'] = our_score
#         print(f"Our calculated score: {our_score}")

#         print("=== PARSED RESULT ===")
#         print(parsed)
#         print("=== END ===")

#         return {
#             "success": True,
#             "analysis": ai_response,
#             "parsed": parsed
#         }

#     except Exception as e:
#         print(f"Analysis failed: {str(e)}")
#         return {
#             "success": False,
#             "error": str(e),
#             "analysis": None,
#             "parsed": None
#         }

# def calculate_score(parsed: dict) -> int:
#     """
#     Calculate our own smart score
#     Based on multiple factors
    
#     Formula:
#     - Base score: 5
#     - Sentiment positive  → +2
#     - Sentiment negative  → -2
#     - Sentiment neutral   → +0
#     - Each strength       → +0.5
#     - Each weakness       → -0.5
#     - Each objection      → -0.5
#     - Min score: 1
#     - Max score: 10
#     """

#     score = 5.0  # start with base score

#     # Sentiment impact
#     sentiment = parsed.get('sentiment', 'neutral')
#     if sentiment == 'positive':
#         score += 2
#     elif sentiment == 'negative':
#         score -= 2

#     # Strengths impact
#     strengths = parsed.get('strengths', [])
#     score += len(strengths) * 0.5

#     # Weaknesses impact
#     weaknesses = parsed.get('weaknesses', [])
#     score -= len(weaknesses) * 0.5

#     # Objections impact
#     objections = parsed.get('objections', [])
#     score -= len(objections) * 0.5

#     # Tips available bonus
#     tips = parsed.get('tips', [])
#     if len(tips) >= 3:
#         score += 0.5

#     # Keep score between 1 and 10
#     score = max(1, min(10, score))

#     # Round to nearest whole number
#     final_score = round(score)

#     print(f"Score Calculation:")
#     print(f"  Base:       5.0")
#     print(f"  Sentiment:  {sentiment}")
#     print(f"  Strengths:  +{len(strengths) * 0.5}")
#     print(f"  Weaknesses: -{len(weaknesses) * 0.5}")
#     print(f"  Objections: -{len(objections) * 0.5}")
#     print(f"  Final:      {final_score}")

#     return final_score

# def parse_analysis(text: str) -> dict:

#     result = {
#         "sentiment": "neutral",
#         "customer_mood": "Not available",
#         "objections": [],
#         "score": 0,
#         "strengths": [],
#         "weaknesses": [],
#         "tips": [],
#         "summary": "Not available"
#     }

#     try:
#         # Clean the text first
#         text = text.strip()

#         # Split into lines
#         lines = text.split('\n')

#         for line in lines:
#             line = line.strip()

#             # Skip empty lines
#             if not line:
#                 continue

#             # Skip lines without colon
#             if ':' not in line:
#                 continue

#             # Split into key and value
#             key, _, value = line.partition(':')
#             key   = key.strip().upper().replace(' ', '_')
#             value = value.strip()

#             # Skip empty values
#             if not value:
#                 continue

#             print(f"Parsing → KEY: '{key}' VALUE: '{value}'")

#             if key == 'SENTIMENT':
#                 result['sentiment'] = value.lower()

#             elif key == 'CUSTOMER_MOOD':
#                 result['customer_mood'] = value

#             elif key == 'OBJECTIONS':
#                     if value.lower() in ['none', 'none explicitly stated', 'no objections']:
#                         result['objections'] = []
#                     else:
#                         items = value.split(',')
#                         cleaned = []
#                         for item in items:
#                             # Remove "objection1=" prefix
#                             if '=' in item:
#                                 item = item.split('=', 1)[1]
#                             item = item.strip()
#                             # Skip empty or "None" values
#                             if item and item.lower() != 'none':
#                                 cleaned.append(item)
#                         result['objections'] = cleaned
#             elif key == 'SCORE':
#                 try:
#                     result['score'] = int(
#                         value.split('/')[0]
#                             .split('.')[0]
#                             .strip()
#                     )
#                 except:
#                     result['score'] = 5


#             elif key == 'STRENGTHS':
#                     items = value.split(',')
#                     cleaned = []
#                     for item in items:
#         # Remove "strength1=" prefix
#                         if '=' in item:
#                             item = item.split('=', 1)[1]
#                         item = item.strip()
#                         if item and item.lower() != 'none':
#                             cleaned.append(item)
#                     result['strengths'] = cleaned




#             elif key == 'WEAKNESSES':
#                 items = value.split(',')
#                 cleaned = []
#                 for item in items:
#                                         # Remove "weakness1=" #
#                                         if '=' in item:
#                                             item = item.split('=', 1)[1]
#                                             item = item.strip()
#                                         if item and item.lower() != 'none':
#                                             cleaned.append(item)
#                                         result['weaknesses'] = cleaned

#             elif key == 'TIP1':
#                 result['tips'].append(value)

#             elif key == 'TIP2':
#                 result['tips'].append(value)

#             elif key == 'TIP3':
#                 result['tips'].append(value)

#             elif key == 'SUMMARY':
#                 result['summary'] = value

#     except Exception as e:
#         print(f"Parsing error: {str(e)}")

#     return result