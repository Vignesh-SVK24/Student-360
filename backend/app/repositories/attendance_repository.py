from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.attendance import StudentAttendance
from app.repositories.base import BaseRepository


class AttendanceRepository(BaseRepository[StudentAttendance]):
    def __init__(self, db: Session):
        super().__init__(StudentAttendance, db)

    def get_by_student(self, student_id: int, semester: Optional[int] = None) -> List[StudentAttendance]:
        q = (
            self.db.query(StudentAttendance)
            .options(joinedload(StudentAttendance.subject))
            .filter(StudentAttendance.student_id == student_id)
        )
        if semester:
            q = q.filter(StudentAttendance.semester == semester)
        return q.order_by(StudentAttendance.semester.asc()).all()

    def get_by_student_and_subject(self, student_id: int, subject_id: int) -> Optional[StudentAttendance]:
        return (
            self.db.query(StudentAttendance)
            .options(joinedload(StudentAttendance.subject))
            .filter(
                StudentAttendance.student_id == student_id,
                StudentAttendance.subject_id == subject_id,
            )
            .first()
        )