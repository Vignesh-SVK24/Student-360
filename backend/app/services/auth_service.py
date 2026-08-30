from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.constants import UserRole, AccountStatus, AuditAction, AuditActorType
from app.core.exceptions import (
    UnauthorizedException,
    ConflictException,
    ValidationException,
    NotFoundException,
)
from app.models.user import User
from app.models.faculty import Faculty
from app.repositories.user_repository import UserRepository
from app.repositories.student_repository import StudentRepository
from app.repositories.faculty_repository import FacultyRepository
from app.repositories.audit_repository import AuditRepository
from app.security.password import hash_password, verify_password
from app.security.jwt import (
    create_access_token,
    create_refresh_token,
    decode_token,
    create_password_reset_token,
)
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


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.student_repo = StudentRepository(db)
        self.faculty_repo = FacultyRepository(db)
        self.audit = AuditRepository(db)

    def _build_user_payload(self, user: User) -> AuthUserPayload:
        profile_id = None
        identifier = None
        name = None
        photo_url = None
        dept_name = None

        if user.role == UserRole.STUDENT.value:
            student = self.student_repo.get_by_user_id(user.id)
            if student:
                profile_id = student.id
                identifier = student.register_number
                name = student.display_name or student.full_name
                photo_url = student.profile_photo_url
                if student.department:
                    dept_name = student.department.name
        elif user.role in [UserRole.FACULTY.value, UserRole.ADMIN.value]:
            faculty = self.faculty_repo.get_by_user_id(user.id)
            if faculty:
                profile_id = faculty.id
                identifier = faculty.faculty_id
                name = faculty.name
                photo_url = faculty.profile_photo_url
                if faculty.department:
                    dept_name = faculty.department.name

        return AuthUserPayload(
            id=user.id,
            email=user.email,
            username=user.username,
            role=user.role,
            profile_id=profile_id,
            identifier=identifier,
            name=name,
            profile_photo_url=photo_url,
            department_name=dept_name,
            is_active=user.is_active,
        )

    def login_student(self, payload: StudentLoginRequest) -> AuthTokenResponse:
        cleaned = payload.identifier.strip()
        # 1. Search student by register number or email
        student = self.student_repo.get_by_register_number(cleaned) or self.student_repo.get_by_email(cleaned)

        if not student:
            # Fallback: check if a user exists with this email
            user = self.user_repo.get_by_email(cleaned)
            if user and user.role == UserRole.STUDENT.value:
                student = self.student_repo.get_by_user_id(user.id)

        if not student or not student.user_id:
            raise UnauthorizedException("Invalid credentials or student account not registered", "INVALID_CREDENTIALS")

        user = self.user_repo.get_by_id(student.user_id)
        if not user or user.role != UserRole.STUDENT.value:
            raise UnauthorizedException("Invalid credentials for Student portal", "INVALID_CREDENTIALS")

        if not user.is_active or user.status != AccountStatus.ACTIVE.value:
            raise UnauthorizedException("Student account is inactive. Please contact administration.", "ACCOUNT_INACTIVE")

        if not verify_password(payload.password, user.password_hash):
            self.audit.log(
                action="LOGIN_FAILED",
                actor_type=AuditActorType.STUDENT.value,
                actor_id=str(student.register_number),
                entity_type="User",
                entity_id=str(user.id),
                new_data={"reason": "Incorrect password"},
            )
            raise UnauthorizedException("Invalid register number/email or password", "INVALID_CREDENTIALS")

        # Update last login
        self.user_repo.update_last_login(user)

        # Audit log
        self.audit.log(
            action="LOGIN_SUCCESS",
            actor_type=AuditActorType.STUDENT.value,
            actor_id=str(student.register_number),
            entity_type="User",
            entity_id=str(user.id),
        )

        user_payload = self._build_user_payload(user)
        token_data = {"sub": str(user.id), "role": user.role, "email": user.email}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data, remember_me=payload.remember_me)

        return AuthTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_payload,
        )

    def login_faculty(self, payload: FacultyLoginRequest) -> AuthTokenResponse:
        cleaned = payload.identifier.strip()
        faculty = self.faculty_repo.get_by_faculty_id(cleaned) or self.faculty_repo.get_by_email(cleaned)

        if not faculty:
            user = self.user_repo.get_by_email(cleaned)
            if user and user.role in [UserRole.FACULTY.value, UserRole.ADMIN.value]:
                faculty = self.faculty_repo.get_by_user_id(user.id)

        if not faculty or not faculty.user_id:
            raise UnauthorizedException("Invalid credentials or faculty account not found", "INVALID_CREDENTIALS")

        user = self.user_repo.get_by_id(faculty.user_id)
        if not user or user.role not in [UserRole.FACULTY.value, UserRole.ADMIN.value]:
            raise UnauthorizedException("Invalid credentials for Faculty portal", "INVALID_CREDENTIALS")

        if not user.is_active or user.status != AccountStatus.ACTIVE.value:
            raise UnauthorizedException("Faculty account is inactive. Please contact administration.", "ACCOUNT_INACTIVE")

        if not verify_password(payload.password, user.password_hash):
            self.audit.log(
                action="LOGIN_FAILED",
                actor_type=AuditActorType.FACULTY.value,
                actor_id=str(faculty.faculty_id),
                entity_type="User",
                entity_id=str(user.id),
                new_data={"reason": "Incorrect password"},
            )
            raise UnauthorizedException("Invalid faculty ID/email or password", "INVALID_CREDENTIALS")

        self.user_repo.update_last_login(user)

        self.audit.log(
            action="LOGIN_SUCCESS",
            actor_type=AuditActorType.FACULTY.value,
            actor_id=str(faculty.faculty_id),
            entity_type="User",
            entity_id=str(user.id),
        )

        user_payload = self._build_user_payload(user)
        token_data = {"sub": str(user.id), "role": user.role, "email": user.email}
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data, remember_me=payload.remember_me)

        return AuthTokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_payload,
        )

    def register_faculty(self, payload: FacultyRegisterRequest) -> AuthTokenResponse:
        if payload.password != payload.confirm_password:
            raise ValidationException("Passwords do not match", "PASSWORDS_DO_NOT_MATCH")

        if len(payload.password) < 6:
            raise ValidationException("Password must be at least 6 characters long", "WEAK_PASSWORD")

        # Check existing email
        if self.user_repo.get_by_email(payload.email) or self.faculty_repo.get_by_email(payload.email):
            raise ConflictException(f"Email '{payload.email}' is already registered", "DUPLICATE_EMAIL")

        # Check existing faculty_id
        if self.faculty_repo.get_by_faculty_id(payload.faculty_id):
            raise ConflictException(f"Faculty ID '{payload.faculty_id}' is already registered", "DUPLICATE_FACULTY_ID")

        try:
            # 1. Create User account
            user = User(
                email=payload.email.strip().lower(),
                username=payload.faculty_id.strip().upper(),
                password_hash=hash_password(payload.password),
                role=UserRole.FACULTY.value,
                is_active=True,
                is_verified=True,
                status=AccountStatus.ACTIVE.value,
            )
            self.db.add(user)
            self.db.flush()

            # 2. Create Faculty profile
            faculty = Faculty(
                user_id=user.id,
                faculty_id=payload.faculty_id.strip().upper(),
                name=payload.name.strip(),
                email=payload.email.strip().lower(),
                phone_number=payload.phone_number.strip() if payload.phone_number else None,
                department_id=payload.department_id,
                designation=payload.designation.strip(),
                active=True,
            )
            self.db.add(faculty)
            self.db.commit()
            self.db.refresh(user)
            self.db.refresh(faculty)

            self.audit.log(
                action=AuditAction.CREATE.value,
                actor_type=AuditActorType.FACULTY.value,
                actor_id=str(faculty.faculty_id),
                entity_type="Faculty",
                entity_id=str(faculty.id),
                new_data={"email": faculty.email, "faculty_id": faculty.faculty_id},
            )

            user_payload = self._build_user_payload(user)
            token_data = {"sub": str(user.id), "role": user.role, "email": user.email}
            access_token = create_access_token(token_data)
            refresh_token = create_refresh_token(token_data, remember_me=False)

            return AuthTokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
                user=user_payload,
            )
        except Exception:
            self.db.rollback()
            raise

    def refresh_access_token(self, payload: RefreshTokenRequest) -> AuthTokenResponse:
        decoded = decode_token(payload.refresh_token, expected_type="refresh")
        user_id = decoded.get("sub")
        if not user_id:
            raise UnauthorizedException("Invalid refresh token", "INVALID_TOKEN")

        user = self.user_repo.get_by_id(int(user_id))
        if not user or not user.is_active:
            raise UnauthorizedException("User account inactive or not found", "USER_INACTIVE")

        remember_me = decoded.get("remember_me", False)
        user_payload = self._build_user_payload(user)
        token_data = {"sub": str(user.id), "role": user.role, "email": user.email}
        new_access = create_access_token(token_data)
        new_refresh = create_refresh_token(token_data, remember_me=remember_me)

        return AuthTokenResponse(
            access_token=new_access,
            refresh_token=new_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user=user_payload,
        )

    def change_password(self, user: User, payload: ChangePasswordRequest) -> bool:
        if not verify_password(payload.current_password, user.password_hash):
            raise ValidationException("Current password does not match", "INCORRECT_CURRENT_PASSWORD")

        if payload.new_password != payload.confirm_password:
            raise ValidationException("New passwords do not match", "PASSWORDS_DO_NOT_MATCH")

        if len(payload.new_password) < 6:
            raise ValidationException("New password must be at least 6 characters long", "WEAK_PASSWORD")

        user.password_hash = hash_password(payload.new_password)
        self.db.commit()

        self.audit.log(
            action="PASSWORD_CHANGED",
            actor_type=user.role,
            actor_id=str(user.id),
            entity_type="User",
            entity_id=str(user.id),
        )
        return True

    def forgot_password(self, payload: ForgotPasswordRequest) -> dict:
        user = self.user_repo.get_by_email(payload.email)
        # Always return generic success to avoid exposing registered email addresses
        if not user:
            return {"message": "If this email is registered, a password reset link has been generated."}

        reset_token = create_password_reset_token(user.email)
        expires_at = datetime.now(timezone.utc)
        self.user_repo.set_reset_token(user, reset_token, expires_at)

        return {
            "message": "If this email is registered, a password reset link has been generated.",
            "reset_token": reset_token,  # Provided in dev/testing environments
        }

    def reset_password(self, payload: ResetPasswordRequest) -> bool:
        if payload.new_password != payload.confirm_password:
            raise ValidationException("Passwords do not match", "PASSWORDS_DO_NOT_MATCH")

        if len(payload.new_password) < 6:
            raise ValidationException("New password must be at least 6 characters long", "WEAK_PASSWORD")

        decoded = decode_token(payload.token, expected_type="reset")
        email = decoded.get("sub")
        if not email:
            raise UnauthorizedException("Invalid reset token", "INVALID_TOKEN")

        user = self.user_repo.get_by_email(email)
        if not user or user.reset_token != payload.token:
            raise UnauthorizedException("Invalid or expired reset token", "INVALID_TOKEN")

        user.password_hash = hash_password(payload.new_password)
        self.user_repo.clear_reset_token(user)

        self.audit.log(
            action="PASSWORD_RESET",
            actor_type=user.role,
            actor_id=str(user.id),
            entity_type="User",
            entity_id=str(user.id),
        )
        return True