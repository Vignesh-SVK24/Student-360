from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import ProfilePlatform


class ProfileLink(Base, TimestampMixin):
    __tablename__ = "profile_links"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    platform = Column(String(50), default=ProfilePlatform.GITHUB.value, nullable=False)
    url = Column(String(2048), nullable=False)
    is_public = Column(Boolean, default=True, nullable=False)

    student = relationship("Student", back_populates="profile_links")