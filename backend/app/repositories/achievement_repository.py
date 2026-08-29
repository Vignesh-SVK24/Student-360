from typing import List
from sqlalchemy.orm import Session
from app.models.achievement import Achievement
from app.repositories.base import BaseRepository


class AchievementRepository(BaseRepository[Achievement]):
    def __init__(self, db: Session):
        super().__init__(Achievement, db)

    def get_by_student(self, student_id: int) -> List[Achievement]:
        return (
            self.db.query(Achievement)
            .filter(Achievement.student_id == student_id)
            .order_by(Achievement.achievement_date.desc().nullslast())
            .all()
        )