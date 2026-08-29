from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from app.services.skill_service import SkillService

router = APIRouter(tags=["Skills"])


@router.get("/students/{student_id}/skills", response_model=ApiResponse[List[SkillResponse]])
def get_student_skills(
    student_id: int,
    category: Optional[str] = Query(None, description="Filter by skill category"),
    db: Session = Depends(get_db),
):
    """Retrieve technical, programming, tool, and soft skills for a student."""
    service = SkillService(db)
    items = service.get_by_student(student_id, category=category)
    return ApiResponse(
        success=True,
        message="Skills inventory retrieved",
        data=[SkillResponse.model_validate(i) for i in items],
    )


@router.post("/skills", response_model=ApiResponse[SkillResponse], status_code=status.HTTP_201_CREATED)
def create_skill(data: SkillCreate, db: Session = Depends(get_db)):
    """Add a verified skill to the student portfolio."""
    service = SkillService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Skill added",
        data=SkillResponse.model_validate(saved),
    )


@router.patch("/skills/{skill_id}", response_model=ApiResponse[SkillResponse])
def update_skill(skill_id: int, data: SkillUpdate, db: Session = Depends(get_db)):
    """Update skill name, category, or proficiency."""
    service = SkillService(db)
    updated = service.update(skill_id, data)
    return ApiResponse(
        success=True,
        message="Skill updated",
        data=SkillResponse.model_validate(updated),
    )


@router.delete("/skills/{skill_id}", response_model=ApiResponse[DeleteResponse])
def delete_skill(skill_id: int, db: Session = Depends(get_db)):
    """Delete a skill entry."""
    service = SkillService(db)
    service.delete(skill_id)
    return ApiResponse(
        success=True,
        message="Skill deleted",
        data=DeleteResponse(id=skill_id, deleted=True),
    )