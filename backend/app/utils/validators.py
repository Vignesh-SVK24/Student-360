import re
from datetime import date
from typing import Optional
from app.core.exceptions import ValidationException


def validate_register_number(reg_no: str) -> str:
    cleaned = reg_no.strip().upper()
    if not cleaned:
        raise ValidationException("Register number cannot be empty", "INVALID_REGISTER_NUMBER")
    if not re.match(r"^[A-Z0-9_-]{3,30}$", cleaned):
        raise ValidationException(
            "Register number must be 3-30 alphanumeric characters",
            "INVALID_REGISTER_NUMBER"
        )
    return cleaned


def validate_safe_url(url: Optional[str]) -> Optional[str]:
    if not url:
        return None
    cleaned = url.strip()
    if not cleaned:
        return None
    if not (cleaned.startswith("https://") or cleaned.startswith("http://")):
        raise ValidationException("URL must start with http:// or https://", "INVALID_URL")
    if len(cleaned) > 2048:
        raise ValidationException("URL exceeds maximum length of 2048 characters", "URL_TOO_LONG")
    return cleaned


def validate_date_range(start_date: Optional[date], end_date: Optional[date]) -> None:
    if start_date and end_date and end_date < start_date:
        raise ValidationException("End date cannot be earlier than start date", "INVALID_DATE_RANGE")


def validate_marks(obtained: float, maximum: float) -> None:
    if obtained < 0:
        raise ValidationException("Obtained marks cannot be negative", "INVALID_MARKS")
    if maximum <= 0:
        raise ValidationException("Maximum marks must be positive", "INVALID_MARKS")
    if obtained > maximum:
        raise ValidationException(
            f"Obtained marks ({obtained}) cannot exceed maximum marks ({maximum})",
            "MARKS_EXCEED_MAXIMUM"
        )


def validate_attendance_counts(present: int, absent: int, total: int) -> None:
    if total < 0 or present < 0 or absent < 0:
        raise ValidationException("Class counts cannot be negative", "INVALID_ATTENDANCE")
    if present > total:
        raise ValidationException("Present classes cannot exceed total classes", "INVALID_ATTENDANCE")
    if absent > total:
        raise ValidationException("Absent classes cannot exceed total classes", "INVALID_ATTENDANCE")
    if present + absent > total:
        raise ValidationException("Sum of present and absent classes cannot exceed total classes", "INVALID_ATTENDANCE")


def validate_password_confirmation(password: str, confirm_password: str, min_length: int = 6) -> None:
    """Validate that passwords match and meet the minimum length requirements."""
    if password != confirm_password:
        raise ValidationException("Passwords do not match", "PASSWORDS_DO_NOT_MATCH")
    if len(password) < min_length:
        raise ValidationException(f"Password must be at least {min_length} characters long", "WEAK_PASSWORD")