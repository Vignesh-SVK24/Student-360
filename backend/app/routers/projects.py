from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.project_service import ProjectService

router = APIRouter(tags=["Projects"])


@router.get("/students/{student_id}/projects", response_model=ApiResponse[List[ProjectResponse]])
def get_student_projects(student_id: int, db: Session = Depends(get_db)):
    """Retrieve all engineering/software projects for a student."""
    service = ProjectService(db)
    items = service.get_by_student(student_id)
    return ApiResponse(
        success=True,
        message="Projects retrieved",
        data=items,
    )


@router.post("/projects", response_model=ApiResponse[ProjectResponse], status_code=status.HTTP_201_CREATED)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):
    """Add a project to the student portfolio with normalized technologies."""
    service = ProjectService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Project created",
        data=saved,
    )


@router.patch("/projects/{project_id}", response_model=ApiResponse[ProjectResponse])
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db)):
    """Update project details."""
    service = ProjectService(db)
    updated = service.update(project_id, data)
    return ApiResponse(
        success=True,
        message="Project updated",
        data=updated,
    )


@router.delete("/projects/{project_id}", response_model=ApiResponse[DeleteResponse])
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project entry."""
    service = ProjectService(db)
    service.delete(project_id)
    return ApiResponse(
        success=True,
        message="Project deleted",
        data=DeleteResponse(id=project_id, deleted=True),
    )