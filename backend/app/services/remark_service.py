from typing import List
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.remark import FacultyRemark
from app.repositories.remark_repository import RemarkRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.remark import FacultyRemarkCreate, FacultyRemarkUpdate, FacultyRemarkResponse


class RemarkService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = RemarkRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int) -> List[FacultyRemarkResponse]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        remarks = self.repo.get_by_student(student_id)
        return [
            FacultyRemarkResponse(
                id=r.id,
                student_id=r.student_id,
                faculty_id=r.faculty_id,
                faculty_name=r.faculty.name if r.faculty else "Faculty Reviewer",
                faculty_designation=r.faculty.designation if r.faculty else "Academic Mentor",
                grade=r.grade,
                remark=r.remark,
                created_at=r.created_at,
                updated_at=r.updated_at,
            )
            for r in remarks
        ]

    def create(self, data: FacultyRemarkCreate) -> FacultyRemarkResponse:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        rem = FacultyRemark(**data.model_dump())
        saved = self.repo.create(rem)
        return FacultyRemarkResponse(
            id=saved.id,
            student_id=saved.student_id,
            faculty_id=saved.faculty_id,
            faculty_name=saved.faculty.name if saved.faculty else "Faculty Reviewer",
            faculty_designation=saved.faculty.designation if saved.faculty else "Academic Mentor",
            grade=saved.grade,
            remark=saved.remark,
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )

    def update(self, remark_id: int, data: FacultyRemarkUpdate) -> FacultyRemarkResponse:
        rem = self.repo.get_by_id(remark_id)
        if not rem:
            raise NotFoundException(f"Remark with ID {remark_id} not found", "REMARK_NOT_FOUND")
        saved = self.repo.update(rem, data.model_dump(exclude_unset=True))
        return FacultyRemarkResponse(
            id=saved.id,
            student_id=saved.student_id,
            faculty_id=saved.faculty_id,
            faculty_name=saved.faculty.name if saved.faculty else "Faculty Reviewer",
            faculty_designation=saved.faculty.designation if saved.faculty else "Academic Mentor",
            grade=saved.grade,
            remark=saved.remark,
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )

    def delete(self, remark_id: int) -> bool:
        rem = self.repo.get_by_id(remark_id)
        if not rem:
            raise NotFoundException(f"Remark with ID {remark_id} not found", "REMARK_NOT_FOUND")
        return self.repo.delete(rem)