from typing import Any, Optional


class AppException(Exception):
    def __init__(
        self,
        message: str,
        error_code: str = "APP_ERROR",
        status_code: int = 400,
        details: Optional[Any] = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details
        super().__init__(self.message)


class NotFoundException(AppException):
    def __init__(self, message: str, error_code: str = "NOT_FOUND", details: Optional[Any] = None):
        super().__init__(message=message, error_code=error_code, status_code=404, details=details)


class ConflictException(AppException):
    def __init__(self, message: str, error_code: str = "CONFLICT", details: Optional[Any] = None):
        super().__init__(message=message, error_code=error_code, status_code=409, details=details)


class BadRequestException(AppException):
    def __init__(self, message: str, error_code: str = "BAD_REQUEST", details: Optional[Any] = None):
        super().__init__(message=message, error_code=error_code, status_code=400, details=details)


class ValidationException(AppException):
    def __init__(self, message: str, error_code: str = "VALIDATION_ERROR", details: Optional[Any] = None):
        super().__init__(message=message, error_code=error_code, status_code=422, details=details)


class UnauthorizedException(AppException):
    def __init__(self, message: str = "Authentication required", error_code: str = "UNAUTHORIZED"):
        super().__init__(message=message, error_code=error_code, status_code=401)


class ForbiddenException(AppException):
    def __init__(self, message: str = "Permission denied", error_code: str = "FORBIDDEN"):
        super().__init__(message=message, error_code=error_code, status_code=403)