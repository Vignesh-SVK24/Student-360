from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Subject(Base, TimestampMixin):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    name = Column(String(200), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    maximum_marks = Column(Float, default=100.0, nullable=False)
    credits = Column(Float, default=3.0, nullable=False)

    course = relationship("Course", back_populates="subjects")
    subject_marks = relationship("StudentSubjectMarks", back_populates="subject", cascade="all, delete-orphan")
    attendance_records = relationship("StudentAttendance", back_populates="subject", cascade="all, delete-orphan")