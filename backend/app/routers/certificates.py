from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse, DeleteResponse
from app.schemas.certificate import CertificateCreate, CertificateUpdate, CertificateResponse
from app.services.certificate_service import CertificateService

router = APIRouter(tags=["Certificates"])


@router.get("/students/{student_id}/certificates", response_model=ApiResponse[List[CertificateResponse]])
def get_student_certificates(student_id: int, db: Session = Depends(get_db)):
    """Retrieve professional and technical certificates."""
    service = CertificateService(db)
    items = service.get_by_student(student_id)
    return ApiResponse(
        success=True,
        message="Certificates retrieved",
        data=[CertificateResponse.model_validate(i) for i in items],
    )


@router.post("/certificates", response_model=ApiResponse[CertificateResponse], status_code=status.HTTP_201_CREATED)
def create_certificate(data: CertificateCreate, db: Session = Depends(get_db)):
    """Add a professional certificate with credential verification URL."""
    service = CertificateService(db)
    saved = service.create(data)
    return ApiResponse(
        success=True,
        message="Certificate registered",
        data=CertificateResponse.model_validate(saved),
    )


@router.patch("/certificates/{certificate_id}", response_model=ApiResponse[CertificateResponse])
def update_certificate(certificate_id: int, data: CertificateUpdate, db: Session = Depends(get_db)):
    """Update certificate details."""
    service = CertificateService(db)
    updated = service.update(certificate_id, data)
    return ApiResponse(
        success=True,
        message="Certificate updated",
        data=CertificateResponse.model_validate(updated),
    )


@router.delete("/certificates/{certificate_id}", response_model=ApiResponse[DeleteResponse])
def delete_certificate(certificate_id: int, db: Session = Depends(get_db)):
    """Delete a certificate entry."""
    service = CertificateService(db)
    service.delete(certificate_id)
    return ApiResponse(
        success=True,
        message="Certificate deleted",
        data=DeleteResponse(id=certificate_id, deleted=True),
    )