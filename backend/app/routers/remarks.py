from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.remark import FacultyRemarkCreate, FacultyRemarkUpdate, FacultyRemarkResponse
from app.services.remark_service import RemarkService

router = APIRouter(tags=["Faculty Remarks"])


@router.get("/students/{student_id}/remarks", response_model=ApiResponse[List[FacultyRemarkResponse]])
def get_student_remarks(student_id: int, db: Session = Depends(get_db)):
    """Retrieve all faculty mentorship and academic evaluation remarks."""
    service = RemarkService(db)
    items = service.get_by_student(student_id)
    return ApiResponse(
        success=True,
        message="Faculty remarks retrieved",
        data=items,
    )


@router.post("/remarks", response_model=ApiResponse[FacultyRemarkResponse], status_code=status.HTTP_201_CREATED)
def create_remark(data: FacultyRemarkCreate, db: Session = Depends(get_db)):
    """
    Submit a formal faculty mentorship remark with grade
    (Poor, Average, Better, Good, Excellent).
    """
    service = RemarkService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Faculty remark added",
        data=saved,
    )


@router.patch("/remarks/{remark_id}", response_model=ApiResponse[FacultyRemarkResponse])
def update_remark(remark_id: int, data: FacultyRemarkUpdate, db: Session = Depends(get_db)):
    """Update an existing remark."""
    service = RemarkService(db)
    updated = service.update(remark_id, data)
    return ApiResponse(
        success=True,
        message="Faculty remark updated",
        data=updated,
    )


@router.delete("/remarks/{remark_id}", response_model=ApiResponse[DeleteResponse])
def delete_remark(remark_id: int, db: Session = Depends(get_db)):
    """Delete a faculty remark."""
    service = RemarkService(db)
    service.delete(remark_id)
    return ApiResponse(
        success=True,
        message="Faculty remark deleted",
        data=DeleteResponse(id=remark_id, deleted=True),
    )