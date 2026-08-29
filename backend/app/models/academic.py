from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import AssessmentType


class StudentAcademicBackground(Base, TimestampMixin):
    __tablename__ = "student_academic_backgrounds"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)

    # 10th Standard
    school_10th = Column(String(200), nullable=True)
    board_10th = Column(String(100), nullable=True)
    total_marks_10th = Column(Float, nullable=True)
    maximum_marks_10th = Column(Float, nullable=True)
    percentage_10th = Column(Float, nullable=True)
    year_of_passing_10th = Column(Integer, nullable=True)

    # 12th Standard
    school_12th = Column(String(200), nullable=True)
    board_12th = Column(String(100), nullable=True)
    total_marks_12th = Column(Float, nullable=True)
    maximum_marks_12th = Column(Float, nullable=True)
    percentage_12th = Column(Float, nullable=True)
    year_of_passing_12th = Column(Integer, nullable=True)

    student = relationship("Student", back_populates="academic_background")


class SemesterAcademicRecord(Base, TimestampMixin):
    __tablename__ = "semester_academic_records"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    academic_year = Column(String(50), nullable=False)
    internal_score = Column(Float, nullable=True)
    semester_score = Column(Float, nullable=True)
    percentage = Column(Float, nullable=True)
    sgpa = Column(Float, nullable=True)
    cgpa = Column(Float, nullable=True)

    student = relationship("Student", back_populates="semester_records")


class AcademicAssessment(Base, TimestampMixin):
    __tablename__ = "academic_assessments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    subject = Column(String(200), nullable=False)
    assessment_type = Column(String(50), default=AssessmentType.IA1.value, nullable=False)
    assessment_name = Column(String(100), nullable=False)
    maximum_marks = Column(Float, default=50.0, nullable=False)
    obtained_marks = Column(Float, nullable=False)
    assessment_date = Column(Date, nullable=True)

    student = relationship("Student", back_populates="assessments")


class StudentSubjectMarks(Base, TimestampMixin):
    __tablename__ = "student_subject_marks"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False, index=True)
    semester = Column(Integer, nullable=False, index=True)
    internal_marks = Column(Float, default=0.0, nullable=False)
    semester_marks = Column(Float, default=0.0, nullable=False)
    total_marks = Column(Float, default=0.0, nullable=False)
    grade = Column(String(5), nullable=True)
    grade_points = Column(Float, nullable=True)

    student = relationship("Student", back_populates="subject_marks")
    subject = relationship("Subject", back_populates="subject_marks")