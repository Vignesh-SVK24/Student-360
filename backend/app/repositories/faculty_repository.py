from typing import Optional
from sqlalchemy.orm import Session, joinedload
from app.models.faculty import Faculty
from app.repositories.base import BaseRepository


class FacultyRepository(BaseRepository[Faculty]):
    def __init__(self, db: Session):
        super().__init__(Faculty, db)

    def get_by_faculty_id(self, faculty_id: str) -> Optional[Faculty]:
        return (
            self.db.query(Faculty)
            .options(joinedload(Faculty.department))
            .filter(Faculty.faculty_id == faculty_id.strip())
            .first()
        )

    def get_by_email(self, email: str) -> Optional[Faculty]:
        return (
            self.db.query(Faculty)
            .options(joinedload(Faculty.department))
            .filter(Faculty.email == email.strip().lower())
            .first()
        )