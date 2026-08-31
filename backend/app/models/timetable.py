from sqlalchemy import Column, Integer, String, ForeignKey
from app.core.database import Base
from app.models.base import TimestampMixin


class TimetableSlot(Base, TimestampMixin):
    __tablename__ = "timetable_slots"

    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(String(20), nullable=False, index=True)  # Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
    period_number = Column(Integer, nullable=False, index=True)   # 1 to 7
    start_time = Column(String(20), nullable=False)              # e.g., "09:00 AM"
    end_time = Column(String(20), nullable=False)                # e.g., "10:00 AM"
    subject_name = Column(String(150), nullable=False)           # e.g., "Machine Learning"
    subject_code = Column(String(50), nullable=True)             # e.g., "CS8501"
    room = Column(String(100), nullable=True)                    # e.g., "Lab 2 / Block B"
    faculty_name = Column(String(150), nullable=True)            # e.g., "Dr. Sarah Jenkins"
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)

    def __repr__(self) -> str:
        return f"<TimetableSlot(day='{self.day_of_week}', period={self.period_number}, subject='{self.subject_name}')>"
