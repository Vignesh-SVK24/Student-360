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
            "profile_status": student.profile_status or "COMPLETED",
            "is_locked": student.is_locked if student.is_locked is not None else True,
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
                    profile_status=s.profile_status or "COMPLETED",
                    is_locked=s.is_locked if s.is_locked is not None else True,
                    profile_photo_url=s.profile_photo_url,
                    attendance_percentage=att_pct,
                    cgpa=computed_cgpa,
                    top_achievement=top_ach,
                    skills=skills_list,
                )
            )
        return summaries, total

    def create(self, data: StudentCreate, actor_id: str = "system", actor_type: str = AuditActorType.SYSTEM.value) -> Student:
        reg_no = validate_register_number(data.register_number)
        if self.repo.get_by_register_number(reg_no):
            raise ConflictException(f"Student with register number '{reg_no}' already exists", "DUPLICATE_REGISTER_NUMBER")
        if self.repo.get_by_email(str(data.email)):
            raise ConflictException(f"Student with email '{data.email}' already exists", "DUPLICATE_EMAIL")

        full_name = data.full_name or f"{data.first_name} {data.last_name}".strip()
        student_data = data.model_dump()
        student_data["register_number"] = reg_no
        student_data["full_name"] = full_name

        # Extract nested child payloads
        from app.core.config import settings
        from app.models.user import User
        from app.models.guardian import Guardian
        from app.models.academic import StudentAcademicBackground
        from app.repositories.user_repository import UserRepository
        from app.security.password import hash_password
        from app.core.constants import UserRole, AccountStatus

        initial_pw = student_data.pop("initial_password", None) or settings.DEFAULT_STUDENT_INITIAL_PASSWORD
        p_name = student_data.pop("parent_name", None)
        p_rel = student_data.pop("parent_relationship", "Father")
        p_phone = student_data.pop("parent_phone", None)
        p_email = student_data.pop("parent_email", None)
        p_occ = student_data.pop("parent_occupation", None)

        s_10th = student_data.pop("school_10th", None)
        b_10th = student_data.pop("board_10th", None)
        tm_10th = student_data.pop("total_marks_10th", None)
        mm_10th = student_data.pop("maximum_marks_10th", None)
        pct_10th = student_data.pop("percentage_10th", None)
        yr_10th = student_data.pop("year_of_passing_10th", None)

        s_12th = student_data.pop("school_12th", None)
        b_12th = student_data.pop("board_12th", None)
        tm_12th = student_data.pop("total_marks_12th", None)
        mm_12th = student_data.pop("maximum_marks_12th", None)
        pct_12th = student_data.pop("percentage_12th", None)
        yr_12th = student_data.pop("year_of_passing_12th", None)

        try:
            # 1. Transactionally provision or link User account
            user_repo = UserRepository(self.db)
            existing_user = user_repo.get_by_email(str(data.email))
            if existing_user:
                user_id = existing_user.id
            else:
                user = User(
                    email=str(data.email).strip().lower(),
                    username=reg_no,
                    password_hash=hash_password(initial_pw),
                    role=UserRole.STUDENT.value,
                    is_active=True,
                    is_verified=True,
                    status=AccountStatus.ACTIVE.value,
                )
                self.db.add(user)
                self.db.flush()
                user_id = user.id

            student_data["user_id"] = user_id
            student = Student(**student_data)
            self.db.add(student)
            self.db.flush()

            # 2. Add Parent / Guardian if provided
            if p_name:
                guardian = Guardian(
                    student_id=student.id,
                    parent_name=p_name.strip(),
                    relationship=p_rel or "Father",
                    phone_number=p_phone or "+91 90000 00000",
                    email=p_email,
                    occupation=p_occ,
                    is_primary_contact=True,
                )
                self.db.add(guardian)

            # 3. Add Academic Background if provided
            if s_10th or s_12th:
                if tm_10th and mm_10th and mm_10th > 0 and not pct_10th:
                    pct_10th = round((tm_10th / mm_10th) * 100, 2)
                if tm_12th and mm_12th and mm_12th > 0 and not pct_12th:
                    pct_12th = round((tm_12th / mm_12th) * 100, 2)
                bg = StudentAcademicBackground(
                    student_id=student.id,
                    school_10th=s_10th,
                    board_10th=b_10th,
                    total_marks_10th=tm_10th,
                    maximum_marks_10th=mm_10th,
                    percentage_10th=pct_10th,
                    year_of_passing_10th=yr_10th,
                    school_12th=s_12th,
                    board_12th=b_12th,
                    total_marks_12th=tm_12th,
                    maximum_marks_12th=mm_12th,
                    percentage_12th=pct_12th,
                    year_of_passing_12th=yr_12th,
                )
                self.db.add(bg)

            self.db.commit()
            self.db.refresh(student)

            self.audit.log(
                action=AuditAction.CREATE.value,
                actor_type=actor_type,
                actor_id=actor_id,
                entity_type="Student",
                entity_id=str(student.id),
                new_data={"register_number": student.register_number, "full_name": student.full_name, "email": student.email},
            )
            return student
        except Exception:
            self.db.rollback()
            raise

    def update_name(
        self,
        student_id: int,
        first_name: Optional[str] = None,
        middle_name: Optional[str] = None,
        last_name: Optional[str] = None,
        display_name: Optional[str] = None,
        actor_id: str = "system",
        actor_type: str = AuditActorType.STUDENT.value,
    ) -> Student:
        student = self.get_by_id(student_id)
        old_data = {
            "first_name": student.first_name,
            "middle_name": student.middle_name,
            "last_name": student.last_name,
            "display_name": student.display_name,
            "full_name": student.full_name,
        }

        if first_name and first_name.strip():
            student.first_name = first_name.strip()
        if middle_name is not None:
            student.middle_name = middle_name.strip() if middle_name.strip() else None
        if last_name and last_name.strip():
            student.last_name = last_name.strip()

        name_parts = [n for n in [student.first_name, student.middle_name, student.last_name] if n]
        student.full_name = " ".join(name_parts)

        if display_name is not None:
            student.display_name = display_name.strip() if display_name.strip() else None

        self.db.commit()
        self.db.refresh(student)

        self.audit.log(
            action="NAME_CHANGED",
            actor_type=actor_type,
            actor_id=actor_id,
            entity_type="Student",
            entity_id=str(student.id),
            old_data=old_data,
            new_data={
                "first_name": student.first_name,
                "middle_name": student.middle_name,
                "last_name": student.last_name,
                "display_name": student.display_name,
                "full_name": student.full_name,
            },
        )
        return student

    def update(self, student_id: int, data: StudentUpdate) -> Student:
        student = self.get_by_id(student_id)
        old_data = {
            "register_number": student.register_number,
            "full_name": student.full_name,
            "email": student.email,
            "semester": student.semester,
        }

        update_dict = data.model_dump(exclude_unset=True)

        if data.register_number and data.register_number.strip():
            new_reg = validate_register_number(data.register_number)
            if new_reg != student.register_number:
                existing_reg = self.repo.get_by_register_number(new_reg)
                if existing_reg and existing_reg.id != student_id:
                    raise ConflictException(f"Register number '{new_reg}' is already in use by another student", "DUPLICATE_REGISTER_NUMBER")
                update_dict["register_number"] = new_reg

        if data.email and data.email != student.email:
            existing = self.repo.get_by_email(str(data.email))
            if existing and existing.id != student_id:
                raise ConflictException(f"Email '{data.email}' is already in use", "DUPLICATE_EMAIL")

        if "full_name" in update_dict and update_dict["full_name"]:
            cleaned_full = update_dict["full_name"].strip()
            parts = cleaned_full.split(" ", 1)
            update_dict["first_name"] = parts[0]
            update_dict["last_name"] = parts[1] if len(parts) > 1 else ""
            update_dict["full_name"] = cleaned_full
        elif "first_name" in update_dict or "last_name" in update_dict:
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