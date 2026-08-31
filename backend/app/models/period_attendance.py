from datetime import date
from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class PeriodAttendanceLog(Base, TimestampMixin):
    __tablename__ = "period_attendance_logs"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    timetable_slot_id = Column(Integer, ForeignKey("timetable_slots.id", ondelete="SET NULL"), nullable=True)
    date = Column(Date, nullable=False, default=date.today, index=True)
    day_of_week = Column(String(20), nullable=False)
    period_number = Column(Integer, nullable=False)
    subject_name = Column(String(150), nullable=False)
    status = Column(String(20), nullable=False, default="PRESENT")  # PRESENT, ABSENT, OD
    marked_by_faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    notes = Column(String(255), nullable=True)

    student = relationship("Student")
    slot = relationship("TimetableSlot")

    def __repr__(self) -> str:
        return f"<PeriodAttendanceLog(student_id={self.student_id}, date={self.date}, period={self.period_number}, status='{self.status}')>"
