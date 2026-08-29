from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.achievement import AchievementCreate, AchievementUpdate, AchievementResponse
from app.services.achievement_service import AchievementService

router = APIRouter(tags=["Achievements"])


@router.get("/students/{student_id}/achievements", response_model=ApiResponse[List[AchievementResponse]])
def get_student_achievements(student_id: int, db: Session = Depends(get_db)):
    """Retrieve all honors, competitions, hackathons, and awards for a student."""
    service = AchievementService(db)
    items = service.get_by_student(student_id)
    return ApiResponse(
        success=True,
        message="Achievements retrieved",
        data=[AchievementResponse.model_validate(i) for i in items],
    )


@router.post("/achievements", response_model=ApiResponse[AchievementResponse], status_code=status.HTTP_201_CREATED)
def create_achievement(data: AchievementCreate, db: Session = Depends(get_db)):
    """Register a new student achievement with optional certificate URL."""
    service = AchievementService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Achievement registered",
        data=AchievementResponse.model_validate(saved),
    )


@router.patch("/achievements/{achievement_id}", response_model=ApiResponse[AchievementResponse])
def update_achievement(achievement_id: int, data: AchievementUpdate, db: Session = Depends(get_db)):
    """Update an achievement entry."""
    service = AchievementService(db)
    updated = service.update(achievement_id, data)
    return ApiResponse(
        success=True,
        message="Achievement updated",
        data=AchievementResponse.model_validate(updated),
    )


@router.delete("/achievements/{achievement_id}", response_model=ApiResponse[DeleteResponse])
def delete_achievement(achievement_id: int, db: Session = Depends(get_db)):
    """Delete an achievement entry."""
    service = AchievementService(db)
    service.delete(achievement_id)
    return ApiResponse(
        success=True,
        message="Achievement deleted",
        data=DeleteResponse(id=achievement_id, deleted=True),
    )