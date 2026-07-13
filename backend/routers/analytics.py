from fastapi import APIRouter, Depends
from routers.auth import get_current_user, TokenData

router = APIRouter()

MINES = [
    {
        "id": "RJP", "name": "Rajrappa", "area": "Ramgarh", "type": "OC",
        "totalCapacity": 12.5, "todayActual": 18420, "todayTarget": 20000,
        "monthActual": 412500, "monthTarget": 480000, "ytdActual": 4850000, "ytdTarget": 5200000,
        "efficiency": 92.1, "activeShifts": 3, "workers": 1240, "status": "operational",
    },
    {
        "id": "ARG", "name": "Argada", "area": "Bokaro", "type": "UG",
        "totalCapacity": 6.8, "todayActual": 9200, "todayTarget": 10500,
        "monthActual": 225000, "monthTarget": 280000, "ytdActual": 2450000, "ytdTarget": 2800000,
        "efficiency": 80.4, "activeShifts": 2, "workers": 820, "status": "partial",
    },
    {
        "id": "PPW", "name": "Piparwar", "area": "Chatra", "type": "OC",
        "totalCapacity": 15.0, "todayActual": 22100, "todayTarget": 22000,
        "monthActual": 520000, "monthTarget": 510000, "ytdActual": 6100000, "ytdTarget": 5900000,
        "efficiency": 100.5, "activeShifts": 3, "workers": 1580, "status": "operational",
    },
    {
        "id": "KJU", "name": "Kuju", "area": "Ramgarh", "type": "UG",
        "totalCapacity": 4.2, "todayActual": 5800, "todayTarget": 7000,
        "monthActual": 140000, "monthTarget": 190000, "ytdActual": 1520000, "ytdTarget": 1900000,
        "efficiency": 73.7, "activeShifts": 2, "workers": 560, "status": "partial",
    },
    {
        "id": "DHR", "name": "Dhori", "area": "Bokaro", "type": "UG",
        "totalCapacity": 3.8, "todayActual": 5100, "todayTarget": 5000,
        "monthActual": 118000, "monthTarget": 120000, "ytdActual": 1380000, "ytdTarget": 1400000,
        "efficiency": 98.6, "activeShifts": 3, "workers": 490, "status": "operational",
    },
    {
        "id": "KDL", "name": "Kedla", "area": "Ramgarh", "type": "OC",
        "totalCapacity": 8.2, "todayActual": 11500, "todayTarget": 13000,
        "monthActual": 285000, "monthTarget": 360000, "ytdActual": 3200000, "ytdTarget": 3600000,
        "efficiency": 88.8, "activeShifts": 3, "workers": 920, "status": "operational",
    },
    {
        "id": "MKL", "name": "Makoli", "area": "Hazaribagh", "type": "OC",
        "totalCapacity": 5.5, "todayActual": 0, "todayTarget": 7500,
        "monthActual": 0, "monthTarget": 220000, "ytdActual": 980000, "ytdTarget": 2200000,
        "efficiency": 0.0, "activeShifts": 0, "workers": 0, "status": "shutdown",
    },
]


@router.get("/mines")
def get_mines(current_user: TokenData = Depends(get_current_user)):
    """Get all mines with production data."""
    total_today = sum(m["todayActual"] for m in MINES)
    total_target = sum(m["todayTarget"] for m in MINES)
    return {
        "mines": MINES,
        "summary": {
            "totalProductionToday": total_today,
            "totalTargetToday": total_target,
            "overallEfficiency": round((total_today / total_target) * 100, 1) if total_target else 0,
        },
    }


