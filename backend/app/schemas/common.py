from typing import Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    error_code: Optional[str] = None

    @classmethod
    def success_response(cls, data: Optional[T] = None, message: str = "Operation successful", status_code: int = 200) -> "ApiResponse[T]":
        return cls(success=True, message=message, data=data, error_code=None)


class DeleteResponse(BaseModel):
    id: int
    deleted: bool = True
    message: str = "Resource deleted successfully"