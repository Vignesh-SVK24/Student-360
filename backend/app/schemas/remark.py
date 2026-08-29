from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.core.constants import RemarkGrade


class FacultyRemarkBase(BaseModel):
    student_id: int
    faculty_id: Optional[int] = None
    grade: str = RemarkGrade.EXCELLENT.value
    remark: str


class FacultyRemarkCreate(FacultyRemarkBase):
    pass


class FacultyRemarkUpdate(BaseModel):
    grade: Optional[str] = None
    remark: Optional[str] = None


class FacultyRemarkResponse(FacultyRemarkBase):
    id: int
    faculty_name: Optional[str] = None
    faculty_designation: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)