from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.common import ApiResponse
from app.models.user import User
from app.dependencies.auth import get_current_user
from app.services.auth_service import AuthService
from app.schemas.auth import (
    StudentLoginRequest,
    FacultyLoginRequest,
    FacultyRegisterRequest,
    RefreshTokenRequest,
    AuthUserPayload,
    AuthTokenResponse,
    ChangePasswordRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)

router = APIRouter(prefix="/auth", tags=["Authentication & Accounts"])


@router.post("/student/login", response_model=ApiResponse[AuthTokenResponse])
def student_login(payload: StudentLoginRequest, db: Session = Depends(get_db)):
    """Authenticate student using Register Number or Email + Password."""
    service = AuthService(db)
    result = service.login_student(payload)
    return ApiResponse.success_response(data=result, message="Student authenticated successfully")


@router.post("/faculty/login", response_model=ApiResponse[AuthTokenResponse])
def faculty_login(payload: FacultyLoginRequest, db: Session = Depends(get_db)):
    """Authenticate faculty using Faculty ID or Email + Password."""
    service = AuthService(db)
    result = service.login_faculty(payload)
    return ApiResponse.success_response(data=result, message="Faculty authenticated successfully")


@router.post("/faculty/register", response_model=ApiResponse[AuthTokenResponse], status_code=status.HTTP_201_CREATED)
def faculty_register(payload: FacultyRegisterRequest, db: Session = Depends(get_db)):
    """Register a new faculty account and profile."""
    service = AuthService(db)
    result = service.register_faculty(payload)
    return ApiResponse.success_response(
        data=result,
        message="Faculty account created successfully",
        status_code=status.HTTP_201_CREATED,
    )


@router.post("/refresh", response_model=ApiResponse[AuthTokenResponse])
def refresh_token(payload: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using a valid refresh token."""
    service = AuthService(db)
    result = service.refresh_access_token(payload)
    return ApiResponse.success_response(data=result, message="Access token renewed successfully")


@router.get("/me", response_model=ApiResponse[AuthUserPayload])
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retrieve safe profile identity for currently authenticated user."""
    service = AuthService(db)
    result = service._build_user_payload(current_user)
    return ApiResponse.success_response(data=result, message="Current user profile retrieved")


@router.post("/logout", response_model=ApiResponse[dict])
def logout(current_user: User = Depends(get_current_user)):
    """Invalidate current session and logout."""
    return ApiResponse.success_response(data={"logged_out": True}, message="Successfully logged out")


@router.post("/change-password", response_model=ApiResponse[dict])
def change_password(
    payload: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password for the authenticated user."""
    service = AuthService(db)
    service.change_password(current_user, payload)
    return ApiResponse.success_response(data={"updated": True}, message="Password updated successfully")


@router.post("/forgot-password", response_model=ApiResponse[dict])
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Generate a single-use password reset token."""
    service = AuthService(db)
    result = service.forgot_password(payload)
    return ApiResponse.success_response(data=result, message="Password reset request processed")


@router.post("/reset-password", response_model=ApiResponse[dict])
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using a valid reset token."""
    service = AuthService(db)
    service.reset_password(payload)
    return ApiResponse.success_response(data={"reset": True}, message="Password has been reset successfully")