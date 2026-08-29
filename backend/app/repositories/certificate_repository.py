from typing import List
from sqlalchemy.orm import Session
from app.models.certificate import Certificate
from app.repositories.base import BaseRepository


class CertificateRepository(BaseRepository[Certificate]):
    def __init__(self, db: Session):
        super().__init__(Certificate, db)

    def get_by_student(self, student_id: int) -> List[Certificate]:
        return (
            self.db.query(Certificate)
            .filter(Certificate.student_id == student_id)
            .order_by(Certificate.issue_date.desc().nullslast())
            .all()
        )