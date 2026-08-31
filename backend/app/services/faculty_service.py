from typing import List
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException, ConflictException
from app.models.faculty import Faculty
from app.repositories.faculty_repository import FacultyRepository
from app.schemas.faculty import FacultyCreate, FacultyUpdate


class FacultyService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FacultyRepository(db)

    def get_by_id(self, faculty_id: int) -> Faculty:
        fac = self.repo.get_by_id(faculty_id)
        if not fac:
            raise NotFoundException(f"Faculty with ID {faculty_id} not found", "FACULTY_NOT_FOUND")
        return fac

    def get_by_faculty_id(self, faculty_id: str) -> Faculty:
        fac = self.repo.get_by_faculty_id(faculty_id)
        if not fac:
            raise NotFoundException(f"Faculty with Code {faculty_id} not found", "FACULTY_NOT_FOUND")
        return fac

    def list_faculty(self, skip: int = 0, limit: int = 50) -> List[Faculty]:
        return self.repo.list(skip=skip, limit=limit)

    def create(self, data: FacultyCreate) -> Faculty:
        if self.repo.get_by_faculty_id(data.faculty_id):
            raise ConflictException(f"Faculty with ID '{data.faculty_id}' already exists", "DUPLICATE_FACULTY_ID")
        if self.repo.get_by_email(str(data.email)):
            raise ConflictException(f"Faculty with email '{data.email}' already exists", "DUPLICATE_EMAIL")

        fac = Faculty(**data.model_dump())
        return self.repo.create(fac)

    def update(self, id: int, data: FacultyUpdate) -> Faculty:
        fac = self.get_by_id(id)
        return self.repo.update(fac, data.model_dump(exclude_unset=True))