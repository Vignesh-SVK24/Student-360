from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class CertificateBase(BaseModel):
    student_id: int
    title: str
    issuing_organization: str
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_file_url: Optional[str] = None
    thumbnail_url: Optional[str] = None


class CertificateCreate(CertificateBase):
    pass


class CertificateUpdate(BaseModel):
    title: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[date] = None
    expiry_date: Optional[date] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    certificate_file_url: Optional[str] = None
    thumbnail_url: Optional[str] = None


class CertificateResponse(CertificateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)