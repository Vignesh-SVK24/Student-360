from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.skill import Skill
from app.repositories.base import BaseRepository


class SkillRepository(BaseRepository[Skill]):
    def __init__(self, db: Session):
        super().__init__(Skill, db)

    def get_by_student(self, student_id: int, category: Optional[str] = None) -> List[Skill]:
        q = self.db.query(Skill).filter(Skill.student_id == student_id)
        if category:
            q = q.filter(Skill.category == category)
        return q.order_by(Skill.name.asc()).all()