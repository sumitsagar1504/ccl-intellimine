from fastapi import APIRouter, Depends
from routers.auth import get_current_user, TokenData

router = APIRouter()

@router.get("/")
def get_notifications(priority: str = None, unread_only: bool = False, current_user: TokenData = Depends(get_current_user)):
    """Get notifications. TODO: Connect to Redis pub/sub + PostgreSQL."""
    return {"message": "Notifications — connect to Redis + DB"}

@router.patch("/{notification_id}/read")
def mark_read(notification_id: str, current_user: TokenData = Depends(get_current_user)):
    return {"id": notification_id, "read": True}

@router.post("/{notification_id}/acknowledge")
def acknowledge(notification_id: str, current_user: TokenData = Depends(get_current_user)):
    return {"id": notification_id, "acknowledged": True}
