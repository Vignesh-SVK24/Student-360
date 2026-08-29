from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.profile_link import ProfileLinkCreate, ProfileLinkUpdate, ProfileLinkResponse
from app.services.profile_link_service import ProfileLinkService

router = APIRouter(tags=["Profile Links"])


@router.get("/students/{student_id}/profile-links", response_model=ApiResponse[List[ProfileLinkResponse]])
def get_student_profile_links(
    student_id: int,
    public_only: bool = Query(False, description="Filter only public links"),
    db: Session = Depends(get_db),
):
    """Retrieve social, coding, and portfolio profile links (GitHub, LinkedIn, LeetCode, etc.)."""
    service = ProfileLinkService(db)
    items = service.get_by_student(student_id, public_only=public_only)
    return ApiResponse(
        success=True,
        message="Profile links retrieved",
        data=[ProfileLinkResponse.model_validate(i) for i in items],
    )


@router.post("/profile-links", response_model=ApiResponse[ProfileLinkResponse], status_code=status.HTTP_201_CREATED)
def create_profile_link(data: ProfileLinkCreate, db: Session = Depends(get_db)):
    """Register a new verified profile link."""
    service = ProfileLinkService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Profile link added",
        data=ProfileLinkResponse.model_validate(saved),
    )


@router.patch("/profile-links/{link_id}", response_model=ApiResponse[ProfileLinkResponse])
def update_profile_link(link_id: int, data: ProfileLinkUpdate, db: Session = Depends(get_db)):
    """Update profile link platform or URL."""
    service = ProfileLinkService(db)
    updated = service.update(link_id, data)
    return ApiResponse(
        success=True,
        message="Profile link updated",
        data=ProfileLinkResponse.model_validate(updated),
    )


@router.delete("/profile-links/{link_id}", response_model=ApiResponse[DeleteResponse])
def delete_profile_link(link_id: int, db: Session = Depends(get_db)):
    """Delete a profile link."""
    service = ProfileLinkService(db)
    service.delete(link_id)
    return ApiResponse(
        success=True,
        message="Profile link deleted",
        data=DeleteResponse(id=link_id, deleted=True),
    )