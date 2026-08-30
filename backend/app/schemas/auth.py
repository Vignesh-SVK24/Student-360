from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class StudentLoginRequest(BaseModel):
    identifier: str = Field(..., description="Student Register Number or Registered Email")
    password: str = Field(..., min_length=1, description="Student portal login password")
    remember_me: bool = Field(default=False, description="Persist session for extended period")


class FacultyLoginRequest(BaseModel):
    identifier: str = Field(..., description="Faculty ID or Registered Email")
    password: str = Field(..., min_length=1, description="Faculty portal login password")
    remember_me: bool = Field(default=False, description="Persist session for extended period")


class FacultyRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=200)
    faculty_id: str = Field(..., min_length=2, max_length=50)
    email: EmailStr
    phone_number: Optional[str] = None
    department_id: Optional[int] = None
    designation: str = Field(default="Assistant Professor", max_length=100)
    password: str = Field(..., min_length=6, description="Strong password")
    confirm_password: str = Field(..., min_length=6)


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Valid refresh token")


class AuthUserPayload(BaseModel):
    id: int
    email: str
    username: Optional[str] = None
    role: str
    profile_id: Optional[int] = None
    identifier: Optional[str] = None  # register_number or faculty_id
    name: Optional[str] = None
    profile_photo_url: Optional[str] = None
    department_name: Optional[str] = None
    is_active: bool = True


class AuthTokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: AuthUserPayload


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)
    confirm_password: str = Field(..., min_length=6)


class StudentNameChangeRequest(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    middle_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    display_name: Optional[str] = Field(None, max_length=150)