@router.get("/production")
def get_production_analytics(mine_id: str = None, current_user: TokenData = Depends(get_current_user)):
    """Production analytics with forecast and by-mine data."""
    return {
        "productionForecast": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            "actual": [5.2, 4.8, 5.9, 5.4, 5.7, 5.1, 5.8, None, None, None, None, None],
            "forecast": [None, None, None, None, None, None, 5.8, 6.1, 6.3, 5.9, 6.4, 6.2],
            "target": [6.0] * 12,
        },
        "productionByMine": {
            "labels": ["Rajrappa", "Argada", "Piparwar", "Kuju", "Dhori", "Kedla"],
            "actual":  [412500, 225000, 520000, 140000, 118000, 285000],
            "target":  [480000, 280000, 510000, 190000, 120000, 360000],
        },
        "weeklyTrend": {
            "labels": [f"W{i+1}" for i in range(28)],
            "data": [72000 + (i % 7 - 3) * 2000 for i in range(28)],
        },
    }


@router.get("/equipment-health")
def get_equipment_health_analytics(current_user: TokenData = Depends(get_current_user)):
    """Equipment health trends and failure predictions."""
    return {
        "equipmentFailurePrediction": {
            "labels": ["Dumper 203", "Conveyor C-7", "Drill DR-2", "Crusher CR-3", "Dragline DGL-1", "Dumper 205"],
            "failureProbability": [83, 96, 35, 31, 22, 28],
            "estimatedDaysToFailure": [2, 0, 45, 60, 90, 55],
            "colors": ["#ef4444", "#7f1d1d", "#f59e0b", "#d97706", "#10b981", "#059669"],
        },
    }


@router.get("/fuel-consumption")
def get_fuel_analytics(current_user: TokenData = Depends(get_current_user)):
    """Fuel consumption data."""
    return {
        "fuelConsumption": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            "data": [124000, 131000, 128000, 135000, 142000, 149000, 156000],
            "insight": "Fuel consumption increased 12% over last 6 months. Primary driver: Dumper 203 and 205 idling 3.2 hours/shift. Estimated monthly overrun: ₹18.4 lakhs.",
        },
        "powerConsumption": {
            "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            "data": [8.4, 9.1, 8.7, 9.3, 9.8, 10.2, 10.6],
            "target": [9.5] * 7,
            "insight": "Power consumption exceeded target by 11.6% in June. Underground ventilation fans account for 38% of total consumption.",
        },
    }


@router.get("/safety")
def get_safety_analytics(current_user: TokenData = Depends(get_current_user)):
    """Safety trend data."""
    return {
        "safetyTrend": {
            "labels": ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
            "incidents":    [8, 5, 7, 4, 6, 3],
            "nearMisses":   [14, 11, 12, 9, 10, 7],
            "violationsPPE":[31, 28, 25, 22, 18, 12],
        },
    }


@router.get("/kpi")
def get_kpi_summary(current_user: TokenData = Depends(get_current_user)):
    """Overall KPI summary for dashboard."""
    return {
        "totalProductionMTD": 1700500,
        "targetMTD": 1940000,
        "efficiency": 87.7,
        "avgEquipmentHealth": 71.5,
        "safetyScore": 87.3,
        "fuelEfficiency": 92.1,
        "activeEquipment": 8,
        "totalEquipment": 10,
    }


@router.get("/inventory")
def get_inventory(current_user: TokenData = Depends(get_current_user)):
    """Inventory levels for critical supplies."""
    return {
        "items": [
            {"name": "Diesel", "current": 48000, "minimum": 30000, "unit": "litres", "daysLeft": 12, "status": "warning"},
            {"name": "Explosive (ANFO)", "current": 8200, "minimum": 5000, "unit": "kg", "daysLeft": 18, "status": "ok"},
            {"name": "Hydraulic Oil", "current": 2100, "minimum": 1500, "unit": "litres", "daysLeft": 8, "status": "critical"},
            {"name": "Conveyor Belting", "current": 450, "minimum": 200, "unit": "metres", "daysLeft": 22, "status": "ok"},
            {"name": "Safety Helmets", "current": 320, "minimum": 500, "unit": "units", "daysLeft": 0, "status": "critical"},
            {"name": "Filter Masks (N95)", "current": 1200, "minimum": 800, "unit": "units", "daysLeft": 6, "status": "warning"},
        ]
    }
