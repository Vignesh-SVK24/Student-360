from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.core.constants import SkillCategory, SkillProficiency


class SkillBase(BaseModel):
    student_id: int
    name: str
    category: str = SkillCategory.TECHNICAL.value
    proficiency_level: str = SkillProficiency.INTERMEDIATE.value


class SkillCreate(SkillBase):
    pass


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    proficiency_level: Optional[str] = None


class SkillResponse(SkillBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)