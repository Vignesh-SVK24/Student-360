from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import StudentType, Gender


class Student(Base, TimestampMixin):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    register_number = Column(String(50), unique=True, index=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    full_name = Column(String(200), index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(50), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), default=Gender.MALE.value, nullable=True)
    address = Column(String(500), nullable=True)
    profile_photo_url = Column(String(2048), nullable=True)

    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id", ondelete="SET NULL"), nullable=True, index=True)

    year = Column(String(10), default="I", nullable=False)
    semester = Column(Integer, default=1, nullable=False)
    section = Column(String(10), default="A", nullable=False)
    student_type = Column(String(50), default=StudentType.DAY_SCHOLAR.value, nullable=False)
    active = Column(Boolean, default=True, nullable=False)

    # Relationships
    department = relationship("Department", back_populates="students")
    course = relationship("Course", back_populates="students")
    guardians = relationship("Guardian", back_populates="student", cascade="all, delete-orphan")
    academic_background = relationship("StudentAcademicBackground", back_populates="student", uselist=False, cascade="all, delete-orphan")
    semester_records = relationship("SemesterAcademicRecord", back_populates="student", cascade="all, delete-orphan")
    assessments = relationship("AcademicAssessment", back_populates="student", cascade="all, delete-orphan")
    subject_marks = relationship("StudentSubjectMarks", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("StudentAttendance", back_populates="student", cascade="all, delete-orphan")
    achievements = relationship("Achievement", back_populates="student", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="student", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    profile_links = relationship("ProfileLink", back_populates="student", cascade="all, delete-orphan")
    remarks = relationship("FacultyRemark", back_populates="student", cascade="all, delete-orphan")