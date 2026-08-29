from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse
from app.schemas.faculty import FacultyCreate, FacultyUpdate, FacultyResponse
from app.services.faculty_service import FacultyService

router = APIRouter(prefix="/faculty", tags=["Faculty"])


@router.get("", response_model=ApiResponse[List[FacultyResponse]])
def list_faculty(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """List faculty members."""
    service = FacultyService(db)
    faculty_list = service.list_faculty(skip=skip, limit=limit)
    return ApiResponse(
        success=True,
        message="Faculty list retrieved",
        data=[FacultyResponse.model_validate(f) for f in faculty_list],
    )


@router.get("/{faculty_id}", response_model=ApiResponse[FacultyResponse])
def get_faculty(faculty_id: int, db: Session = Depends(get_db)):
    """Get faculty profile by ID."""
    service = FacultyService(db)
    fac = service.get_by_id(faculty_id)
    return ApiResponse(
        success=True,
        message="Faculty profile retrieved",
        data=FacultyResponse.model_validate(fac),
    )


@router.post("", response_model=ApiResponse[FacultyResponse], status_code=status.HTTP_201_CREATED)
def create_faculty(data: FacultyCreate, db: Session = Depends(get_db)):
    """Create a faculty record."""
    service = FacultyService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Faculty registered successfully",
        data=FacultyResponse.model_validate(saved),
    )


@router.patch("/{faculty_id}", response_model=ApiResponse[FacultyResponse])
def update_faculty(faculty_id: int, data: FacultyUpdate, db: Session = Depends(get_db)):
    """Update faculty profile."""
    service = FacultyService(db)
    updated = service.update(faculty_id, data)
    return ApiResponse(
        success=True,
        message="Faculty updated successfully",
        data=FacultyResponse.model_validate(updated),
    )