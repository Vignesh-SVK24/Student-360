from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import SkillCategory, SkillProficiency


class Skill(Base, TimestampMixin):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default=SkillCategory.TECHNICAL.value, nullable=False)
    proficiency_level = Column(String(50), default=SkillProficiency.INTERMEDIATE.value, nullable=False)

    student = relationship("Student", back_populates="skills")