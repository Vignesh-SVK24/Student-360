from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CourseBase(BaseModel):
    department_id: int
    name: str
    code: str
    duration_years: int = 4
    description: Optional[str] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):
    department_id: Optional[int] = None
    name: Optional[str] = None
    code: Optional[str] = None
    duration_years: Optional[int] = None
    description: Optional[str] = None


class CourseResponse(CourseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)