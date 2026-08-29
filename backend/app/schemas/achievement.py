from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class AchievementBase(BaseModel):
    student_id: int
    title: str
    description: Optional[str] = None
    organization: Optional[str] = None
    event_name: str
    achievement_date: Optional[date] = None
    leadership_role: Optional[str] = None
    position: Optional[str] = None
    certificate_url: Optional[str] = None
    image_url: Optional[str] = None


class AchievementCreate(AchievementBase):
    pass


class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    organization: Optional[str] = None
    event_name: Optional[str] = None
    achievement_date: Optional[date] = None
    leadership_role: Optional[str] = None
    position: Optional[str] = None
    certificate_url: Optional[str] = None
    image_url: Optional[str] = None


class AchievementResponse(AchievementBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)