from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user, TokenData
from typing import Optional
import os
import google.generativeai as genai

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

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.0-flash-exp")

    # Build chat history
    history = []
    for msg in messages[:-1]:
        history.append({
            "role": "user" if msg["role"] == "user" else "model",
            "parts": [msg["content"]],
        })

    chat = model.start_chat(history=history)
    result = chat.send_message(messages[-1]["content"])
    return {"response": result.text}


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
