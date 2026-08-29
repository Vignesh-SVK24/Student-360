from typing import List, Optional, Tuple
from sqlalchemy import or_, func
from sqlalchemy.orm import Session, joinedload
from app.models.student import Student
from app.repositories.base import BaseRepository
from app.schemas.student import StudentSearchParams


class StudentRepository(BaseRepository[Student]):
    def __init__(self, db: Session):
        super().__init__(Student, db)

    def get_by_register_number(self, reg_no: str) -> Optional[Student]:
        cleaned = reg_no.strip().upper()
        return self.db.query(Student).filter(func.upper(Student.register_number) == cleaned).first()

    def get_by_email(self, email: str) -> Optional[Student]:
        cleaned = email.strip().lower()
        return self.db.query(Student).filter(func.lower(Student.email) == cleaned).first()

    def get_detail_by_id(self, student_id: int) -> Optional[Student]:
        return (
            self.db.query(Student)
            .options(
                joinedload(Student.department),
                joinedload(Student.course),
                joinedload(Student.guardians),
                joinedload(Student.academic_background),
                joinedload(Student.semester_records),
                joinedload(Student.assessments),
                joinedload(Student.subject_marks),
                joinedload(Student.attendance_records),
                joinedload(Student.achievements),
                joinedload(Student.skills),
                joinedload(Student.certificates),
                joinedload(Student.projects),
                joinedload(Student.profile_links),
                joinedload(Student.remarks),
            )
            .filter(Student.id == student_id)
            .first()
        )

    def search(
        self,
        params: StudentSearchParams,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[Student], int]:
        query = self.db.query(Student).options(
            joinedload(Student.department),
            joinedload(Student.course),
            joinedload(Student.skills),
            joinedload(Student.achievements),
            joinedload(Student.semester_records),
            joinedload(Student.attendance_records),
        )

        if params.query:
            term = f"%{params.query.strip().lower()}%"
            query = query.filter(
                or_(
                    func.lower(Student.register_number).like(term),
                    func.lower(Student.first_name).like(term),
                    func.lower(Student.last_name).like(term),
                    func.lower(Student.full_name).like(term),
                )
            )

        if params.register_number:
            term = f"%{params.register_number.strip().upper()}%"
            query = query.filter(func.upper(Student.register_number).like(term))

        if params.name:
            term = f"%{params.name.strip().lower()}%"
            query = query.filter(func.lower(Student.full_name).like(term))

        if params.department_id:
            query = query.filter(Student.department_id == params.department_id)

        if params.course_id:
            query = query.filter(Student.course_id == params.course_id)

        if params.year:
            query = query.filter(Student.year == params.year)

        if params.semester:
            query = query.filter(Student.semester == params.semester)

        if params.section:
            query = query.filter(func.upper(Student.section) == params.section.strip().upper())

        total = query.count()
        items = query.order_by(Student.register_number.asc()).offset(skip).limit(limit).all()
        return items, total