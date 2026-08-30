from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.auth import (
    StudentLoginRequest,
    FacultyLoginRequest,
    FacultyRegisterRequest,
    RefreshTokenRequest,
    AuthUserPayload,
    AuthTokenResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    StudentNameChangeRequest,
)
from app.schemas.department import DepartmentCreate, DepartmentUpdate, DepartmentResponse
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.schemas.subject import SubjectCreate, SubjectUpdate, SubjectResponse
from app.schemas.guardian import GuardianCreate, GuardianUpdate, GuardianResponse
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentSummary,
    StudentResponse,
    StudentSearchParams,
)
from app.schemas.student_detail import StudentDetailResponse
from app.schemas.faculty import FacultyCreate, FacultyUpdate, FacultyResponse
from app.schemas.academic import (
    AcademicBackgroundCreate,
    AcademicBackgroundUpdate,
    AcademicBackgroundResponse,
    SemesterAcademicRecordCreate,
    SemesterAcademicRecordUpdate,
    SemesterAcademicRecordResponse,
    AcademicAssessmentCreate,
    AcademicAssessmentUpdate,
    AcademicAssessmentResponse,
    StudentSubjectMarksCreate,
    StudentSubjectMarksUpdate,
    StudentSubjectMarksResponse,
)
from app.schemas.attendance import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
    AttendanceSummaryResponse,
    AttendanceSubjectDetail,
)
from app.schemas.achievement import AchievementCreate, AchievementUpdate, AchievementResponse
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from app.schemas.certificate import CertificateCreate, CertificateUpdate, CertificateResponse
from app.schemas.project import (
    TechnologyCreate,
    TechnologyResponse,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)
from app.schemas.profile_link import ProfileLinkCreate, ProfileLinkUpdate, ProfileLinkResponse
from app.schemas.remark import FacultyRemarkCreate, FacultyRemarkUpdate, FacultyRemarkResponse

__all__ = [
    "ApiResponse",
    "DeleteResponse",
    "DepartmentCreate",
    "DepartmentUpdate",
    "DepartmentResponse",
    "CourseCreate",
    "CourseUpdate",
    "CourseResponse",
    "SubjectCreate",
    "SubjectUpdate",
    "SubjectResponse",
    "GuardianCreate",
    "GuardianUpdate",
    "GuardianResponse",
    "StudentCreate",
    "StudentUpdate",
    "StudentSummary",
    "StudentResponse",
    "StudentDetailResponse",
    "StudentSearchParams",
    "FacultyCreate",
    "FacultyUpdate",
    "FacultyResponse",
    "AcademicBackgroundCreate",
    "AcademicBackgroundUpdate",
    "AcademicBackgroundResponse",
    "SemesterAcademicRecordCreate",
    "SemesterAcademicRecordUpdate",
    "SemesterAcademicRecordResponse",
    "AcademicAssessmentCreate",
    "AcademicAssessmentUpdate",
    "AcademicAssessmentResponse",
    "StudentSubjectMarksCreate",
    "StudentSubjectMarksUpdate",
    "StudentSubjectMarksResponse",
    "AttendanceCreate",
    "AttendanceUpdate",
    "AttendanceResponse",
    "AttendanceSummaryResponse",
    "AttendanceSubjectDetail",
    "AchievementCreate",
    "AchievementUpdate",
    "AchievementResponse",
    "SkillCreate",
    "SkillUpdate",
    "SkillResponse",
    "CertificateCreate",
    "CertificateUpdate",
    "CertificateResponse",
    "TechnologyCreate",
    "TechnologyResponse",
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectResponse",
    "ProfileLinkCreate",
    "ProfileLinkUpdate",
    "ProfileLinkResponse",
    "FacultyRemarkCreate",
    "FacultyRemarkUpdate",
    "FacultyRemarkResponse",
]