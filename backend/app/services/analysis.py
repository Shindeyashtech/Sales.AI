# analysis.py
import requests

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3"

def analyze_call(transcript: str) -> dict:

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

Do NOT add any extra text before or after.
Do NOT combine lines together.
Each item MUST be on its own line.

Transcript:
{transcript}
"""

    try:
        print("Sending transcript to Llama3...")

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": MODEL_NAME,
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        response.raise_for_status()
        ai_response = response.json()["response"]

        print("=== LLAMA3 RESPONSE ===")
        print(ai_response)
        print("=== END ===")

        parsed = parse_analysis(ai_response)

        print("=== PARSED RESULT ===")
        print(parsed)
        print("=== END ===")

        return {
            "success": True,
            "analysis": ai_response,
            "parsed": parsed
        }

    except Exception as e:
        print(f"Analysis failed: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "analysis": None,
            "parsed": None
        }


def parse_analysis(text: str) -> dict:

    result = {
        "sentiment": "neutral",
        "customer_mood": "Not available",
        "objections": [],
        "score": 0,
        "strengths": [],
        "weaknesses": [],
        "tips": [],
        "summary": "Not available"
    }

    try:
        # Clean the text first
        text = text.strip()

        # Split into lines
        lines = text.split('\n')

        for line in lines:
            line = line.strip()

            # Skip empty lines
            if not line:
                continue

            # Skip lines without colon
            if ':' not in line:
                continue

            # Split into key and value
            key, _, value = line.partition(':')
            key   = key.strip().upper().replace(' ', '_')
            value = value.strip()

            # Skip empty values
            if not value:
                continue

            print(f"Parsing → KEY: '{key}' VALUE: '{value}'")

            if key == 'SENTIMENT':
                result['sentiment'] = value.lower()

            elif key == 'CUSTOMER_MOOD':
                result['customer_mood'] = value

            elif key == 'OBJECTIONS':
                    if value.lower() in ['none', 'none explicitly stated', 'no objections']:
                        result['objections'] = []
                    else:
                        items = value.split(',')
                        cleaned = []
                        for item in items:
                            # Remove "objection1=" prefix
                            if '=' in item:
                                item = item.split('=', 1)[1]
                            item = item.strip()
                            # Skip empty or "None" values
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
                    items = value.split(',')
                    cleaned = []
                    for item in items:
        # Remove "strength1=" prefix
                        if '=' in item:
                            item = item.split('=', 1)[1]
                        item = item.strip()
                        if item and item.lower() != 'none':
                            cleaned.append(item)
                    result['strengths'] = cleaned




            elif key == 'WEAKNESSES':
                items = value.split(',')
                cleaned = []
                for item in items:
                                        # Remove "weakness1=" #
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
        print(f"Parsing error: {str(e)}")

    return result