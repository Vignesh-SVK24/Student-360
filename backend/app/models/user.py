from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin
from app.core.constants import UserRole, AccountStatus


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default=UserRole.STUDENT.value, index=True)

    is_active = Column(Boolean, default=True, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default=AccountStatus.ACTIVE.value, nullable=False)

    last_login_at = Column(DateTime, nullable=True)
    reset_token = Column(String(255), nullable=True, index=True)
    reset_token_expires_at = Column(DateTime, nullable=True)

    # 1:1 Relationships
    student = relationship("Student", back_populates="user", uselist=False)
    faculty = relationship("Faculty", back_populates="user", uselist=False)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}', active={self.is_active})>"