from typing import List
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.achievement import Achievement
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.achievement import AchievementCreate, AchievementUpdate
from app.utils.validators import validate_safe_url


class AchievementService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AchievementRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int) -> List[Achievement]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_by_student(student_id)

    def create(self, data: AchievementCreate) -> Achievement:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        d = data.model_dump()
        d["certificate_url"] = validate_safe_url(data.certificate_url)
        d["image_url"] = validate_safe_url(data.image_url)

        ach = Achievement(**d)
        return self.repo.create(ach)

    def update(self, achievement_id: int, data: AchievementUpdate) -> Achievement:
        ach = self.repo.get_by_id(achievement_id)
        if not ach:
            raise NotFoundException(f"Achievement with ID {achievement_id} not found", "ACHIEVEMENT_NOT_FOUND")

        d = data.model_dump(exclude_unset=True)
        if "certificate_url" in d:
            d["certificate_url"] = validate_safe_url(d["certificate_url"])
        if "image_url" in d:
            d["image_url"] = validate_safe_url(d["image_url"])

        return self.repo.update(ach, d)

    def delete(self, achievement_id: int) -> bool:
        ach = self.repo.get_by_id(achievement_id)
        if not ach:
            raise NotFoundException(f"Achievement with ID {achievement_id} not found", "ACHIEVEMENT_NOT_FOUND")
        return self.repo.delete(ach)