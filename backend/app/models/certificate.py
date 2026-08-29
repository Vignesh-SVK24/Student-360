from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin


class Certificate(Base, TimestampMixin):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    issuing_organization = Column(String(200), nullable=False)
    issue_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    credential_id = Column(String(100), nullable=True)
    credential_url = Column(String(2048), nullable=True)
    certificate_file_url = Column(String(2048), nullable=True)
    thumbnail_url = Column(String(2048), nullable=True)

    student = relationship("Student", back_populates="certificates")