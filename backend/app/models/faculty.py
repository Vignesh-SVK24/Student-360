from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Faculty(Base, TimestampMixin):
    __tablename__ = "faculty"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), unique=True, nullable=True, index=True)

    faculty_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(200), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone_number = Column(String(50), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="SET NULL"), nullable=True, index=True)
    designation = Column(String(100), default="Assistant Professor", nullable=False)
    profile_photo_url = Column(String(2048), nullable=True)
    active = Column(Boolean, default=True, nullable=False)

    user = relationship("User", back_populates="faculty")
    department = relationship("Department", back_populates="faculty")
    remarks = relationship("FacultyRemark", back_populates="faculty")