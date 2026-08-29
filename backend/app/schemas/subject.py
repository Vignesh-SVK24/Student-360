from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class SubjectBase(BaseModel):
    course_id: int
    semester: int
    name: str
    code: str
    maximum_marks: float = 100.0
    credits: float = 3.0


class SubjectCreate(SubjectBase):
    pass


class SubjectUpdate(BaseModel):
    course_id: Optional[int] = None
    semester: Optional[int] = None
    name: Optional[str] = None
    code: Optional[str] = None
    maximum_marks: Optional[float] = None
    credits: Optional[float] = None


class SubjectResponse(SubjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)