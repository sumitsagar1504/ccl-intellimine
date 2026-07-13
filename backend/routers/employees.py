from fastapi import APIRouter, Depends, HTTPException
from routers.auth import get_current_user, TokenData
from typing import Optional

router = APIRouter()

# Full employee dataset matching the frontend mock
EMPLOYEES = [
    {
        "id": "EMP-001", "name": "Ramesh Kumar Singh", "designation": "Mine Manager",
        "department": "Operations", "mineId": "RJP", "mineName": "Rajrappa",
        "grade": "E8", "email": "ramesh.singh@ccl.gov.in", "phone": "+91 94310 12345",
        "dateOfJoining": "2005-03-15", "attendancePercent": 96.2, "trainingStatus": "current",
        "safetyScore": 94, "safetyViolations": 0, "leaveBalance": 28, "performanceRating": 4.8,
        "certifications": [
            {"name": "Mine Manager Certificate (Class I)", "expiry": "2027-03-15", "status": "valid"},
            {"name": "Mines Rescue Training", "expiry": "2025-12-01", "status": "valid"},
            {"name": "First Aid Certificate", "expiry": "2025-09-20", "status": "expiring"},
        ],
        "recentActivity": [
            {"date": "2025-07-09", "type": "Approval", "description": "Approved Q3 production plan"},
            {"date": "2025-07-07", "type": "Inspection", "description": "Safety inspection — Level 3"},
        ],
    },
    {
        "id": "EMP-002", "name": "Priya Sharma", "designation": "Safety Officer",
        "department": "Safety & Environment", "mineId": "RJP", "mineName": "Rajrappa",
        "grade": "E5", "email": "priya.sharma@ccl.gov.in", "phone": "+91 94310 23456",
        "dateOfJoining": "2012-07-22", "attendancePercent": 98.5, "trainingStatus": "current",
        "safetyScore": 99, "safetyViolations": 0, "leaveBalance": 18, "performanceRating": 4.9,
        "certifications": [
            {"name": "Safety Officer Certificate", "expiry": "2026-07-22", "status": "valid"},
            {"name": "Hazmat Handling", "expiry": "2025-11-10", "status": "valid"},
        ],
        "recentActivity": [
            {"date": "2025-07-09", "type": "Report", "description": "Filed monthly safety report"},
            {"date": "2025-07-08", "type": "Training", "description": "Conducted PPE training — 45 workers"},
        ],
    },
    {
        "id": "EMP-003", "name": "Suresh Pandey", "designation": "Maintenance Engineer",
        "department": "Mechanical", "mineId": "RJP", "mineName": "Rajrappa",
        "grade": "E4", "email": "suresh.pandey@ccl.gov.in", "phone": "+91 94310 34567",
        "dateOfJoining": "2016-01-10", "attendancePercent": 91.0, "trainingStatus": "due",
        "safetyScore": 78, "safetyViolations": 2, "leaveBalance": 12, "performanceRating": 3.8,
        "certifications": [
            {"name": "Electrical Safety", "expiry": "2024-12-31", "status": "expired"},
            {"name": "HEMM Maintenance", "expiry": "2026-01-10", "status": "valid"},
        ],
        "recentActivity": [
            {"date": "2025-07-08", "type": "Maintenance", "description": "Repaired Dumper 203 bearing"},
            {"date": "2025-07-05", "type": "Violation", "description": "PPE non-compliance — hard hat"},
        ],
    },
    {
        "id": "EMP-004", "name": "Anil Kumar Sharma", "designation": "Electrical Engineer",
        "department": "Electrical", "mineId": "PPW", "mineName": "Piparwar",
        "grade": "E5", "email": "anil.sharma@ccl.gov.in", "phone": "+91 94310 45678",
        "dateOfJoining": "2010-06-01", "attendancePercent": 94.8, "trainingStatus": "current",
        "safetyScore": 88, "safetyViolations": 1, "leaveBalance": 22, "performanceRating": 4.2,
        "certifications": [
            {"name": "Electrical Engineer Certificate", "expiry": "2026-06-01", "status": "valid"},
            {"name": "HV Safety", "expiry": "2025-08-15", "status": "expiring"},
        ],
        "recentActivity": [
            {"date": "2025-07-06", "type": "Maintenance", "description": "Conveyor motor overhaul"},
        ],
    },
    {
        "id": "EMP-005", "name": "Vijay Kumar Singh", "designation": "Overman",
        "department": "Operations", "mineId": "ARG", "mineName": "Argada",
        "grade": "T8", "email": "vijay.singh@ccl.gov.in", "phone": "+91 94310 56789",
        "dateOfJoining": "2000-04-12", "attendancePercent": 88.1, "trainingStatus": "overdue",
        "safetyScore": 62, "safetyViolations": 4, "leaveBalance": 5, "performanceRating": 3.1,
        "certifications": [
            {"name": "Overman Certificate", "expiry": "2024-06-30", "status": "expired"},
            {"name": "Gas Testing", "expiry": "2024-12-01", "status": "expired"},
        ],
        "recentActivity": [
            {"date": "2025-07-08", "type": "Violation", "description": "Found in restricted zone without permit"},
            {"date": "2025-07-01", "type": "Violation", "description": "Improper blasting procedure"},
        ],
    },
    {
        "id": "EMP-006", "name": "Mohan Lal Das", "designation": "Mechanical Supervisor",
        "department": "Mechanical", "mineId": "ARG", "mineName": "Argada",
        "grade": "T7", "email": "mohan.das@ccl.gov.in", "phone": "+91 94310 67890",
        "dateOfJoining": "2008-11-20", "attendancePercent": 93.6, "trainingStatus": "current",
        "safetyScore": 85, "safetyViolations": 1, "leaveBalance": 16, "performanceRating": 4.0,
        "certifications": [
            {"name": "Conveyor Maintenance", "expiry": "2026-11-20", "status": "valid"},
        ],
        "recentActivity": [
            {"date": "2025-07-07", "type": "Maintenance", "description": "Crusher CR-3 liner replacement"},
        ],
    },
    {
        "id": "EMP-007", "name": "Deepika Oraon", "designation": "HR Manager",
        "department": "Human Resources", "mineId": "RJP", "mineName": "Rajrappa",
        "grade": "E6", "email": "deepika.oraon@ccl.gov.in", "phone": "+91 94310 78901",
        "dateOfJoining": "2011-08-14", "attendancePercent": 97.2, "trainingStatus": "current",
        "safetyScore": 92, "safetyViolations": 0, "leaveBalance": 24, "performanceRating": 4.5,
        "certifications": [
            {"name": "HR Professional Certification", "expiry": "2026-08-14", "status": "valid"},
        ],
        "recentActivity": [
            {"date": "2025-07-09", "type": "HR", "description": "Processed 12 leave applications"},
        ],
    },
    {
        "id": "EMP-008", "name": "Rajendra Prasad Gupta", "designation": "Surveyor",
        "department": "Survey", "mineId": "KDL", "mineName": "Kedla",
        "grade": "E3", "email": "rajendra.gupta@ccl.gov.in", "phone": "+91 94310 89012",
        "dateOfJoining": "2018-03-01", "attendancePercent": 95.4, "trainingStatus": "current",
        "safetyScore": 90, "safetyViolations": 0, "leaveBalance": 20, "performanceRating": 4.1,
        "certifications": [
            {"name": "Mine Surveyor Certificate", "expiry": "2027-03-01", "status": "valid"},
        ],
        "recentActivity": [
            {"date": "2025-07-08", "type": "Survey", "description": "Completed quarterly face survey"},
        ],
    },
]


