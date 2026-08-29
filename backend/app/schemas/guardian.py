from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class GuardianBase(BaseModel):
    student_id: int
    parent_name: str
    relationship: str = "Father"
    phone_number: str
    email: Optional[EmailStr] = None
    occupation: Optional[str] = None
    address: Optional[str] = None
    is_primary_contact: bool = True


class GuardianCreate(GuardianBase):
    pass


class GuardianUpdate(BaseModel):
    parent_name: Optional[str] = None
    relationship: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    occupation: Optional[str] = None
    address: Optional[str] = None
    is_primary_contact: Optional[bool] = None


class GuardianResponse(GuardianBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)