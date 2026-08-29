from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import RemarkGrade


class FacultyRemark(Base, TimestampMixin):
    __tablename__ = "faculty_remarks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True, index=True)
    grade = Column(String(50), default=RemarkGrade.EXCELLENT.value, nullable=False)
    remark = Column(Text, nullable=False)

    student = relationship("Student", back_populates="remarks")
    faculty = relationship("Faculty", back_populates="remarks")