@router.get("/")
def get_employees(
    search: Optional[str] = None,
    department: Optional[str] = None,
    mine: Optional[str] = None,
    training_status: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
    current_user: TokenData = Depends(get_current_user),
):
    """Get paginated employee list with optional filters."""
    employees = EMPLOYEES
    if search:
        employees = [e for e in employees if search.lower() in e["name"].lower()
                     or search.lower() in e["designation"].lower()]
    if department:
        employees = [e for e in employees if e["department"].lower() == department.lower()]
    if mine:
        employees = [e for e in employees if e["mineId"] == mine or e["mineName"].lower() == mine.lower()]
    if training_status:
        employees = [e for e in employees if e["trainingStatus"] == training_status]
    total = len(employees)
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "employees": employees[(page - 1) * limit: page * limit],
    }


@router.get("/summary/stats")
def get_employee_summary(current_user: TokenData = Depends(get_current_user)):
    """Get aggregate workforce statistics."""
    return {
        "total": 4820,
        "present": 4210,
        "onLeave": 380,
        "absent": 230,
        "trainingDue": 184,
        "safetyViolationsThisMonth": 23,
        "avgAttendance": 92.3,
        "avgSafetyScore": 84.6,
    }


@router.get("/{employee_id}")
def get_employee(employee_id: str, current_user: TokenData = Depends(get_current_user)):
    """Get employee detail by ID."""
    emp = next((e for e in EMPLOYEES if e["id"] == employee_id), None)
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    return emp
