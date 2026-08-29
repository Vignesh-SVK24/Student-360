from typing import List
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.project import Project
from app.repositories.project_repository import ProjectRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.utils.validators import validate_date_range, validate_safe_url


class ProjectService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ProjectRepository(db)
        self.student_repo = StudentRepository(db)

    def get_by_student(self, student_id: int) -> List[ProjectResponse]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        projects = self.repo.get_by_student(student_id)
        return [
            ProjectResponse(
                id=p.id,
                student_id=p.student_id,
                title=p.title,
                short_description=p.short_description,
                detailed_description=p.detailed_description,
                student_role=p.student_role,
                start_date=p.start_date,
                end_date=p.end_date,
                github_url=p.github_url,
                live_demo_url=p.live_demo_url,
                project_image_url=p.project_image_url,
                technologies=[t.name for t in p.technologies],
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
            for p in projects
        ]

    def create(self, data: ProjectCreate) -> ProjectResponse:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        validate_date_range(data.start_date, data.end_date)
        tech_entities = [self.repo.get_or_create_technology(t) for t in data.technologies]

        proj = Project(
            student_id=data.student_id,
            title=data.title,
            short_description=data.short_description,
            detailed_description=data.detailed_description,
            student_role=data.student_role,
            start_date=data.start_date,
            end_date=data.end_date,
            github_url=validate_safe_url(data.github_url),
            live_demo_url=validate_safe_url(data.live_demo_url),
            project_image_url=validate_safe_url(data.project_image_url),
            technologies=tech_entities,
        )
        saved = self.repo.create(proj)
        return ProjectResponse(
            id=saved.id,
            student_id=saved.student_id,
            title=saved.title,
            short_description=saved.short_description,
            detailed_description=saved.detailed_description,
            student_role=saved.student_role,
            start_date=saved.start_date,
            end_date=saved.end_date,
            github_url=saved.github_url,
            live_demo_url=saved.live_demo_url,
            project_image_url=saved.project_image_url,
            technologies=[t.name for t in saved.technologies],
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )

    def update(self, project_id: int, data: ProjectUpdate) -> ProjectResponse:
        proj = self.repo.get_by_id(project_id)
        if not proj:
            raise NotFoundException(f"Project with ID {project_id} not found", "PROJECT_NOT_FOUND")

        start_d = data.start_date or proj.start_date
        end_d = data.end_date or proj.end_date
        validate_date_range(start_d, end_d)

        d = data.model_dump(exclude_unset=True)
        if "github_url" in d:
            d["github_url"] = validate_safe_url(d["github_url"])
        if "live_demo_url" in d:
            d["live_demo_url"] = validate_safe_url(d["live_demo_url"])
        if "project_image_url" in d:
            d["project_image_url"] = validate_safe_url(d["project_image_url"])

        if "technologies" in d and d["technologies"] is not None:
            proj.technologies = [self.repo.get_or_create_technology(t) for t in d["technologies"]]
            d.pop("technologies")

        saved = self.repo.update(proj, d)
        return ProjectResponse(
            id=saved.id,
            student_id=saved.student_id,
            title=saved.title,
            short_description=saved.short_description,
            detailed_description=saved.detailed_description,
            student_role=saved.student_role,
            start_date=saved.start_date,
            end_date=saved.end_date,
            github_url=saved.github_url,
            live_demo_url=saved.live_demo_url,
            project_image_url=saved.project_image_url,
            technologies=[t.name for t in saved.technologies],
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        )

    def delete(self, project_id: int) -> bool:
        proj = self.repo.get_by_id(project_id)
        if not proj:
            raise NotFoundException(f"Project with ID {project_id} not found", "PROJECT_NOT_FOUND")
        return self.repo.delete(proj)