from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse
from app.schemas.timetable import (
    WeeklyTimetableResponse,
    TimetableSlotResponse,
    TimetableSlotUpdate,
)
from app.services.timetable_service import TimetableService

router = APIRouter(prefix="/timetable", tags=["Time Table"])


@router.get("", response_model=ApiResponse[WeeklyTimetableResponse])
def get_timetable(db: Session = Depends(get_db)):
    """Retrieve 6-day (Monday to Saturday) timetable schedule with periods, timings, and subjects."""
    service = TimetableService(db)
    result = service.get_weekly_timetable()
    return ApiResponse.success_response(data=result, message="Weekly timetable schedule retrieved successfully")


@router.put("/slots/{slot_id}", response_model=ApiResponse[TimetableSlotResponse])
def update_timetable_slot(slot_id: int, payload: TimetableSlotUpdate, db: Session = Depends(get_db)):
    """Update a specific period's subject name, timing, room, or faculty."""
    service = TimetableService(db)
    result = service.update_slot(slot_id, payload)
    return ApiResponse.success_response(data=result, message=f"Period #{result.period_number} on {result.day_of_week} updated successfully")


@router.post("/reset", response_model=ApiResponse[WeeklyTimetableResponse])
def reset_timetable(db: Session = Depends(get_db)):
    """Reset the 6-day timetable back to standard curriculum default."""
    service = TimetableService(db)
    result = service.reset_schedule()
    return ApiResponse.success_response(data=result, message="Timetable reset to default schedule")
