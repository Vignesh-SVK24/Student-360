from app.repositories.base import BaseRepository
from app.repositories.user_repository import UserRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.academic_repository import AcademicRepository
from app.repositories.attendance_repository import AttendanceRepository
from app.repositories.achievement_repository import AchievementRepository
from app.repositories.skill_repository import SkillRepository
from app.repositories.certificate_repository import CertificateRepository
from app.repositories.project_repository import ProjectRepository
from app.repositories.remark_repository import RemarkRepository
from app.repositories.profile_link_repository import ProfileLinkRepository
from app.repositories.faculty_repository import FacultyRepository
from app.repositories.audit_repository import AuditRepository

__all__ = [
    "BaseRepository",
    "StudentRepository",
    "AcademicRepository",
    "AttendanceRepository",
    "AchievementRepository",
    "SkillRepository",
    "CertificateRepository",
    "ProjectRepository",
    "RemarkRepository",
    "ProfileLinkRepository",
    "FacultyRepository",
    "AuditRepository",
]