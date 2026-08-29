from typing import Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    error_code: Optional[str] = None


class DeleteResponse(BaseModel):
    id: int
    deleted: bool = True
    message: str = "Resource deleted successfully"