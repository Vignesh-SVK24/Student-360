from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.guardian import GuardianResponse
from app.schemas.academic import (
    AcademicBackgroundResponse,
    SemesterAcademicRecordResponse,
    AcademicAssessmentResponse,
    StudentSubjectMarksResponse,
)
from app.schemas.attendance import AttendanceResponse
from app.schemas.achievement import AchievementResponse
from app.schemas.skill import SkillResponse
from app.schemas.certificate import CertificateResponse
from app.schemas.project import ProjectResponse
from app.schemas.profile_link import ProfileLinkResponse
from app.schemas.remark import FacultyRemarkResponse


class StudentDetailResponse(BaseModel):
    id: int
    register_number: str
    first_name: str
    last_name: str
    full_name: str
    email: str
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    profile_photo_url: Optional[str] = None

    department_id: Optional[int] = None
    department_name: Optional[str] = None
    department_code: Optional[str] = None

    course_id: Optional[int] = None
    course_name: Optional[str] = None
    course_code: Optional[str] = None

    year: str
    semester: int
    section: str
    student_type: str
    active: bool

    attendance_percentage: float = 0.0
    cgpa: float = 0.0

    # Nested 360 Portfolios
    guardians: List[GuardianResponse] = []
    academic_background: Optional[AcademicBackgroundResponse] = None
    semester_records: List[SemesterAcademicRecordResponse] = []
    assessments: List[AcademicAssessmentResponse] = []
    subject_marks: List[StudentSubjectMarksResponse] = []
    attendance_records: List[AttendanceResponse] = []
    achievements: List[AchievementResponse] = []
    skills: List[SkillResponse] = []
    certificates: List[CertificateResponse] = []
    projects: List[ProjectResponse] = []
    profile_links: List[ProfileLinkResponse] = []
    remarks: List[FacultyRemarkResponse] = []

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)