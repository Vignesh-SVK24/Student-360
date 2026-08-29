from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentSummary,
    StudentResponse,
    StudentSearchParams,
)
from app.schemas.student_detail import StudentDetailResponse
from app.services.student_service import StudentService
from app.utils.pagination import PaginatedResponse, PageInfo

router = APIRouter(prefix="/students", tags=["Students"])


@router.get("/search", response_model=ApiResponse[PaginatedResponse[StudentSummary]])
def search_students(
    query: Optional[str] = Query(None, description="Search term for name or register number"),
    register_number: Optional[str] = Query(None, description="Exact/partial register number"),
    name: Optional[str] = Query(None, description="Exact/partial student name"),
    department_id: Optional[int] = Query(None, description="Filter by department ID"),
    course_id: Optional[int] = Query(None, description="Filter by course ID"),
    year: Optional[str] = Query(None, description="Filter by year (e.g. I, II, III, IV)"),
    semester: Optional[int] = Query(None, description="Filter by semester (1-8)"),
    section: Optional[str] = Query(None, description="Filter by section (A, B, C)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """
    Search and filter student directory with case-insensitive search,
    optimized summary cards, and pagination.
    """
    service = StudentService(db)
    params = StudentSearchParams(
        query=query,
        register_number=register_number,
        name=name,
        department_id=department_id,
        course_id=course_id,
        year=year,
        semester=semester,
        section=section,
    )
    skip = (page - 1) * page_size
    items, total = service.search(params, skip=skip, limit=page_size)

    total_pages = (total + page_size - 1) // page_size if total > 0 else 1
    page_info = PageInfo(
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        has_prev=page > 1,
    )

    return ApiResponse(
        success=True,
        message=f"Found {total} students",
        data=PaginatedResponse(items=items, pagination=page_info),
    )


@router.get("/{student_id}", response_model=ApiResponse[StudentDetailResponse])
def get_student_detail(student_id: int, db: Session = Depends(get_db)):
    """
    Retrieve comprehensive Student 360 dossier with all linked portfolios:
    guardians, academic background, semester records, attendance,
    achievements, skills, certificates, projects, links, and faculty remarks.
    """
    service = StudentService(db)
    detail = service.get_detail(student_id)
    return ApiResponse(
        success=True,
        message="Student dossier retrieved successfully",
        data=detail,
    )


@router.post("", response_model=ApiResponse[StudentResponse], status_code=status.HTTP_201_CREATED)
def create_student(data: StudentCreate, db: Session = Depends(get_db)):
    """Create a new student record."""
    service = StudentService(db)
    created = service.create(data)
    return ApiResponse(
        success=True,
        message="Student registered successfully",
        data=StudentResponse.model_validate(created),
    )


@router.patch("/{student_id}", response_model=ApiResponse[StudentResponse])
def update_student(student_id: int, data: StudentUpdate, db: Session = Depends(get_db)):
    """Update student profile details partially (PATCH)."""
    service = StudentService(db)
    updated = service.update(student_id, data)
    return ApiResponse(
        success=True,
        message="Student updated successfully",
        data=StudentResponse.model_validate(updated),
    )


@router.delete("/{student_id}", response_model=ApiResponse[DeleteResponse])
def delete_student(student_id: int, db: Session = Depends(get_db)):
    """Delete student record."""
    service = StudentService(db)
    service.delete(student_id)
    return ApiResponse(
        success=True,
        message="Student deleted successfully",
        data=DeleteResponse(id=student_id, deleted=True),
    )