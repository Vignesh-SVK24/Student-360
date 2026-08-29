from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.skill import Skill
from app.repositories.skill_repository import SkillRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.skill import SkillCreate, SkillUpdate


class SkillService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = SkillRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int, category: Optional[str] = None) -> List[Skill]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_by_student(student_id, category)

    def create(self, data: SkillCreate) -> Skill:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        skill = Skill(**data.model_dump())
        return self.repo.create(skill)

    def update(self, skill_id: int, data: SkillUpdate) -> Skill:
        skill = self.repo.get_by_id(skill_id)
        if not skill:
            raise NotFoundException(f"Skill with ID {skill_id} not found", "SKILL_NOT_FOUND")
        return self.repo.update(skill, data.model_dump(exclude_unset=True))

    def delete(self, skill_id: int) -> bool:
        skill = self.repo.get_by_id(skill_id)
        if not skill:
            raise NotFoundException(f"Skill with ID {skill_id} not found", "SKILL_NOT_FOUND")
        return self.repo.delete(skill)