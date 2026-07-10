from fastapi import APIRouter, Depends
from routers.auth import get_current_user, TokenData

router = APIRouter()

@router.get("/")
def get_equipment(current_user: TokenData = Depends(get_current_user)):
    """Get all equipment. TODO: Wire to PostgreSQL."""
    return {"message": "Equipment list — connect to DB"}

@router.get("/{equipment_id}")
def get_equipment_detail(equipment_id: str, current_user: TokenData = Depends(get_current_user)):
    """Get equipment detail + sensor readings."""
    return {"id": equipment_id, "message": "Equipment detail — connect to DB"}

@router.get("/{equipment_id}/health-trend")
def get_health_trend(equipment_id: str, days: int = 30, current_user: TokenData = Depends(get_current_user)):
    """Get health trend time series for a machine."""
    return {"equipment_id": equipment_id, "days": days, "data": []}

@router.post("/{equipment_id}/maintenance")
def log_maintenance(equipment_id: str, body: dict, current_user: TokenData = Depends(get_current_user)):
    """Log a maintenance record for a machine."""
    return {"message": f"Maintenance logged for {equipment_id}"}
