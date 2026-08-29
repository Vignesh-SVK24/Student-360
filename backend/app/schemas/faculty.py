from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class FacultyBase(BaseModel):
    faculty_id: str
    name: str
    email: EmailStr
    phone_number: Optional[str] = None
    department_id: Optional[int] = None
    designation: str = "Assistant Professor"
    profile_photo_url: Optional[str] = None
    active: bool = True


class FacultyCreate(FacultyBase):
    pass


class FacultyUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    department_id: Optional[int] = None
    designation: Optional[str] = None
    profile_photo_url: Optional[str] = None
    active: Optional[bool] = None


class FacultyResponse(FacultyBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)