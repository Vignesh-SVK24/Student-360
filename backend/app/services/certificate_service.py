from typing import List
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.certificate import Certificate
from app.repositories.certificate_repository import CertificateRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.certificate import CertificateCreate, CertificateUpdate
from app.utils.validators import validate_date_range, validate_safe_url


class CertificateService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = CertificateRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int) -> List[Certificate]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_by_student(student_id)

    def create(self, data: CertificateCreate) -> Certificate:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        validate_date_range(data.issue_date, data.expiry_date)
        d = data.model_dump()
        d["credential_url"] = validate_safe_url(data.credential_url)
        d["certificate_file_url"] = validate_safe_url(data.certificate_file_url)
        d["thumbnail_url"] = validate_safe_url(data.thumbnail_url)

        cert = Certificate(**d)
        return self.repo.create(cert)

    def update(self, cert_id: int, data: CertificateUpdate) -> Certificate:
        cert = self.repo.get_by_id(cert_id)
        if not cert:
            raise NotFoundException(f"Certificate with ID {cert_id} not found", "CERTIFICATE_NOT_FOUND")

        issue_d = data.issue_date or cert.issue_date
        expiry_d = data.expiry_date or cert.expiry_date
        validate_date_range(issue_d, expiry_d)

        d = data.model_dump(exclude_unset=True)
        if "credential_url" in d:
            d["credential_url"] = validate_safe_url(d["credential_url"])
        if "certificate_file_url" in d:
            d["certificate_file_url"] = validate_safe_url(d["certificate_file_url"])
        if "thumbnail_url" in d:
            d["thumbnail_url"] = validate_safe_url(d["thumbnail_url"])

        return self.repo.update(cert, d)

    def delete(self, cert_id: int) -> bool:
        cert = self.repo.get_by_id(cert_id)
        if not cert:
            raise NotFoundException(f"Certificate with ID {cert_id} not found", "CERTIFICATE_NOT_FOUND")
        return self.repo.delete(cert)