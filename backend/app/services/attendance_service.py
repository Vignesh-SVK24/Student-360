from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.exceptions import NotFoundException
from app.models.attendance import StudentAttendance
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceSummaryResponse,
    AttendanceSubjectDetail,
)
from app.utils.validators import validate_attendance_counts
from app.utils.helpers import calculate_attendance_percentage


class AttendanceService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AttendanceRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int, semester: Optional[int] = None) -> List[StudentAttendance]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_by_student(student_id, semester)

    def get_summary(self, student_id: int, semester: Optional[int] = None) -> AttendanceSummaryResponse:
        student = self.student_repo.get_by_id(student_id)
        if not student:
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")

        records = self.repo.get_by_student(student_id, semester)
        total_classes = sum(r.total_classes for r in records)
        present_classes = sum(r.present_classes for r in records)
        absent_classes = sum(r.absent_classes for r in records)

        overall_pct = calculate_attendance_percentage(present_classes, total_classes)
        min_pct = settings.MINIMUM_ATTENDANCE_PERCENTAGE

        subject_details = []
        for r in records:
            pct = calculate_attendance_percentage(r.present_classes, r.total_classes)
            subject_details.append(
                AttendanceSubjectDetail(
                    id=r.id,
                    subject_id=r.subject_id,
                    subject_code=r.subject.code if r.subject else "SUB",
                    subject_name=r.subject.name if r.subject else "Subject",
                    semester=r.semester,
                    academic_year=r.academic_year,
                    total_classes=r.total_classes,
                    present_classes=r.present_classes,
                    absent_classes=r.absent_classes,
                    attendance_percentage=pct,
                    is_deficient=pct < min_pct,
                )
            )

        return AttendanceSummaryResponse(
            student_id=student_id,
            semester=semester,
            overall_percentage=overall_pct,
            total_conducted_classes=total_classes,
            total_attended_classes=present_classes,
            total_absent_classes=absent_classes,
            is_compliant=overall_pct >= min_pct,
            subjects=subject_details,
        )

    def record_attendance(self, data: AttendanceCreate) -> StudentAttendance:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        validate_attendance_counts(data.present_classes, data.absent_classes, data.total_classes)
        pct = calculate_attendance_percentage(data.present_classes, data.total_classes)

        existing = self.repo.get_by_student_and_subject(data.student_id, data.subject_id)
        if existing:
            existing.total_classes = data.total_classes
            existing.present_classes = data.present_classes
            existing.absent_classes = data.absent_classes
            existing.attendance_percentage = pct
            existing.semester = data.semester
            existing.academic_year = data.academic_year
            return self.repo.update(existing, {})

        rec = StudentAttendance(
            student_id=data.student_id,
            subject_id=data.subject_id,
            semester=data.semester,
            academic_year=data.academic_year,
            total_classes=data.total_classes,
            present_classes=data.present_classes,
            absent_classes=data.absent_classes,
            attendance_percentage=pct,
        )
        return self.repo.create(rec)

    def update_attendance(self, attendance_id: int, data: AttendanceUpdate) -> StudentAttendance:
        rec = self.repo.get_by_id(attendance_id)
        if not rec:
            raise NotFoundException(f"Attendance record with ID {attendance_id} not found", "ATTENDANCE_NOT_FOUND")

        tot = data.total_classes if data.total_classes is not None else rec.total_classes
        pres = data.present_classes if data.present_classes is not None else rec.present_classes
        absn = data.absent_classes if data.absent_classes is not None else rec.absent_classes

        validate_attendance_counts(pres, absn, tot)
        pct = calculate_attendance_percentage(pres, tot)

        rec.total_classes = tot
        rec.present_classes = pres
        rec.absent_classes = absn
        rec.attendance_percentage = pct

        return self.repo.update(rec, {})