from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class StudentAttendance(Base, TimestampMixin):
    __tablename__ = "student_attendances"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    academic_year = Column(String(50), nullable=False)

    total_classes = Column(Integer, default=0, nullable=False)
    present_classes = Column(Integer, default=0, nullable=False)
    absent_classes = Column(Integer, default=0, nullable=False)
    attendance_percentage = Column(Float, default=0.0, nullable=False)

    last_updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        server_default=func.now(),
    )

    student = relationship("Student", back_populates="attendance_records")
    subject = relationship("Subject", back_populates="attendance_records")