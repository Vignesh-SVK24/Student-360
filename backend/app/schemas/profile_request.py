from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class ProfileEditRequestCreate(BaseModel):
    section_name: str
    field_name: str
    current_value: Optional[str] = None
    requested_value: str
    reason: str


class StudentNameChangeRequestSubmit(BaseModel):
    requested_name: str
    reason: str


class ProfileEditRequestReview(BaseModel):
    action: str = "APPROVE"  # APPROVE or REJECT
    advisor_comment: Optional[str] = None
    permission_duration_hours: int = 24


class StudentEditPermissionResponse(BaseModel):
    id: int
    student_id: int
    request_id: int
    field_name: str
    granted_at: datetime
    expires_at: datetime
    status: str

    model_config = ConfigDict(from_attributes=True)


class ProfileEditRequestResponse(BaseModel):
    id: int
    student_id: int
    student_name: Optional[str] = None
    student_register_number: Optional[str] = None
    student_photo_url: Optional[str] = None
    classroom_id: Optional[int] = None
    section_name: str
    field_name: str
    current_value: Optional[str] = None
    requested_value: str
    reason: str
    status: str
    requested_at: datetime
    reviewed_by_faculty_id: Optional[int] = None
    reviewed_by_name: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    advisor_comment: Optional[str] = None
    permission: Optional[StudentEditPermissionResponse] = None

    model_config = ConfigDict(from_attributes=True)


class ApprovedFieldUpdate(BaseModel):
    field_name: str
    new_value: str
