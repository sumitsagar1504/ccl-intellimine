from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user, TokenData
from typing import Optional

router = APIRouter()

# Mock data — replace with DB queries in production
MOCK_EMPLOYEES = [
    {"id": "EMP-001", "name": "Ramesh Kumar Singh", "designation": "Mine Manager", "department": "Operations", "mine": "Rajrappa", "attendance_percent": 96.2, "safety_score": 94, "training_status": "current"},
    {"id": "EMP-002", "name": "Priya Sharma", "designation": "Safety Officer", "department": "Safety", "mine": "Rajrappa", "attendance_percent": 98.5, "safety_score": 99, "training_status": "current"},
    {"id": "EMP-003", "name": "Suresh Pandey", "designation": "Maintenance Engineer", "department": "Mechanical", "mine": "Rajrappa", "attendance_percent": 91.0, "safety_score": 78, "training_status": "due"},
]


@router.get("/")
def get_employees(
    search: Optional[str] = None,
    department: Optional[str] = None,
    mine: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    current_user: TokenData = Depends(get_current_user),
):
    """
    Get paginated employee list.
    TODO: Wire to PostgreSQL — SELECT * FROM employees WHERE ...
    """
    employees = MOCK_EMPLOYEES
    if search:
        employees = [e for e in employees if search.lower() in e["name"].lower()]
    total = len(employees)
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "employees": employees[(page - 1) * limit : page * limit],
    }


@router.get("/{employee_id}")
def get_employee(employee_id: str, current_user: TokenData = Depends(get_current_user)):
    """
    Get employee detail by ID.
    TODO: Wire to PostgreSQL — SELECT * FROM employees WHERE id = ?
    """
    emp = next((e for e in MOCK_EMPLOYEES if e["id"] == employee_id), None)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp


@router.get("/summary/stats")
def get_employee_summary(current_user: TokenData = Depends(get_current_user)):
    """
    Get aggregate workforce statistics.
    TODO: Wire to PostgreSQL with aggregation queries.
    """
    return {
        "total": 4820,
        "present": 4210,
        "on_leave": 380,
        "absent": 230,
        "training_due": 184,
        "avg_attendance": 92.3,
        "avg_safety_score": 84.6,
    }
