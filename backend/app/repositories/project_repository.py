from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.project import Project, Technology
from app.repositories.base import BaseRepository


class ProjectRepository(BaseRepository[Project]):
    def __init__(self, db: Session):
        super().__init__(Project, db)

    def get_by_student(self, student_id: int) -> List[Project]:
        return (
            self.db.query(Project)
            .options(joinedload(Project.technologies))
            .filter(Project.student_id == student_id)
            .order_by(Project.start_date.desc().nullslast())
            .all()
        )

    def get_or_create_technology(self, name: str) -> Technology:
        cleaned = name.strip()
        tech = self.db.query(Technology).filter(Technology.name.ilike(cleaned)).first()
        if not tech:
            tech = Technology(name=cleaned)
            self.db.add(tech)
            self.db.commit()
            self.db.refresh(tech)
        return tech