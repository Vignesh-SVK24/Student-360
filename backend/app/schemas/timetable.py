from typing import Optional, List
from pydantic import BaseModel, ConfigDict


class TimetableSlotBase(BaseModel):
    day_of_week: str
    period_number: int
    start_time: str
    end_time: str
    subject_name: str
    subject_code: Optional[str] = None
    room: Optional[str] = None
    faculty_name: Optional[str] = None
    department_id: Optional[int] = None


class TimetableSlotUpdate(BaseModel):
    subject_name: Optional[str] = None
    subject_code: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    room: Optional[str] = None
    faculty_name: Optional[str] = None


class TimetableSlotResponse(TimetableSlotBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class DayTimetable(BaseModel):
    day: str
    slots: List[TimetableSlotResponse]


class WeeklyTimetableResponse(BaseModel):
    days: List[DayTimetable]
