from typing import Optional
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
    StudentAccessResponse,
    StudentAccessUpdateRequest,
)
from app.schemas.student_detail import StudentDetailResponse
from app.services.student_service import StudentService
from app.models.user import User
from app.models.student import Student
from app.security.password import hash_password
from app.core.exceptions import NotFoundException
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

    page_info = PageInfo.from_counts(total=total, page=page, page_size=page_size)

    return ApiResponse(
        success=True,
        message=f"Found {total} students",
        data=PaginatedResponse(items=items, pagination=page_info),
    )


from app.models.user import User
from app.models.student import Student
from app.core.constants import UserRole
from app.dependencies.auth import get_current_student, require_role
from app.schemas.auth import StudentNameChangeRequest


@router.get("/me", response_model=ApiResponse[StudentDetailResponse])
def get_my_student_profile(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Retrieve comprehensive Student 360 dossier for the authenticated student."""
    service = StudentService(db)
    detail = service.get_detail(current_student.id)
    return ApiResponse.success_response(
        data=detail,
        message="Authenticated student dossier retrieved successfully",
    )


@router.patch("/me/name", response_model=ApiResponse[StudentResponse])
def update_my_name(
    payload: StudentNameChangeRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Controlled, auditable name update for the authenticated student."""
    service = StudentService(db)
    updated = service.update_name(
        student_id=current_student.id,
        first_name=payload.first_name,
        middle_name=payload.middle_name,
        last_name=payload.last_name,
        display_name=payload.display_name,
        actor_id=str(current_student.register_number),
        actor_type=UserRole.STUDENT.value,
    )
    return ApiResponse.success_response(
        data=StudentResponse.model_validate(updated),
        message="Student name updated successfully",
    )


@router.get("/{student_id}", response_model=ApiResponse[StudentDetailResponse])
def get_student_detail(
    student_id: int,
    db: Session = Depends(get_db),
):
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
def create_student(
    data: StudentCreate,
    current_user: User = Depends(require_role([UserRole.FACULTY.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db),
):
    """Create a new student profile and provision their User account transactionally (Faculty/Admin only)."""
    service = StudentService(db)
    created = service.create(
        data,
        actor_id=str(current_user.email),
        actor_type=current_user.role,
    )
    return ApiResponse.success_response(
        data=StudentResponse.model_validate(created),
        message="Student registered and user account provisioned successfully",
        status_code=status.HTTP_201_CREATED,
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


@router.get("/{student_id}/access", response_model=ApiResponse[StudentAccessResponse])
def get_student_access(student_id: int, db: Session = Depends(get_db)):
    """Retrieve user login credentials status for a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise NotFoundException(f"Student #{student_id} not found", "STUDENT_NOT_FOUND")

    user = None
    if student.user_id:
        user = db.query(User).filter(User.id == student.user_id).first()
    if not user:
        user = db.query(User).filter(User.register_number == student.register_number).first()

    if user:
        data = StudentAccessResponse(
            student_id=student.id,
            user_id=user.id,
            has_account=True,
            username=user.username or user.register_number,
            email=user.email,
            is_active=user.is_active,
            status=user.status or ("ACTIVE" if user.is_active else "INACTIVE"),
            last_login_at=user.last_login_at,
        )
    else:
        data = StudentAccessResponse(
            student_id=student.id,
            user_id=None,
            has_account=False,
            username=student.register_number,
            email=student.email,
            is_active=False,
            status="PENDING_PROVISION",
            last_login_at=None,
        )
    return ApiResponse.success_response(data=data, message="Student access status retrieved")


@router.post("/{student_id}/access", response_model=ApiResponse[StudentAccessResponse])
def update_student_access(
    student_id: int,
    payload: StudentAccessUpdateRequest,
    db: Session = Depends(get_db),
):
    """Grant, toggle, or reset login portal access for a student."""
    student = db.query(Student).filter(Student.id == student_id).first()
    if not student:
        raise NotFoundException(f"Student #{student_id} not found", "STUDENT_NOT_FOUND")

    user = None
    if student.user_id:
        user = db.query(User).filter(User.id == student.user_id).first()
    if not user:
        user = db.query(User).filter(User.register_number == student.register_number).first()

    if not user:
        raw_pass = payload.new_password if payload.new_password else "Student@360"
        user = User(
            email=student.email or f"{student.register_number.lower()}@college.edu",
            username=student.register_number,
            register_number=student.register_number,
            hashed_password=hash_password(raw_pass),
            role="STUDENT",
            is_active=payload.is_active if payload.is_active is not None else True,
            status="ACTIVE" if (payload.is_active if payload.is_active is not None else True) else "INACTIVE",
        )
        db.add(user)
        db.flush()
        student.user_id = user.id
    else:
        if payload.is_active is not None:
            user.is_active = payload.is_active
            user.status = "ACTIVE" if payload.is_active else "INACTIVE"
        if payload.new_password:
            user.hashed_password = hash_password(payload.new_password)

    db.commit()
    db.refresh(user)

    data = StudentAccessResponse(
        student_id=student.id,
        user_id=user.id,
        has_account=True,
        username=user.username or user.register_number,
        email=user.email,
        is_active=user.is_active,
        status=user.status or ("ACTIVE" if user.is_active else "INACTIVE"),
        last_login_at=user.last_login_at,
    )
    return ApiResponse.success_response(data=data, message="Student portal access updated successfully")