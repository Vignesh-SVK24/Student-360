from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
    AttendanceSummaryResponse,
)
from app.services.attendance_service import AttendanceService

router = APIRouter(tags=["Attendance"])


@router.get("/students/{student_id}/attendance", response_model=ApiResponse[List[AttendanceResponse]])
def get_student_attendance(
    student_id: int,
    semester: Optional[int] = Query(None, description="Filter by semester"),
    db: Session = Depends(get_db),
):
    """Retrieve detailed subject-wise attendance logs for a student."""
    service = AttendanceService(db)
    records = service.get_by_student(student_id, semester=semester)
    res = [
        AttendanceResponse(
            id=r.id,
            student_id=r.student_id,
            subject_id=r.subject_id,
            subject_code=r.subject.code if r.subject else None,
            subject_name=r.subject.name if r.subject else None,
            semester=r.semester,
            academic_year=r.academic_year,
            total_classes=r.total_classes,
            present_classes=r.present_classes,
            absent_classes=r.absent_classes,
            attendance_percentage=r.attendance_percentage,
            last_updated_at=r.last_updated_at,
        )
        for r in records
    ]
    return ApiResponse(
        success=True,
        message="Attendance records retrieved successfully",
        data=res,
    )


@router.get("/students/{student_id}/attendance/summary", response_model=ApiResponse[AttendanceSummaryResponse])
def get_attendance_summary(
    student_id: int,
    semester: Optional[int] = Query(None, description="Filter by semester"),
    db: Session = Depends(get_db),
):
    """
    Get aggregated attendance summary: total classes, overall percentage,
    deficiency check (< 75%), and breakdown.
    """
    service = AttendanceService(db)
    summary = service.get_summary(student_id, semester=semester)
    return ApiResponse(
        success=True,
        message="Attendance summary calculated successfully",
        data=summary,
    )


@router.post("/attendance", response_model=ApiResponse[AttendanceResponse], status_code=status.HTTP_201_CREATED)
def record_attendance(data: AttendanceCreate, db: Session = Depends(get_db)):
    """
    Record or update attendance counts for a subject.
    Validates present <= total, absent <= total, calculates percentage authoritatively on backend.
    """
    service = AttendanceService(db)
    saved = service.record_attendance(data)
    return ApiResponse(
        success=True,
        message="Attendance recorded successfully",
        data=AttendanceResponse(
            id=saved.id,
            student_id=saved.student_id,
            subject_id=saved.subject_id,
            subject_code=saved.subject.code if saved.subject else None,
            subject_name=saved.subject.name if saved.subject else None,
            semester=saved.semester,
            academic_year=saved.academic_year,
            total_classes=saved.total_classes,
            present_classes=saved.present_classes,
            absent_classes=saved.absent_classes,
            attendance_percentage=saved.attendance_percentage,
            last_updated_at=saved.last_updated_at,
        ),
    )


@router.patch("/attendance/{attendance_id}", response_model=ApiResponse[AttendanceResponse])
def update_attendance(attendance_id: int, data: AttendanceUpdate, db: Session = Depends(get_db)):
    """Update attendance metrics for a specific entry."""
    service = AttendanceService(db)
    updated = service.update_attendance(attendance_id, data)
    return ApiResponse(
        success=True,
        message="Attendance updated successfully",
        data=AttendanceResponse(
            id=updated.id,
            student_id=updated.student_id,
            subject_id=updated.subject_id,
            subject_code=updated.subject.code if updated.subject else None,
            subject_name=updated.subject.name if updated.subject else None,
            semester=updated.semester,
            academic_year=updated.academic_year,
            total_classes=updated.total_classes,
            present_classes=updated.present_classes,
            absent_classes=updated.absent_classes,
            attendance_percentage=updated.attendance_percentage,
            last_updated_at=updated.last_updated_at,
        ),
    )