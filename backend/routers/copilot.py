from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user, TokenData
from typing import Optional
import os
import google.generativeai as genai
from google.api_core.exceptions import ResourceExhausted, GoogleAPICallError

router = APIRouter()


@router.post("/chat")
async def chat(
    body: dict,
    current_user: TokenData = Depends(get_current_user),
):
    """
    AI Copilot chat endpoint.
    Receives messages array, returns AI response.
    Integrates with Gemini API.
    """
    messages = body.get("messages", [])
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {"response": "AI Copilot requires GEMINI_API_KEY environment variable."}

    if not messages:
        return {"response": "No message provided."}

    try:
        genai.configure(api_key=api_key)
        # gemini-1.5-flash has higher free-tier limits (15 RPM → same, but more stable)
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Build chat history
        history = []
        for msg in messages[:-1]:
            history.append({
                "role": "user" if msg["role"] == "user" else "model",
                "parts": [msg["content"]],
            })

        chat_session = model.start_chat(history=history)
        result = chat_session.send_message(messages[-1]["content"])
        return {"response": result.text}

    except ResourceExhausted:
        return {
            "response": (
                "⏳ **Rate limit reached** — Free Gemini quota hit for this minute. "
                "Wait 60 seconds and try again. The free tier allows 15 requests/minute."
            )
        }
    except GoogleAPICallError as e:
        return {"response": f"⚠️ Gemini API error: {str(e)}. Please try again."}
    except Exception as e:
        return {"response": f"⚠️ Unexpected error: {str(e)}. Please try again."}


@router.get("/suggested-prompts")
def get_suggested_prompts(current_user: TokenData = Depends(get_current_user)):
    """Return role-specific suggested prompts."""
    return {
        "prompts": [
            "Show production of Rajrappa mine this month",
            "Which excavator has highest downtime?",
            "Summarize yesterday's inspection reports",
            "Generate maintenance schedule for next week",
            "Which employees need safety retraining?",
        ]
    }
