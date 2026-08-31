from typing import Generic, List, TypeVar
from pydantic import BaseModel, Field

T = TypeVar("T")


class PaginationParams(BaseModel):
    page: int = Field(default=1, ge=1, description="Page number starting at 1")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page (max 100)")

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size

    @property
    def limit(self) -> int:
        return self.page_size


class PageInfo(BaseModel):
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_prev: bool

    @classmethod
    def from_counts(cls, total: int, page: int, page_size: int) -> "PageInfo":
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        return cls(
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        )


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    pagination: PageInfo