from typing import List
from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.constants import UserRole, AccountStatus
from app.core.exceptions import UnauthorizedException, ForbiddenException, NotFoundException
from app.models.user import User
from app.models.student import Student
from app.models.faculty import Faculty
from app.repositories.user_repository import UserRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.faculty_repository import FacultyRepository
from app.security.jwt import decode_token

security = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Extract, decode, and validate the JWT Bearer token, returning the authenticated User."""
    if not credentials or not credentials.credentials:
        raise UnauthorizedException("Authentication token required", "AUTHENTICATION_REQUIRED")

    token = credentials.credentials
    payload = decode_token(token, expected_type="access")
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload", "INVALID_TOKEN")

    user_repo = UserRepository(db)
    user = user_repo.get_by_id(int(user_id))
    if not user:
        raise UnauthorizedException("User account not found", "USER_NOT_FOUND")

    if not user.is_active or user.status == AccountStatus.INACTIVE.value:
        raise UnauthorizedException("User account is inactive or suspended", "ACCOUNT_INACTIVE")

    return user


def require_role(allowed_roles: List[str]):
    """Enforce role-based access control (RBAC)."""
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise ForbiddenException(
                f"Access denied: Required role '{', '.join(allowed_roles)}', but user has '{current_user.role}'",
                "FORBIDDEN_ROLE",
            )
        return current_user

    return role_checker


def get_current_student(
    current_user: User = Depends(require_role([UserRole.STUDENT.value])),
    db: Session = Depends(get_db),
) -> Student:
    """Retrieve the Student profile linked to the authenticated user."""
    student_repo = StudentRepository(db)
    student = student_repo.get_by_user_id(current_user.id)
    if not student:
        raise NotFoundException("Student profile not found for this account", "STUDENT_PROFILE_NOT_FOUND")
    return student


def get_current_faculty(
    current_user: User = Depends(require_role([UserRole.FACULTY.value, UserRole.ADMIN.value])),
    db: Session = Depends(get_db),
) -> Faculty:
    """Retrieve the Faculty profile linked to the authenticated user."""
    faculty_repo = FacultyRepository(db)
    faculty = faculty_repo.get_by_user_id(current_user.id)
    if not faculty:
        raise NotFoundException("Faculty profile not found for this account", "FACULTY_PROFILE_NOT_FOUND")
    return faculty


def require_faculty_roles(allowed_faculty_roles: List[str]):
    """Enforce specific Faculty assigned roles (e.g. CLASS_ADVISOR, HOD, SUBJECT_FACULTY)."""
    def role_checker(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> Faculty:
        if current_user.role == UserRole.ADMIN.value:
            faculty_repo = FacultyRepository(db)
            faculty = faculty_repo.get_by_user_id(current_user.id)
            if faculty:
                return faculty
            # Dummy or generic faculty representation for admin
            raise ForbiddenException("Admin has no linked faculty record", "NO_FACULTY_RECORD")

        if current_user.role != UserRole.FACULTY.value:
            raise ForbiddenException("Access denied: Faculty account required", "FORBIDDEN_FACULTY_REQUIRED")

        faculty_repo = FacultyRepository(db)
        faculty = faculty_repo.get_by_user_id(current_user.id)
        if not faculty:
            raise NotFoundException("Faculty profile not found", "FACULTY_NOT_FOUND")

        if faculty.assigned_role not in allowed_faculty_roles:
            raise ForbiddenException(
                f"Access denied: Required role '{', '.join(allowed_faculty_roles)}', but faculty assigned role is '{faculty.assigned_role}'",
                "FORBIDDEN_FACULTY_ROLE",
            )
        return faculty

    return role_checker


def verify_student_access(
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> None:
    """Verify that a student can only view/modify their own profile, or that caller is Faculty/Admin."""
    if current_user.role == UserRole.STUDENT.value:
        student_repo = StudentRepository(db)
        student = student_repo.get_by_user_id(current_user.id)
        if not student or student.id != student_id:
            raise ForbiddenException("Access denied: You can only access your own student profile", "FORBIDDEN_STUDENT_ACCESS")