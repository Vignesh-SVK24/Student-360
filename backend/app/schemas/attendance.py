from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class AttendanceBase(BaseModel):
    student_id: int
    subject_id: int
    semester: int
    academic_year: str
    total_classes: int = 0
    present_classes: int = 0
    absent_classes: int = 0
    attendance_percentage: Optional[float] = None


class AttendanceCreate(AttendanceBase):
    pass


class AttendanceUpdate(BaseModel):
    total_classes: Optional[int] = None
    present_classes: Optional[int] = None
    absent_classes: Optional[int] = None


class AttendanceResponse(AttendanceBase):
    id: int
    subject_code: Optional[str] = None
    subject_name: Optional[str] = None
    last_updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class AttendanceSubjectDetail(BaseModel):
    id: int
    subject_id: int
    subject_code: str
    subject_name: str
    semester: int
    academic_year: str
    total_classes: int
    present_classes: int
    absent_classes: int
    attendance_percentage: float
    is_deficient: bool


class AttendanceSummaryResponse(BaseModel):
    student_id: int
    semester: Optional[int] = None
    overall_percentage: float
    total_conducted_classes: int
    total_attended_classes: int
    total_absent_classes: int
    is_compliant: bool
    subjects: List[AttendanceSubjectDetail] = []