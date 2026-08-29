from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.core.constants import ProfilePlatform


class ProfileLinkBase(BaseModel):
    student_id: int
    platform: str = ProfilePlatform.GITHUB.value
    url: str
    is_public: bool = True


class ProfileLinkCreate(ProfileLinkBase):
    pass


class ProfileLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    is_public: Optional[bool] = None


class ProfileLinkResponse(ProfileLinkBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)