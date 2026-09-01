from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException, ConflictException, ForbiddenException
from app.core.constants import (
    AuditAction,
    AuditActorType,
    UserRole,
    AccountStatus,
    ClassroomStatus,
    ProfileCompletionStatus,
    FacultyClassroomRole,
)
from app.models.classroom import (
    Classroom,
    ClassroomMembership,
    FacultyClassroomAssignment,
)
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.user import User
from app.repositories.audit_repository import AuditRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.classroom import (
    ClassroomCreate,
    ClassroomUpdate,
    ClassroomResponse,
    ClassroomDetailResponse,
)
from app.schemas.student import StudentSummary, StudentQuickCreate
from app.security.password import hash_password
from app.utils.validators import validate_register_number
from app.utils.helpers import calculate_attendance_percentage, calculate_cgpa


class ClassroomService:
    def __init__(self, db: Session):
        self.db = db
        self.audit = AuditRepository(db)

    def create_classroom(self, data: ClassroomCreate, creator_faculty: Faculty) -> ClassroomResponse:
        class_code = data.class_code
        if not class_code:
            dept_prefix = f"DEPT{data.department_id}" if data.department_id else "CLS"
            class_code = f"{dept_prefix}-{data.year}{data.section}-{data.academic_year.replace('-', '')}"

        existing = self.db.query(Classroom).filter(Classroom.class_code == class_code).first()
        if existing:
            raise ConflictException(f"Classroom with code '{class_code}' already exists", "DUPLICATE_CLASSROOM_CODE")

        advisor_id = data.advisor_faculty_id or creator_faculty.id
        tutor_id = data.tutor_faculty_id

        classroom = Classroom(
            class_name=data.class_name,
            class_code=class_code,
            department_id=data.department_id or creator_faculty.department_id,
            academic_year=data.academic_year,
            year=data.year,
            semester=data.semester,
            section=data.section,
            created_by=creator_faculty.id,
            advisor_faculty_id=advisor_id,
            tutor_faculty_id=tutor_id,
            is_active=data.is_active,
        )
        self.db.add(classroom)
        self.db.flush()

        # Link Faculty Assignment
        assignment = FacultyClassroomAssignment(
            faculty_id=advisor_id,
            classroom_id=classroom.id,
            assignment_type=FacultyClassroomRole.ADVISOR.value,
            active=True,
        )
        self.db.add(assignment)

        if tutor_id and tutor_id != advisor_id:
            tutor_assign = FacultyClassroomAssignment(
                faculty_id=tutor_id,
                classroom_id=classroom.id,
                assignment_type=FacultyClassroomRole.TUTOR.value,
                active=True,
            )
            self.db.add(tutor_assign)

        self.audit.log(
            action=AuditAction.CREATE.value,
            actor_type=AuditActorType.FACULTY.value,
            actor_id=creator_faculty.faculty_id,
            entity_type="Classroom",
            entity_id=str(classroom.id),
            new_data={"class_name": classroom.class_name, "class_code": classroom.class_code},
        )
        self.db.commit()
        self.db.refresh(classroom)

        return self._to_response(classroom)

    def get_my_classroom(self, faculty: Faculty) -> Optional[ClassroomDetailResponse]:
        # Look for classroom where faculty is advisor, tutor, or assigned
        classroom = self.db.query(Classroom).filter(
            (Classroom.advisor_faculty_id == faculty.id) |
            (Classroom.tutor_faculty_id == faculty.id)
        ).first()

        if not classroom:
            assign = self.db.query(FacultyClassroomAssignment).filter(
                FacultyClassroomAssignment.faculty_id == faculty.id,
                FacultyClassroomAssignment.active == True,
            ).first()
            if assign:
                classroom = self.db.query(Classroom).filter(Classroom.id == assign.classroom_id).first()

        if not classroom:
            return None

        return self.get_classroom_detail(classroom.id)

    def get_classroom_by_id(self, classroom_id: int) -> Classroom:
        classroom = self.db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not classroom:
            raise NotFoundException(f"Classroom #{classroom_id} not found", "CLASSROOM_NOT_FOUND")
        return classroom

    def get_classroom_detail(self, classroom_id: int) -> ClassroomDetailResponse:
        classroom = self.get_classroom_by_id(classroom_id)
        students = self.get_classroom_students(classroom_id)

        resp = self._to_response(classroom)
        return ClassroomDetailResponse(
            **resp.model_dump(),
            students=students,
        )

    def get_classroom_students(self, classroom_id: int) -> List[StudentSummary]:
        memberships = self.db.query(ClassroomMembership).filter(
            ClassroomMembership.classroom_id == classroom_id,
            ClassroomMembership.status == ClassroomStatus.ACTIVE.value,
        ).all()

        summaries = []
        for m in memberships:
            s = m.student
            if not s:
                continue
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
        return summaries

    def list_department_classrooms(self, department_id: int) -> List[ClassroomResponse]:
        classrooms = self.db.query(Classroom).filter(
            Classroom.department_id == department_id,
            Classroom.is_active == True,
        ).all()
        return [self._to_response(c) for c in classrooms]

    def create_and_attach_student(
        self,
        classroom_id: int,
        data: StudentQuickCreate,
        faculty: Faculty,
    ) -> Student:
        classroom = self.get_classroom_by_id(classroom_id)
        reg_no = validate_register_number(data.register_number)

        student_repo = StudentRepository(self.db)
        if student_repo.get_by_register_number(reg_no):
            raise ConflictException(f"Student with register number '{reg_no}' already exists", "DUPLICATE_REGISTER_NUMBER")

        name_parts = data.name.strip().split(" ", 1)
        first_name = name_parts[0]
        last_name = name_parts[1] if len(name_parts) > 1 else name_parts[0]
        email = f"{reg_no.lower()}@college.edu"

        # 1. Transactionally provision User account
        user = self.db.query(User).filter(User.username == reg_no).first()
        if not user:
            user = User(
                email=email,
                username=reg_no,
                password_hash=hash_password(data.password),
                role=UserRole.STUDENT.value,
                is_active=True,
                is_verified=True,
                status=AccountStatus.ACTIVE.value,
            )
            self.db.add(user)
            self.db.flush()

        # 2. Create Student Profile in INCOMPLETE status
        student = Student(
            user_id=user.id,
            register_number=reg_no,
            first_name=first_name,
            last_name=last_name,
            full_name=data.name.strip(),
            email=email,
            department_id=classroom.department_id,
            year=classroom.year,
            semester=classroom.semester,
            section=classroom.section,
            profile_status=ProfileCompletionStatus.INCOMPLETE.value,
            is_locked=False,
            active=True,
        )
        self.db.add(student)
        self.db.flush()

        # 3. Create Classroom Membership
        membership = ClassroomMembership(
            classroom_id=classroom.id,
            student_id=student.id,
            status=ClassroomStatus.ACTIVE.value,
        )
        self.db.add(membership)

        self.audit.log(
            action=AuditAction.CREATE.value,
            actor_type=AuditActorType.FACULTY.value,
            actor_id=faculty.faculty_id,
            entity_type="Student",
            entity_id=str(student.id),
            new_data={
                "register_number": student.register_number,
                "name": student.full_name,
                "classroom_id": classroom.id,
                "created_by": faculty.faculty_id,
            },
        )
        self.db.commit()
        self.db.refresh(student)
        return student

    def _to_response(self, classroom: Classroom) -> ClassroomResponse:
        student_count = self.db.query(ClassroomMembership).filter(
            ClassroomMembership.classroom_id == classroom.id,
            ClassroomMembership.status == ClassroomStatus.ACTIVE.value,
        ).count()

        return ClassroomResponse(
            id=classroom.id,
            class_name=classroom.class_name,
            class_code=classroom.class_code,
            department_id=classroom.department_id,
            department_name=classroom.department.name if classroom.department else None,
            academic_year=classroom.academic_year,
            year=classroom.year,
            semester=classroom.semester,
            section=classroom.section,
            created_by=classroom.created_by,
            advisor_faculty_id=classroom.advisor_faculty_id,
            tutor_faculty_id=classroom.tutor_faculty_id,
            advisor_name=classroom.advisor.name if classroom.advisor else None,
            tutor_name=classroom.tutor.name if classroom.tutor else None,
            student_count=student_count,
            is_active=classroom.is_active,
            created_at=classroom.created_at,
            updated_at=classroom.updated_at,
        )
