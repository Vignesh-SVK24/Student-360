from typing import List
from sqlalchemy.orm import Session, joinedload
from app.models.remark import FacultyRemark
from app.repositories.base import BaseRepository


class RemarkRepository(BaseRepository[FacultyRemark]):
    def __init__(self, db: Session):
        super().__init__(FacultyRemark, db)

    def get_by_student(self, student_id: int) -> List[FacultyRemark]:
        return (
            self.db.query(FacultyRemark)
            .options(joinedload(FacultyRemark.faculty))
            .filter(FacultyRemark.student_id == student_id)
            .order_by(FacultyRemark.created_at.desc())
            .all()
        )