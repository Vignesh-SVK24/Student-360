from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.constants import FacultyRole
from app.dependencies.auth import get_current_faculty, require_faculty_roles
from app.models.faculty import Faculty
from app.schemas.common import ApiResponse
from app.schemas.timetable import (
    WeeklyTimetableResponse,
    TimetableSlotResponse,
    TimetableSlotUpdate,
    PeriodCreate,
)
from app.services.timetable_service import TimetableService

router = APIRouter(prefix="/timetable", tags=["Time Table"])


@router.get("", response_model=ApiResponse[WeeklyTimetableResponse])
def get_timetable(
    classroom_id: Optional[int] = Query(None, description="Filter by classroom ID"),
    db: Session = Depends(get_db),
):
    """Retrieve 6-day (Monday to Saturday) timetable schedule with periods, timings, and subjects."""
    service = TimetableService(db)
    result = service.get_weekly_timetable(classroom_id=classroom_id)
    return ApiResponse.success_response(data=result, message="Weekly timetable schedule retrieved successfully")


@router.put("/slots/{slot_id}", response_model=ApiResponse[TimetableSlotResponse])
def update_timetable_slot(
    slot_id: int,
    payload: TimetableSlotUpdate,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Update a specific period's subject name, timing, room, or faculty (Advisor/Tutor/HOD)."""
    service = TimetableService(db)
    result = service.update_slot(slot_id, payload)
    return ApiResponse.success_response(data=result, message=f"Period #{result.period_number} on {result.day_of_week} updated successfully")


@router.post("/periods", response_model=ApiResponse[WeeklyTimetableResponse], status_code=status.HTTP_201_CREATED)
def add_period_row(
    payload: PeriodCreate,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Add a new period slot across all 6 days (Advisor/Tutor/HOD)."""
    service = TimetableService(db)
    result = service.add_period_row(payload)
    return ApiResponse.success_response(data=result, message="New period added across timetable", status_code=status.HTTP_201_CREATED)


@router.delete("/periods/{period_number}", response_model=ApiResponse[WeeklyTimetableResponse])
def delete_period_row(
    period_number: int,
    classroom_id: Optional[int] = Query(None, description="Classroom ID"),
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Delete a period row across all 6 days (Advisor/Tutor/HOD)."""
    service = TimetableService(db)
    result = service.delete_period_row(period_number, classroom_id=classroom_id)
    return ApiResponse.success_response(data=result, message=f"Period #{period_number} deleted from timetable")


@router.post("/reset", response_model=ApiResponse[WeeklyTimetableResponse])
def reset_timetable(
    classroom_id: Optional[int] = Query(None, description="Classroom ID"),
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Reset the 6-day timetable back to standard curriculum default."""
    service = TimetableService(db)
    result = service.reset_schedule(classroom_id=classroom_id)
    return ApiResponse.success_response(data=result, message="Timetable reset to default schedule")

