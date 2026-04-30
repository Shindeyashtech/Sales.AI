# call.py
# Call data structure for MongoDB

from datetime import datetime

def call_model(
    user_id:          str,
    org_id:           str,
    salesperson_name: str,
    filename:         str,
    size_mb:          float,
    language:         str,
    transcript:       str,
    analysis:         str,
    parsed:           dict,
) -> dict:
    """
    Creates a call document for MongoDB

    Every call is linked to:
    - user_id  → who uploaded it
    - org_id   → which organization
    """
    return {
        "user_id":          user_id,
        "org_id":           org_id,
        "salesperson_name": salesperson_name,
        "filename":         filename,
        "size_mb":          size_mb,
        "language":         language,
        "transcript":       transcript,
        "analysis":         analysis,
        "parsed":           parsed,
        "score":            parsed.get("score", 0),
        "sentiment":        parsed.get("sentiment", "neutral"),
        "uploaded_at":      datetime.utcnow(),
    }

def call_response(call: dict) -> dict:
    """
    Clean call data before sending to frontend
    """
    return {
        "id":               str(call["_id"]),
        "user_id":          call["user_id"],
        "org_id":           call["org_id"],
        "salesperson_name": call["salesperson_name"],
        "filename":         call["filename"],
        "size_mb":          call["size_mb"],
        "language":         call["language"],
        "transcript":       call["transcript"],
        "analysis":         call["analysis"],
        "parsed":           call["parsed"],
        "score":            call["score"],
        "sentiment":        call["sentiment"],
        "uploaded_at":      str(call["uploaded_at"])
    }