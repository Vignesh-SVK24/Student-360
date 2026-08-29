from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship as orm_relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Guardian(Base, TimestampMixin):
    __tablename__ = "guardians"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    parent_name = Column(String(200), nullable=False)
    relationship = Column(String(50), default="Father", nullable=False)
    phone_number = Column(String(50), nullable=False)
    email = Column(String(255), nullable=True)
    occupation = Column(String(100), nullable=True)
    address = Column(String(500), nullable=True)
    is_primary_contact = Column(Boolean, default=True, nullable=False)

    student = orm_relationship("Student", back_populates="guardians")