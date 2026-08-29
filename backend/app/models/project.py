from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.base import TimestampMixin

project_technologies = Table(
    "project_technologies",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id", ondelete="CASCADE"), primary_key=True),
    Column("technology_id", Integer, ForeignKey("technologies.id", ondelete="CASCADE"), primary_key=True),
)


class Technology(Base, TimestampMixin):
    __tablename__ = "technologies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(50), nullable=True)

    projects = relationship("Project", secondary=project_technologies, back_populates="technologies")


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    short_description = Column(String(500), nullable=True)
    detailed_description = Column(Text, nullable=True)
    student_role = Column(String(100), default="Lead Developer", nullable=False)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    github_url = Column(String(2048), nullable=True)
    live_demo_url = Column(String(2048), nullable=True)
    project_image_url = Column(String(2048), nullable=True)

    student = relationship("Student", back_populates="projects")
    technologies = relationship("Technology", secondary=project_technologies, back_populates="projects")