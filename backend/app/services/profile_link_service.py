from typing import List
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.profile_link import ProfileLink
from app.repositories.profile_link_repository import ProfileLinkRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.profile_link import ProfileLinkCreate, ProfileLinkUpdate
from app.utils.validators import validate_safe_url


class ProfileLinkService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ProfileLinkRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int, public_only: bool = False) -> List[ProfileLink]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_by_student(student_id, public_only=public_only)

    def create(self, data: ProfileLinkCreate) -> ProfileLink:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        safe_url = validate_safe_url(data.url)
        link = ProfileLink(
            student_id=data.student_id,
            platform=data.platform,
            url=safe_url,
            is_public=data.is_public,
        )
        return self.repo.create(link)

    def update(self, link_id: int, data: ProfileLinkUpdate) -> ProfileLink:
        link = self.repo.get_by_id(link_id)
        if not link:
            raise NotFoundException(f"Profile link with ID {link_id} not found", "PROFILE_LINK_NOT_FOUND")

        d = data.model_dump(exclude_unset=True)
        if "url" in d:
            d["url"] = validate_safe_url(d["url"])

        return self.repo.update(link, d)

    def delete(self, link_id: int) -> bool:
        link = self.repo.get_by_id(link_id)
        if not link:
            raise NotFoundException(f"Profile link with ID {link_id} not found", "PROFILE_LINK_NOT_FOUND")
        return self.repo.delete(link)