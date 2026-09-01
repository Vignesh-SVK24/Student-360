from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import EditRequestStatus


class ProfileEditRequest(Base, TimestampMixin):
    __tablename__ = "profile_edit_requests"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id", ondelete="SET NULL"), nullable=True, index=True)
    section_name = Column(String(100), nullable=False)            # e.g., "Personal Info", "Parent Info", "Name"
    field_name = Column(String(100), nullable=False)              # e.g., "phone_number", "address", "full_name"
    current_value = Column(String(1000), nullable=True)
    requested_value = Column(String(1000), nullable=False)
    reason = Column(String(1000), nullable=False)
    status = Column(String(50), default=EditRequestStatus.PENDING.value, nullable=False, index=True)

    requested_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    reviewed_by_faculty_id = Column(Integer, ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    advisor_comment = Column(String(1000), nullable=True)

    student = relationship("Student", back_populates="edit_requests")
    classroom = relationship("Classroom")
    reviewed_by = relationship("Faculty")
    permission = relationship("StudentEditPermission", back_populates="request", uselist=False, cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<ProfileEditRequest(id={self.id}, student_id={self.student_id}, field='{self.field_name}', status='{self.status}')>"


class StudentEditPermission(Base, TimestampMixin):
    __tablename__ = "student_edit_permissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    request_id = Column(Integer, ForeignKey("profile_edit_requests.id", ondelete="CASCADE"), unique=True, nullable=False)
    field_name = Column(String(100), nullable=False)
    granted_at = Column(DateTime(timezone=True), default=datetime.utcnow, nullable=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="ACTIVE", nullable=False)  # ACTIVE, EXPIRED, USED

    student = relationship("Student", back_populates="edit_permissions")
    request = relationship("ProfileEditRequest", back_populates="permission")

    def __repr__(self) -> str:
        return f"<StudentEditPermission(id={self.id}, student_id={self.student_id}, field='{self.field_name}', status='{self.status}')>"
