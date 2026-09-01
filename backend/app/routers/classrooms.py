from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.constants import FacultyRole, UserRole
from app.dependencies.auth import get_current_faculty, require_faculty_roles, require_role, get_current_user
from app.models.faculty import Faculty
from app.models.user import User
from app.schemas.common import ApiResponse
from app.schemas.classroom import (
    ClassroomCreate,
    ClassroomUpdate,
    ClassroomResponse,
    ClassroomDetailResponse,
)
from app.schemas.student import StudentResponse, StudentQuickCreate
from app.services.classroom_service import ClassroomService

router = APIRouter(prefix="/classrooms", tags=["Classrooms"])


@router.post("", response_model=ApiResponse[ClassroomResponse], status_code=status.HTTP_201_CREATED)
def create_classroom(
    data: ClassroomCreate,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Create a new classroom (Class Advisor / Class Tutor / HOD only)."""
    service = ClassroomService(db)
    result = service.create_classroom(data, current_faculty)
    return ApiResponse.success_response(
        data=result,
        message=f"Classroom '{result.class_name}' created successfully",
        status_code=status.HTTP_201_CREATED,
    )


@router.get("/my", response_model=ApiResponse[Optional[ClassroomDetailResponse]])
def get_my_classroom(
    current_faculty: Faculty = Depends(get_current_faculty),
    db: Session = Depends(get_db),
):
    """Retrieve assigned classroom for the authenticated faculty member."""
    service = ClassroomService(db)
    result = service.get_my_classroom(current_faculty)
    return ApiResponse.success_response(
        data=result,
        message="Classroom retrieved successfully" if result else "No classroom assigned to this faculty",
    )


@router.get("/department/{department_id}", response_model=ApiResponse[List[ClassroomResponse]])
def list_department_classrooms(
    department_id: int,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.HOD.value,
        FacultyRole.ASSOCIATE_PROFESSOR.value,
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
    ])),
    db: Session = Depends(get_db),
):
    """List all classrooms within a department (HOD / Assoc Prof / Faculty)."""
    service = ClassroomService(db)
    result = service.list_department_classrooms(department_id)
    return ApiResponse.success_response(data=result, message="Department classrooms retrieved")


@router.get("/{classroom_id}", response_model=ApiResponse[ClassroomDetailResponse])
def get_classroom_detail(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get classroom details and full student list."""
    service = ClassroomService(db)
    result = service.get_classroom_detail(classroom_id)
    return ApiResponse.success_response(data=result, message="Classroom details retrieved")


@router.post("/{classroom_id}/students", response_model=ApiResponse[StudentResponse], status_code=status.HTTP_201_CREATED)
def create_student_in_classroom(
    classroom_id: int,
    data: StudentQuickCreate,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Create a student profile with initial credentials and attach to classroom."""
    service = ClassroomService(db)
    student = service.create_and_attach_student(classroom_id, data, current_faculty)
    return ApiResponse.success_response(
        data=StudentResponse.model_validate(student),
        message=f"Student '{student.full_name}' created and attached to classroom",
        status_code=status.HTTP_201_CREATED,
    )
