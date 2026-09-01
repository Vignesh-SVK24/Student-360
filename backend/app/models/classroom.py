from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import ClassroomStatus, FacultyClassroomRole


class Classroom(Base, TimestampMixin):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String(150), nullable=False)               # e.g., "AIML - Year 2 - Section A"
    class_code = Column(String(50), unique=True, index=True, nullable=False) # e.g., "AIML-2A-2025"
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    academic_year = Column(String(20), default="2025-2026", nullable=False)
    year = Column(String(10), default="II", nullable=False)         # I, II, III, IV
    semester = Column(Integer, default=3, nullable=False)           # 1 to 8
    section = Column(String(10), default="A", nullable=False)       # A, B, C
    created_by = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    advisor_faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True, index=True)
    tutor_faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True, index=True)
    is_active = Column(Boolean, default=True, nullable=False)

    department = relationship("Department")
    advisor = relationship("Faculty", foreign_keys=[advisor_faculty_id])
    tutor = relationship("Faculty", foreign_keys=[tutor_faculty_id])
    creator = relationship("Faculty", foreign_keys=[created_by])
    memberships = relationship("ClassroomMembership", back_populates="classroom", cascade="all, delete-orphan")
    subject_assignments = relationship("FacultySubjectAssignment", back_populates="classroom", cascade="all, delete-orphan")
    timetable_slots = relationship("TimetableSlot", back_populates="classroom")

    def __repr__(self) -> str:
        return f"<Classroom(id={self.id}, name='{self.class_name}', code='{self.class_code}')>"


class ClassroomMembership(Base, TimestampMixin):
    __tablename__ = "classroom_memberships"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    joined_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    left_at = Column(DateTime(timezone=True), nullable=True)
    status = Column(String(50), default=ClassroomStatus.ACTIVE.value, nullable=False)

    __table_args__ = (
        UniqueConstraint("classroom_id", "student_id", name="uq_classroom_student_membership"),
    )

    classroom = relationship("Classroom", back_populates="memberships")
    student = relationship("Student", back_populates="classroom_memberships")


class FacultyClassroomAssignment(Base, TimestampMixin):
    __tablename__ = "faculty_classroom_assignments"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    assignment_type = Column(String(50), default=FacultyClassroomRole.ADVISOR.value, nullable=False)  # ADVISOR, TUTOR
    start_date = Column(Date, default=date.today, nullable=False)
    end_date = Column(Date, nullable=True)
    active = Column(Boolean, default=True, nullable=False)

    faculty = relationship("Faculty", back_populates="classroom_assignments")
    classroom = relationship("Classroom")


class FacultySubjectAssignment(Base, TimestampMixin):
    __tablename__ = "faculty_subject_assignments"

    id = Column(Integer, primary_key=True, index=True)
    faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="CASCADE"), nullable=False, index=True)
    academic_year = Column(String(20), default="2025-2026", nullable=False)
    semester = Column(Integer, default=1, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("faculty_id", "subject_id", "classroom_id", "academic_year", "semester", name="uq_faculty_subject_classroom"),
    )

    faculty = relationship("Faculty", back_populates="subject_assignments")
    subject = relationship("Subject")
    classroom = relationship("Classroom", back_populates="subject_assignments")
