from fastapi import APIRouter, Depends
from routers.auth import get_current_user, TokenData

router = APIRouter()

NOTIFICATIONS = [
    {
        "id": "N001", "type": "equipment", "priority": "critical",
        "title": "🔴 Dumper 203 — Bearing Failure Imminent",
        "message": "Vibration at 12.4 mm/s (limit: 7.1). Remove from service immediately. Estimated failure within 2 days.",
        "timestamp": "2025-07-09T06:15:00Z", "read": False, "acknowledged": False,
        "mineId": "RJP", "equipmentId": "DMP-203",
    },
    {
        "id": "N002", "type": "equipment", "priority": "critical",
        "title": "🔴 Conveyor C-7 Argada — Complete Breakdown",
        "message": "Belt tear detected at splice point. Estimated repair time: 6–8 hours. Production halted in Sector 4.",
        "timestamp": "2025-07-09T05:42:00Z", "read": False, "acknowledged": False,
        "mineId": "ARG", "equipmentId": "CNV-101",
    },
    {
        "id": "N003", "type": "safety", "priority": "high",
        "title": "⚠️ Air Quality Alert — Rajrappa Sector 4",
        "message": "Dust concentration at 112% of permissible limit. Issue PPE advisory. Activate dust suppression system.",
        "timestamp": "2025-07-09T07:30:00Z", "read": False, "acknowledged": False,
        "mineId": "RJP",
    },
    {
        "id": "N004", "type": "safety", "priority": "high",
        "title": "⚠️ Safety Violation — Restricted Zone Entry",
        "message": "EMP-005 Vijay Kumar Singh entered restricted zone without valid permit at 04:12. Investigate and document.",
        "timestamp": "2025-07-09T04:15:00Z", "read": False, "acknowledged": False,
        "mineId": "ARG",
    },
    {
        "id": "N005", "type": "training", "priority": "high",
        "title": "⚠️ 3 Employees — Training Overdue",
        "message": "Vijay Kumar Singh, Suresh Pandey, and 1 other have overdue safety certifications. Operations at risk.",
        "timestamp": "2025-07-09T08:00:00Z", "read": True, "acknowledged": False,
        "mineId": None,
    },
    {
        "id": "N006", "type": "production", "priority": "medium",
        "title": "🟡 Kuju Mine — Production Deficit",
        "message": "Kuju mine at 73.7% efficiency this month. DR-2 drill rig maintenance overdue is primary bottleneck.",
        "timestamp": "2025-07-09T09:00:00Z", "read": True, "acknowledged": False,
        "mineId": "KJU",
    },
    {
        "id": "N007", "type": "maintenance", "priority": "medium",
        "title": "🟡 Drill DR-2 — Scheduled Maintenance Due",
        "message": "DR-2 at Kuju mine overdue for maintenance by 12 days. Schedule immediately to prevent failure.",
        "timestamp": "2025-07-08T14:00:00Z", "read": True, "acknowledged": True,
        "mineId": "KJU", "equipmentId": "DRL-002",
    },
    {
        "id": "N008", "type": "production", "priority": "low",
        "title": "✅ Piparwar — 100.5% Efficiency",
        "message": "Piparwar mine exceeded monthly target by 10,000 MT. Consider evaluating capacity expansion for FY2026.",
        "timestamp": "2025-07-09T10:00:00Z", "read": True, "acknowledged": True,
        "mineId": "PPW",
    },
]


@router.get("/")
def get_notifications(
    priority: str = None,
    unread_only: bool = False,
    notification_type: str = None,
    current_user: TokenData = Depends(get_current_user),
):
    """Get notifications with optional filters."""
    items = NOTIFICATIONS
    if priority:
        items = [n for n in items if n["priority"] == priority]
    if unread_only:
        items = [n for n in items if not n["read"]]
    if notification_type:
        items = [n for n in items if n["type"] == notification_type]
    unread_count = sum(1 for n in NOTIFICATIONS if not n["read"])
    return {"total": len(items), "unreadCount": unread_count, "notifications": items}


@router.patch("/{notification_id}/read")
def mark_read(notification_id: str, current_user: TokenData = Depends(get_current_user)):
    return {"id": notification_id, "read": True}


@router.post("/{notification_id}/acknowledge")
def acknowledge(notification_id: str, current_user: TokenData = Depends(get_current_user)):
    return {"id": notification_id, "acknowledged": True}
