from typing import List
from sqlalchemy.orm import Session
from app.models.profile_link import ProfileLink
from app.repositories.base import BaseRepository


class ProfileLinkRepository(BaseRepository[ProfileLink]):
    def __init__(self, db: Session):
        super().__init__(ProfileLink, db)

    def get_by_student(self, student_id: int, public_only: bool = False) -> List[ProfileLink]:
        q = self.db.query(ProfileLink).filter(ProfileLink.student_id == student_id)
        if public_only:
            q = q.filter(ProfileLink.is_public == True)
        return q.order_by(ProfileLink.platform.asc()).all()