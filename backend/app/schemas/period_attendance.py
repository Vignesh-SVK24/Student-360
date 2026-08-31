from datetime import date
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class StudentAttendanceMark(BaseModel):
    student_id: int
    status: str  # PRESENT, ABSENT, OD
    notes: Optional[str] = None


class BulkPeriodAttendanceRequest(BaseModel):
    date: str  # YYYY-MM-DD
    day_of_week: str
    period_number: int
    subject_name: str
    timetable_slot_id: Optional[int] = None
    attendance: List[StudentAttendanceMark]


class PeriodAttendanceItem(BaseModel):
    id: int
    student_id: int
    student_name: Optional[str] = None
    register_number: Optional[str] = None
    profile_photo_url: Optional[str] = None
    status: str
    notes: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)


class PeriodAttendanceSummaryResponse(BaseModel):
    date: str
    day_of_week: str
    period_number: int
    subject_name: str
    total_students: int
    present_count: int
    absent_count: int
    od_count: int
    records: List[PeriodAttendanceItem]
