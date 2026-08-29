from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Achievement(Base, TimestampMixin):
    __tablename__ = "achievements"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    organization = Column(String(200), nullable=True)
    event_name = Column(String(200), nullable=False)
    achievement_date = Column(Date, nullable=True)
    leadership_role = Column(String(100), nullable=True)
    position = Column(String(100), nullable=True)  # Winner, Runner-up, 1st Place, etc.
    certificate_url = Column(String(2048), nullable=True)
    image_url = Column(String(2048), nullable=True)

    student = relationship("Student", back_populates="achievements")