from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.core.constants import StudentType, Gender


class StudentBase(BaseModel):
    register_number: str
    first_name: str
    last_name: str
    full_name: Optional[str] = None
    email: EmailStr
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Gender.MALE.value
    address: Optional[str] = None
    profile_photo_url: Optional[str] = None

    department_id: Optional[int] = None
    course_id: Optional[int] = None

    year: str = "I"
    semester: int = 1
    section: str = "A"
    student_type: str = StudentType.DAY_SCHOLAR.value
    active: bool = True


class StudentCreate(StudentBase):
    initial_password: Optional[str] = None

    # Optional Guardian Details on creation
    parent_name: Optional[str] = None
    parent_relationship: Optional[str] = "Father"
    parent_phone: Optional[str] = None
    parent_email: Optional[EmailStr] = None
    parent_occupation: Optional[str] = None

    # Optional 10th School Background
    school_10th: Optional[str] = None
    board_10th: Optional[str] = None
    total_marks_10th: Optional[float] = None
    maximum_marks_10th: Optional[float] = None
    percentage_10th: Optional[float] = None
    year_of_passing_10th: Optional[int] = None

    # Optional 12th School Background
    school_12th: Optional[str] = None
    board_12th: Optional[str] = None
    total_marks_12th: Optional[float] = None
    maximum_marks_12th: Optional[float] = None
    percentage_12th: Optional[float] = None
    year_of_passing_12th: Optional[int] = None


class StudentUpdate(BaseModel):
    register_number: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    profile_photo_url: Optional[str] = None

    department_id: Optional[int] = None
    course_id: Optional[int] = None

    year: Optional[str] = None
    semester: Optional[int] = None
    section: Optional[str] = None
    student_type: Optional[str] = None
    active: Optional[bool] = None


class StudentSummary(BaseModel):
    id: int
    register_number: str
    full_name: str
    department_name: Optional[str] = None
    course_name: Optional[str] = None
    year: str
    semester: int
    section: str
    student_type: str
    profile_photo_url: Optional[str] = None
    attendance_percentage: Optional[float] = None
    cgpa: Optional[float] = None
    top_achievement: Optional[str] = None
    skills: List[str] = []

    model_config = ConfigDict(from_attributes=True)


class StudentResponse(StudentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class StudentSearchParams(BaseModel):
    query: Optional[str] = Field(default=None, description="Search term for name or register number")
    register_number: Optional[str] = None
    name: Optional[str] = None
    department_id: Optional[int] = None
    course_id: Optional[int] = None
    year: Optional[str] = None
    semester: Optional[int] = None
    section: Optional[str] = None


class StudentAccessResponse(BaseModel):
    student_id: int
    user_id: Optional[int] = None
    has_account: bool
    username: Optional[str] = None
    email: Optional[str] = None
    is_active: bool = False
    status: str = "INACTIVE"
    last_login_at: Optional[datetime] = None


class StudentAccessUpdateRequest(BaseModel):
    is_active: Optional[bool] = None
    new_password: Optional[str] = None