from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class TechnologyBase(BaseModel):
    name: str
    category: Optional[str] = None


class TechnologyCreate(TechnologyBase):
    pass


class TechnologyResponse(TechnologyBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class ProjectBase(BaseModel):
    student_id: int
    title: str
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    student_role: str = "Lead Developer"
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    project_image_url: Optional[str] = None
    technologies: List[str] = []


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    short_description: Optional[str] = None
    detailed_description: Optional[str] = None
    student_role: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    github_url: Optional[str] = None
    live_demo_url: Optional[str] = None
    project_image_url: Optional[str] = None
    technologies: Optional[List[str]] = None


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)