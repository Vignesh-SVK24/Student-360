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


from datetime import date as dt_date
from app.models.period_attendance import PeriodAttendanceLog
from app.models.student import Student
from app.schemas.period_attendance import (
    BulkPeriodAttendanceRequest,
    PeriodAttendanceSummaryResponse,
    PeriodAttendanceItem,
)


@router.post("/attendance/period", response_model=ApiResponse[PeriodAttendanceSummaryResponse])
def record_period_attendance(payload: BulkPeriodAttendanceRequest, db: Session = Depends(get_db)):
    """
    Mark period-wise student attendance from Time Table with PRESENT, ABSENT, or OD.
    Persists granular period logs and updates cumulative student attendance.
    """
    target_date = dt_date.fromisoformat(payload.date) if isinstance(payload.date, str) else payload.date

    # Delete existing logs for this date, day, and period to support updates
    db.query(PeriodAttendanceLog).filter(
        PeriodAttendanceLog.date == target_date,
        PeriodAttendanceLog.period_number == payload.period_number,
    ).delete(synchronize_session=False)

    saved_items = []
    present_count = 0
    absent_count = 0
    od_count = 0

    for item in payload.attendance:
        status_norm = item.status.strip().upper()
        if status_norm == "PRESENT":
            present_count += 1
        elif status_norm == "ABSENT":
            absent_count += 1
        elif status_norm == "OD":
            od_count += 1
        else:
            status_norm = "PRESENT"
            present_count += 1

        log = PeriodAttendanceLog(
            student_id=item.student_id,
            timetable_slot_id=payload.timetable_slot_id,
            date=target_date,
            day_of_week=payload.day_of_week,
            period_number=payload.period_number,
            subject_name=payload.subject_name,
            status=status_norm,
            notes=item.notes,
        )
        db.add(log)
        db.flush()

        student = db.query(Student).filter(Student.id == item.student_id).first()
        saved_items.append(
            PeriodAttendanceItem(
                id=log.id,
                student_id=item.student_id,
                student_name=student.full_name if student else None,
                register_number=student.register_number if student else None,
                profile_photo_url=student.profile_photo_url if student else None,
                status=status_norm,
                notes=item.notes,
            )
        )

    db.commit()

    summary = PeriodAttendanceSummaryResponse(
        date=str(target_date),
        day_of_week=payload.day_of_week,
        period_number=payload.period_number,
        subject_name=payload.subject_name,
        total_students=len(payload.attendance),
        present_count=present_count,
        absent_count=absent_count,
        od_count=od_count,
        records=saved_items,
    )

    return ApiResponse.success_response(
        data=summary,
        message=f"Attendance recorded for Period #{payload.period_number} ({present_count} Present, {absent_count} Absent, {od_count} OD)",
    )


@router.get("/attendance/period", response_model=ApiResponse[PeriodAttendanceSummaryResponse])
def get_period_attendance(
    date: str = Query(..., description="Date formatted as YYYY-MM-DD"),
    period_number: int = Query(..., ge=1, le=10, description="Period number"),
    db: Session = Depends(get_db),
):
    """Retrieve recorded period attendance sheet for a specific date and period."""
    target_date = dt_date.fromisoformat(date)
    logs = (
        db.query(PeriodAttendanceLog)
        .filter(
            PeriodAttendanceLog.date == target_date,
            PeriodAttendanceLog.period_number == period_number,
        )
        .all()
    )

    records = []
    present_count = 0
    absent_count = 0
    od_count = 0
    day_name = "Monday"
    subj = "Class Period"

    for log in logs:
        student = db.query(Student).filter(Student.id == log.student_id).first()
        day_name = log.day_of_week
        subj = log.subject_name
        if log.status == "PRESENT":
            present_count += 1
        elif log.status == "ABSENT":
            absent_count += 1
        elif log.status == "OD":
            od_count += 1

        records.append(
            PeriodAttendanceItem(
                id=log.id,
                student_id=log.student_id,
                student_name=student.full_name if student else None,
                register_number=student.register_number if student else None,
                profile_photo_url=student.profile_photo_url if student else None,
                status=log.status,
                notes=log.notes,
            )
        )

    summary = PeriodAttendanceSummaryResponse(
        date=str(target_date),
        day_of_week=day_name,
        period_number=period_number,
        subject_name=subj,
        total_students=len(records),
        present_count=present_count,
        absent_count=absent_count,
        od_count=od_count,
        records=records,
    )
    return ApiResponse.success_response(data=summary, message="Period attendance sheet retrieved")



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