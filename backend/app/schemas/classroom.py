from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.student import StudentSummary


class ClassroomBase(BaseModel):
    class_name: str
    class_code: Optional[str] = None
    department_id: Optional[int] = None
    academic_year: str = "2025-2026"
    year: str = "II"
    semester: int = 3
    section: str = "A"
    is_active: bool = True


class ClassroomCreate(ClassroomBase):
    advisor_faculty_id: Optional[int] = None
    tutor_faculty_id: Optional[int] = None


class ClassroomUpdate(BaseModel):
    class_name: Optional[str] = None
    department_id: Optional[int] = None
    academic_year: Optional[str] = None
    year: Optional[str] = None
    semester: Optional[int] = None
    section: Optional[str] = None
    advisor_faculty_id: Optional[int] = None
    tutor_faculty_id: Optional[int] = None
    is_active: Optional[bool] = None


class ClassroomResponse(ClassroomBase):
    id: int
    class_code: str
    created_by: Optional[int] = None
    advisor_faculty_id: Optional[int] = None
    tutor_faculty_id: Optional[int] = None
    advisor_name: Optional[str] = None
    tutor_name: Optional[str] = None
    department_name: Optional[str] = None
    student_count: int = 0
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ClassroomDetailResponse(ClassroomResponse):
    students: List[StudentSummary] = []
