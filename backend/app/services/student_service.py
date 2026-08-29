from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException, ConflictException
from app.core.constants import AuditAction, AuditActorType
from app.models.student import Student
from app.repositories.student_repository import StudentRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentSummary,
    StudentSearchParams,
)
from app.schemas.student_detail import StudentDetailResponse
from app.utils.validators import validate_register_number
from app.utils.helpers import calculate_attendance_percentage, calculate_cgpa


class StudentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = StudentRepository(db)
        self.audit = AuditRepository(db)

    def get_by_id(self, student_id: int) -> Student:
        student = self.repo.get_by_id(student_id)
        if not student:
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return student

    def get_detail(self, student_id: int) -> StudentDetailResponse:
        student = self.repo.get_detail_by_id(student_id)
        if not student:
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")

        # Calculate overall attendance
        total_p = sum(a.present_classes for a in student.attendance_records)
        total_c = sum(a.total_classes for a in student.attendance_records)
        attendance_pct = calculate_attendance_percentage(total_p, total_c)

        # Calculate CGPA
        sgpas = [r.sgpa for r in student.semester_records if r.sgpa is not None]
        computed_cgpa = calculate_cgpa(sgpas) if sgpas else 0.0

        res_dict = {
            "id": student.id,
            "register_number": student.register_number,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "full_name": student.full_name,
            "email": student.email,
            "phone_number": student.phone_number,
            "date_of_birth": student.date_of_birth,
            "gender": student.gender,
            "address": student.address,
            "profile_photo_url": student.profile_photo_url,
            "department_id": student.department_id,
            "department_name": student.department.name if student.department else None,
            "department_code": student.department.code if student.department else None,
            "course_id": student.course_id,
            "course_name": student.course.name if student.course else None,
            "course_code": student.course.code if student.course else None,
            "year": student.year,
            "semester": student.semester,
            "section": student.section,
            "student_type": student.student_type,
            "active": student.active,
            "attendance_percentage": attendance_pct,
            "cgpa": computed_cgpa,
            "guardians": student.guardians,
            "academic_background": student.academic_background,
            "semester_records": student.semester_records,
            "assessments": student.assessments,
            "subject_marks": [
                {
                    **m.__dict__,
                    "subject_code": m.subject.code if m.subject else None,
                    "subject_name": m.subject.name if m.subject else None,
                }
                for m in student.subject_marks
            ],
            "attendance_records": [
                {
                    **a.__dict__,
                    "subject_code": a.subject.code if a.subject else None,
                    "subject_name": a.subject.name if a.subject else None,
                }
                for a in student.attendance_records
            ],
            "achievements": student.achievements,
            "skills": student.skills,
            "certificates": student.certificates,
            "projects": [
                {
                    **p.__dict__,
                    "technologies": [t.name for t in p.technologies],
                }
                for p in student.projects
            ],
            "profile_links": student.profile_links,
            "remarks": [
                {
                    **r.__dict__,
                    "faculty_name": r.faculty.name if r.faculty else "Faculty Reviewer",
                    "faculty_designation": r.faculty.designation if r.faculty else "Academic Mentor",
                }
                for r in student.remarks
            ],
            "created_at": student.created_at,
            "updated_at": student.updated_at,
        }
        return StudentDetailResponse.model_validate(res_dict)

    def search(
        self,
        params: StudentSearchParams,
        skip: int = 0,
        limit: int = 20,
    ) -> Tuple[List[StudentSummary], int]:
        students, total = self.repo.search(params, skip=skip, limit=limit)
        summaries = []
        for s in students:
            total_p = sum(a.present_classes for a in s.attendance_records)
            total_c = sum(a.total_classes for a in s.attendance_records)
            att_pct = calculate_attendance_percentage(total_p, total_c)

            sgpas = [r.sgpa for r in s.semester_records if r.sgpa is not None]
            computed_cgpa = calculate_cgpa(sgpas) if sgpas else 0.0

            top_ach = s.achievements[0].title if s.achievements else None
            skills_list = [sk.name for sk in s.skills[:6]]

            summaries.append(
                StudentSummary(
                    id=s.id,
                    register_number=s.register_number,
                    full_name=s.full_name,
                    department_name=s.department.name if s.department else None,
                    course_name=s.course.name if s.course else None,
                    year=s.year,
                    semester=s.semester,
                    section=s.section,
                    student_type=s.student_type,
                    profile_photo_url=s.profile_photo_url,
                    attendance_percentage=att_pct,
                    cgpa=computed_cgpa,
                    top_achievement=top_ach,
                    skills=skills_list,
                )
            )
        return summaries, total

    def create(self, data: StudentCreate) -> Student:
        reg_no = validate_register_number(data.register_number)
        if self.repo.get_by_register_number(reg_no):
            raise ConflictException(f"Student with register number '{reg_no}' already exists", "DUPLICATE_REGISTER_NUMBER")
        if self.repo.get_by_email(str(data.email)):
            raise ConflictException(f"Student with email '{data.email}' already exists", "DUPLICATE_EMAIL")

        full_name = data.full_name or f"{data.first_name} {data.last_name}".strip()
        student_data = data.model_dump()
        student_data["register_number"] = reg_no
        student_data["full_name"] = full_name

        student = Student(**student_data)
        saved = self.repo.create(student)

        self.audit.log(
            action=AuditAction.CREATE.value,
            actor_type=AuditActorType.SYSTEM.value,
            actor_id="system",
            entity_type="Student",
            entity_id=str(saved.id),
            new_data={"register_number": saved.register_number, "full_name": saved.full_name},
        )
        return saved

    def update(self, student_id: int, data: StudentUpdate) -> Student:
        student = self.get_by_id(student_id)
        old_data = {"full_name": student.full_name, "email": student.email, "semester": student.semester}

        if data.email and data.email != student.email:
            existing = self.repo.get_by_email(str(data.email))
            if existing and existing.id != student_id:
                raise ConflictException(f"Email '{data.email}' is already in use", "DUPLICATE_EMAIL")

        update_dict = data.model_dump(exclude_unset=True)
        if "first_name" in update_dict or "last_name" in update_dict:
            fn = update_dict.get("first_name", student.first_name)
            ln = update_dict.get("last_name", student.last_name)
            update_dict["full_name"] = f"{fn} {ln}".strip()

        updated = self.repo.update(student, update_dict)

        self.audit.log(
            action=AuditAction.UPDATE.value,
            actor_type=AuditActorType.SYSTEM.value,
            actor_id="system",
            entity_type="Student",
            entity_id=str(student_id),
            old_data=old_data,
            new_data=update_dict,
        )
        return updated

    def delete(self, student_id: int) -> bool:
        student = self.get_by_id(student_id)
        self.repo.delete(student)

        self.audit.log(
            action=AuditAction.DELETE.value,
            actor_type=AuditActorType.SYSTEM.value,
            actor_id="system",
            entity_type="Student",
            entity_id=str(student_id),
            old_data={"register_number": student.register_number},
        )
        return True