from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.constants import FacultyRole, UserRole
from app.dependencies.auth import (
    get_current_student,
    get_current_faculty,
    require_faculty_roles,
    get_current_user,
)
from app.models.student import Student
from app.models.faculty import Faculty
from app.schemas.common import ApiResponse
from app.schemas.profile_request import (
    ProfileEditRequestCreate,
    ProfileEditRequestReview,
    ProfileEditRequestResponse,
    ApprovedFieldUpdate,
    StudentNameChangeRequestSubmit,
)
from app.schemas.student import StudentResponse
from app.services.profile_request_service import ProfileRequestService

router = APIRouter(tags=["Profile Requests"])


# Student endpoints
@router.post("/students/me/profile-edit-requests", response_model=ApiResponse[ProfileEditRequestResponse], status_code=status.HTTP_201_CREATED)
def submit_edit_request(
    data: ProfileEditRequestCreate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Submit a field-level profile edit request for Class Advisor review."""
    service = ProfileRequestService(db)
    result = service.create_request(current_student, data)
    return ApiResponse.success_response(
        data=result,
        message=f"Edit request for '{result.field_name}' submitted for Class Advisor approval",
        status_code=status.HTTP_201_CREATED,
    )


@router.post("/students/me/name-change-request", response_model=ApiResponse[ProfileEditRequestResponse], status_code=status.HTTP_201_CREATED)
def submit_name_change_request(
    data: StudentNameChangeRequestSubmit,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Submit a Name Change request for Class Advisor approval."""
    service = ProfileRequestService(db)
    result = service.create_name_change_request(current_student, data)
    return ApiResponse.success_response(
        data=result,
        message="Name change request submitted for Class Advisor approval",
        status_code=status.HTTP_201_CREATED,
    )


@router.get("/students/me/profile-edit-requests", response_model=ApiResponse[List[ProfileEditRequestResponse]])
def get_my_edit_requests(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Retrieve history of all profile edit requests submitted by authenticated student."""
    service = ProfileRequestService(db)
    results = service.get_student_requests(current_student)
    return ApiResponse.success_response(data=results, message="My edit requests retrieved")


@router.patch("/students/me/approved-field", response_model=ApiResponse[StudentResponse])
def apply_approved_field_edit(
    data: ApprovedFieldUpdate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Update an approved field, verify valid permission window, and automatically re-lock."""
    service = ProfileRequestService(db)
    updated = service.apply_approved_field_update(current_student, data)
    return ApiResponse.success_response(
        data=StudentResponse.model_validate(updated),
        message=f"Field '{data.field_name}' updated successfully and re-locked",
    )


@router.patch("/students/me/approved-profile", response_model=ApiResponse[StudentResponse])
def apply_approved_profile_edit(
    profile_data: dict,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Update all fields of student profile upon approved MY_PROFILE permission and automatically re-lock."""
    service = ProfileRequestService(db)
    updated = service.apply_approved_profile_update(current_student, profile_data)
    return ApiResponse.success_response(
        data=StudentResponse.model_validate(updated),
        message="Profile updated successfully and re-locked",
    )


@router.post("/students/me/complete-profile", response_model=ApiResponse[StudentResponse])
def complete_profile(
    profile_data: dict,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db),
):
    """Complete required profile information upon first login and transition to LOCKED."""
    service = ProfileRequestService(db)
    updated = service.complete_student_profile(current_student, profile_data)
    return ApiResponse.success_response(
        data=StudentResponse.model_validate(updated),
        message="Profile completed successfully and locked",
    )


# Faculty endpoints
@router.get("/classrooms/{classroom_id}/profile-edit-requests", response_model=ApiResponse[List[ProfileEditRequestResponse]])
def get_classroom_edit_requests(
    classroom_id: int,
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status (PENDING, APPROVED, REJECTED)"),
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """List pending and reviewed profile edit requests for a classroom (Advisor/Tutor/HOD)."""
    service = ProfileRequestService(db)
    results = service.get_classroom_requests(classroom_id, current_faculty, status=status_filter)
    return ApiResponse.success_response(data=results, message="Classroom edit requests retrieved")


@router.post("/profile-edit-requests/{request_id}/approve", response_model=ApiResponse[ProfileEditRequestResponse])
def approve_edit_request(
    request_id: int,
    review: Optional[ProfileEditRequestReview] = None,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Approve a student's profile edit request, granting a time-limited field-level edit permission."""
    service = ProfileRequestService(db)
    rev = review or ProfileEditRequestReview(action="APPROVE")
    rev.action = "APPROVE"
    result = service.review_request(request_id, rev, current_faculty)
    return ApiResponse.success_response(
        data=result,
        message=f"Edit request #{request_id} for '{result.field_name}' approved. Student granted edit access.",
    )


@router.post("/profile-edit-requests/{request_id}/reject", response_model=ApiResponse[ProfileEditRequestResponse])
def reject_edit_request(
    request_id: int,
    review: Optional[ProfileEditRequestReview] = None,
    current_faculty: Faculty = Depends(require_faculty_roles([
        FacultyRole.CLASS_ADVISOR.value,
        FacultyRole.CLASS_TUTOR.value,
        FacultyRole.HOD.value,
    ])),
    db: Session = Depends(get_db),
):
    """Reject a student's profile edit request."""
    service = ProfileRequestService(db)
    rev = review or ProfileEditRequestReview(action="REJECT")
    rev.action = "REJECT"
    result = service.review_request(request_id, rev, current_faculty)
    return ApiResponse.success_response(
        data=result,
        message=f"Edit request #{request_id} rejected",
    )
