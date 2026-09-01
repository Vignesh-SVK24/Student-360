from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import TimetableEntryType


class TimetableSlot(Base, TimestampMixin):
    __tablename__ = "timetable_slots"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=True, index=True)
    day_of_week = Column(String(20), nullable=False, index=True)  # Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    period_number = Column(Integer, nullable=False, index=True)   # 1 to 7
    start_time = Column(String(20), nullable=False)              # e.g., "09:00 AM"
    end_time = Column(String(20), nullable=False)                # e.g., "10:00 AM"
    subject_name = Column(String(150), nullable=False)           # e.g., "Machine Learning"
    subject_code = Column(String(50), nullable=True)             # e.g., "CS8501"
    entry_type = Column(String(50), default=TimetableEntryType.SUBJECT.value, nullable=False) # SUBJECT, BREAK, LUNCH, FREE
    room = Column(String(100), nullable=True)                    # e.g., "Lab 2 / Block B"
    faculty_name = Column(String(150), nullable=True)            # e.g., "Dr. Sarah Jenkins"
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="SET NULL"), nullable=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)

    classroom = relationship("Classroom", back_populates="timetable_slots")
    faculty = relationship("Faculty")
    subject = relationship("Subject")

    def __repr__(self) -> str:
        return f"<TimetableSlot(day='{self.day_of_week}', period={self.period_number}, subject='{self.subject_name}', type='{self.entry_type}')>"

