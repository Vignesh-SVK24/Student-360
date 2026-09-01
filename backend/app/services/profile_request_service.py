from datetime import datetime, timedelta
from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException, ConflictException, ForbiddenException, BadRequestException
from app.core.constants import (
    AuditAction,
    AuditActorType,
    EditRequestStatus,
    ProfileCompletionStatus,
    ClassroomStatus,
)
from app.models.profile_request import (
    ProfileEditRequest,
    StudentEditPermission,
)
from app.models.classroom import Classroom, ClassroomMembership
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.guardian import Guardian
from app.models.academic import StudentAcademicBackground
from app.repositories.audit_repository import AuditRepository
from app.schemas.profile_request import (
    ProfileEditRequestCreate,
    ProfileEditRequestReview,
    ProfileEditRequestResponse,
    StudentEditPermissionResponse,
    ApprovedFieldUpdate,
    StudentNameChangeRequestSubmit,
)


class ProfileRequestService:
    def __init__(self, db: Session):
        self.db = db
        self.audit = AuditRepository(db)

    def create_request(
        self,
        student: Student,
        data: ProfileEditRequestCreate,
    ) -> ProfileEditRequestResponse:
        # Find active classroom for this student
        membership = self.db.query(ClassroomMembership).filter(
            ClassroomMembership.student_id == student.id,
            ClassroomMembership.status == ClassroomStatus.ACTIVE.value,
        ).first()
        classroom_id = membership.classroom_id if membership else None

        # Check if there is already a pending request for the same field
        existing_pending = self.db.query(ProfileEditRequest).filter(
            ProfileEditRequest.student_id == student.id,
            ProfileEditRequest.field_name == data.field_name,
            ProfileEditRequest.status == EditRequestStatus.PENDING.value,
        ).first()
        if existing_pending:
            raise ConflictException(
                f"You already have a pending edit request for field '{data.field_name}'",
                "PENDING_REQUEST_EXISTS",
            )

        current_val = data.current_value
        if not current_val and hasattr(student, data.field_name):
            current_val = str(getattr(student, data.field_name) or "")

        req = ProfileEditRequest(
            student_id=student.id,
            classroom_id=classroom_id,
            section_name=data.section_name,
            field_name=data.field_name,
            current_value=current_val,
            requested_value=data.requested_value,
            reason=data.reason,
            status=EditRequestStatus.PENDING.value,
            requested_at=datetime.utcnow(),
        )
        self.db.add(req)
        self.db.flush()

        self.audit.log(
            action=AuditAction.CREATE.value,
            actor_type=AuditActorType.STUDENT.value,
            actor_id=student.register_number,
            entity_type="ProfileEditRequest",
            entity_id=str(req.id),
            new_data={
                "field_name": req.field_name,
                "requested_value": req.requested_value,
                "reason": req.reason,
            },
        )
        self.db.commit()
        self.db.refresh(req)
        return self._to_response(req)

    def create_name_change_request(
        self,
        student: Student,
        data: StudentNameChangeRequestSubmit,
    ) -> ProfileEditRequestResponse:
        req_data = ProfileEditRequestCreate(
            section_name="Name",
            field_name="full_name",
            current_value=student.full_name,
            requested_value=data.requested_name.strip(),
            reason=data.reason,
        )
        return self.create_request(student, req_data)

    def get_student_requests(self, student: Student) -> List[ProfileEditRequestResponse]:
        requests = self.db.query(ProfileEditRequest).filter(
            ProfileEditRequest.student_id == student.id,
        ).order_by(ProfileEditRequest.requested_at.desc()).all()
        return [self._to_response(r) for r in requests]

    def get_classroom_requests(
        self,
        classroom_id: int,
        faculty: Faculty,
        status: Optional[str] = None,
    ) -> List[ProfileEditRequestResponse]:
        # Validate that faculty is advisor, tutor, or HOD for this classroom
        classroom = self.db.query(Classroom).filter(Classroom.id == classroom_id).first()
        if not classroom:
            raise NotFoundException(f"Classroom #{classroom_id} not found", "CLASSROOM_NOT_FOUND")

        is_mgr = (
            classroom.advisor_faculty_id == faculty.id or
            classroom.tutor_faculty_id == faculty.id or
            classroom.created_by == faculty.id or
            (faculty.assigned_role == "HOD" and classroom.department_id == faculty.department_id)
        )
        if not is_mgr:
            raise ForbiddenException("Access denied: You are not an assigned manager for this classroom", "FORBIDDEN_CLASSROOM_MANAGER")

        query = self.db.query(ProfileEditRequest).filter(ProfileEditRequest.classroom_id == classroom_id)
        if status:
            query = query.filter(ProfileEditRequest.status == status)

        requests = query.order_by(ProfileEditRequest.requested_at.desc()).all()
        return [self._to_response(r) for r in requests]

    def review_request(
        self,
        request_id: int,
        review: ProfileEditRequestReview,
        faculty: Faculty,
    ) -> ProfileEditRequestResponse:
        req = self.db.query(ProfileEditRequest).filter(ProfileEditRequest.id == request_id).first()
        if not req:
            raise NotFoundException(f"Edit request #{request_id} not found", "REQUEST_NOT_FOUND")

        if req.status != EditRequestStatus.PENDING.value:
            raise BadRequestException(f"Request is already in '{req.status}' state", "REQUEST_ALREADY_REVIEWED")

        # Verify advisor/tutor permission on request's classroom
        if req.classroom_id:
            classroom = self.db.query(Classroom).filter(Classroom.id == req.classroom_id).first()
            if classroom:
                is_mgr = (
                    classroom.advisor_faculty_id == faculty.id or
                    classroom.tutor_faculty_id == faculty.id or
                    classroom.created_by == faculty.id or
                    (faculty.assigned_role == "HOD" and classroom.department_id == faculty.department_id)
                )
                if not is_mgr:
                    raise ForbiddenException("You cannot review requests for an unassigned classroom", "FORBIDDEN_CLASSROOM")

        now = datetime.utcnow()
        req.reviewed_by_faculty_id = faculty.id
        req.reviewed_at = now
        req.advisor_comment = review.advisor_comment

        if review.action.upper() == "APPROVE":
            req.status = EditRequestStatus.APPROVED.value
            expires_at = now + timedelta(hours=review.permission_duration_hours or 24)

            # Create or update StudentEditPermission
            perm = StudentEditPermission(
                student_id=req.student_id,
                request_id=req.id,
                field_name=req.field_name,
                granted_at=now,
                expires_at=expires_at,
                status="ACTIVE",
            )
            self.db.add(perm)

            self.audit.log(
                action=AuditAction.UPDATE.value,
                actor_type=AuditActorType.FACULTY.value,
                actor_id=faculty.faculty_id,
                entity_type="ProfileEditRequest",
                entity_id=str(req.id),
                new_data={"status": "APPROVED", "field": req.field_name, "expires_at": str(expires_at)},
            )
        else:
            req.status = EditRequestStatus.REJECTED.value
            self.audit.log(
                action=AuditAction.UPDATE.value,
                actor_type=AuditActorType.FACULTY.value,
                actor_id=faculty.faculty_id,
                entity_type="ProfileEditRequest",
                entity_id=str(req.id),
                new_data={"status": "REJECTED", "comment": req.advisor_comment},
            )

        self.db.commit()
        self.db.refresh(req)
        return self._to_response(req)

    def apply_approved_field_update(
        self,
        student: Student,
        data: ApprovedFieldUpdate,
    ) -> Student:
        now = datetime.utcnow()
        # Find active permission for this field or entire profile
        perm = self.db.query(StudentEditPermission).filter(
            StudentEditPermission.student_id == student.id,
            StudentEditPermission.status == "ACTIVE",
            StudentEditPermission.expires_at > now,
        ).filter(
            (StudentEditPermission.field_name == data.field_name) |
            (StudentEditPermission.field_name.in_(["MY_PROFILE", "ALL"]))
        ).first()

        if not perm and student.is_locked:
            raise ForbiddenException(
                f"Field '{data.field_name}' is locked. No active approved edit permission found.",
                "FIELD_LOCKED_PERMISSION_REQUIRED",
            )

        # Apply update
        old_val = getattr(student, data.field_name, None)
        if data.field_name == "full_name":
            student.full_name = data.new_value.strip()
            name_parts = data.new_value.strip().split(" ", 1)
            student.first_name = name_parts[0]
            student.last_name = name_parts[1] if len(name_parts) > 1 else name_parts[0]
        elif hasattr(student, data.field_name):
            setattr(student, data.field_name, data.new_value)
        else:
            # Handle nested parent/guardian or academic fields if applicable
            if data.field_name.startswith("parent_"):
                g = student.guardians[0] if student.guardians else None
                if not g:
                    g = Guardian(student_id=student.id, relationship="Parent")
                    self.db.add(g)
                attr = data.field_name.replace("parent_", "")
                if hasattr(g, attr):
                    setattr(g, attr, data.new_value)

        # Mark permission as USED and re-lock
        perm.status = "USED"
        req = self.db.query(ProfileEditRequest).filter(ProfileEditRequest.id == perm.request_id).first()
        if req:
            req.status = EditRequestStatus.USED.value

        student.profile_status = ProfileCompletionStatus.LOCKED.value
        student.is_locked = True

        self.audit.log(
            action=AuditAction.UPDATE.value,
            actor_type=AuditActorType.STUDENT.value,
            actor_id=student.register_number,
            entity_type="Student",
            entity_id=str(student.id),
            new_data={"field": data.field_name, "old_val": str(old_val), "new_val": data.new_value, "relocked": True},
        )
        self.db.commit()
        self.db.refresh(student)
        return student

    def apply_approved_profile_update(
        self,
        student: Student,
        profile_data: dict,
    ) -> Student:
        """Update entire student profile when active permission for MY_PROFILE / ALL exists, then re-lock."""
        now = datetime.utcnow()
        perm = self.db.query(StudentEditPermission).filter(
            StudentEditPermission.student_id == student.id,
            StudentEditPermission.status == "ACTIVE",
            StudentEditPermission.expires_at > now,
        ).filter(
            StudentEditPermission.field_name.in_(["MY_PROFILE", "ALL"])
        ).first()

        if not perm and student.is_locked:
            raise ForbiddenException(
                "Profile is locked. No active approved permission found to edit 'MY PROFILE'.",
                "PROFILE_LOCKED_PERMISSION_REQUIRED",
            )

        # Personal details
        if profile_data.get("first_name"):
            student.first_name = profile_data["first_name"].strip()
        if profile_data.get("last_name"):
            student.last_name = profile_data["last_name"].strip()
        if profile_data.get("name") or profile_data.get("full_name"):
            full = (profile_data.get("full_name") or profile_data.get("name") or "").strip()
            student.full_name = full
            parts = full.split(" ", 1)
            student.first_name = parts[0]
            student.last_name = parts[1] if len(parts) > 1 else parts[0]

        if profile_data.get("email"):
            student.email = profile_data["email"].strip()
        if profile_data.get("phone") or profile_data.get("phone_number"):
            student.phone_number = (profile_data.get("phone_number") or profile_data.get("phone") or "").strip()
        if profile_data.get("address"):
            student.address = profile_data["address"].strip()
        if profile_data.get("gender"):
            student.gender = profile_data["gender"]
        if profile_data.get("residenceType") or profile_data.get("student_type"):
            student.student_type = profile_data.get("student_type") or profile_data.get("residenceType")
        if profile_data.get("dob") or profile_data.get("date_of_birth"):
            val = profile_data.get("date_of_birth") or profile_data.get("dob")
            try:
                from datetime import datetime as dt
                if isinstance(val, str):
                    student.date_of_birth = dt.strptime(val, "%Y-%m-%d").date()
                else:
                    student.date_of_birth = val
            except Exception:
                pass

        # Parent details
        p_name = profile_data.get("parentName") or profile_data.get("parent_name")
        if p_name:
            guardian = student.guardians[0] if student.guardians else None
            if not guardian:
                from app.models.guardian import Guardian
                guardian = Guardian(
                    student_id=student.id,
                    parent_name=p_name.strip(),
                    relationship=profile_data.get("parentRelationship") or profile_data.get("parent_relationship") or "Father",
                    phone_number=profile_data.get("parentContact") or profile_data.get("parent_phone") or "N/A",
                    email=profile_data.get("parentEmail") or profile_data.get("parent_email"),
                    occupation=profile_data.get("parentOccupation") or profile_data.get("parent_occupation"),
                )
                self.db.add(guardian)
            else:
                guardian.parent_name = p_name.strip()
                if profile_data.get("parentRelationship") or profile_data.get("parent_relationship"):
                    guardian.relationship = profile_data.get("parentRelationship") or profile_data.get("parent_relationship")
                if profile_data.get("parentContact") or profile_data.get("parent_phone"):
                    guardian.phone_number = (profile_data.get("parentContact") or profile_data.get("parent_phone") or "").strip()
                if profile_data.get("parentEmail") or profile_data.get("parent_email"):
                    guardian.email = (profile_data.get("parentEmail") or profile_data.get("parent_email") or "").strip()
                if profile_data.get("parentOccupation") or profile_data.get("parent_occupation"):
                    guardian.occupation = profile_data.get("parentOccupation") or profile_data.get("parent_occupation")

        # Profile Links
        from app.models.profile_link import ProfileLink
        links = {
            "GitHub": profile_data.get("github"),
            "LinkedIn": profile_data.get("linkedin"),
            "Portfolio": profile_data.get("portfolio"),
        }
        for platform, url in links.items():
            if url:
                existing_link = self.db.query(ProfileLink).filter(
                    ProfileLink.student_id == student.id,
                    ProfileLink.platform == platform
                ).first()
                if existing_link:
                    existing_link.url = url.strip()
                else:
                    self.db.add(ProfileLink(student_id=student.id, platform=platform, url=url.strip(), is_public=True))

        # Mark permission as USED and re-lock
        if perm:
            perm.status = "USED"
            req = self.db.query(ProfileEditRequest).filter(ProfileEditRequest.id == perm.request_id).first()
            if req:
                req.status = EditRequestStatus.USED.value

        student.profile_status = ProfileCompletionStatus.LOCKED.value
        student.is_locked = True

        self.audit.log(
            action=AuditAction.UPDATE.value,
            actor_type=AuditActorType.STUDENT.value,
            actor_id=student.register_number,
            entity_type="Student",
            entity_id=str(student.id),
            new_data={"action": "full_profile_update", "relocked": True},
        )
        self.db.commit()
        self.db.refresh(student)
        return student


    def complete_student_profile(
        self,
        student: Student,
        profile_data: dict,
    ) -> Student:
        """Student completes profile during first login wizard, transitioning to LOCKED."""
        if profile_data.get("phone_number"):
            student.phone_number = profile_data["phone_number"]
        if profile_data.get("date_of_birth"):
            student.date_of_birth = profile_data["date_of_birth"]
        if profile_data.get("gender"):
            student.gender = profile_data["gender"]
        if profile_data.get("address"):
            student.address = profile_data["address"]
        if profile_data.get("student_type"):
            student.student_type = profile_data["student_type"]

        # Parent info
        p_name = profile_data.get("parent_name")
        if p_name:
            guardian = student.guardians[0] if student.guardians else None
            if not guardian:
                guardian = Guardian(student_id=student.id, parent_name=p_name, phone_number=profile_data.get("parent_phone") or "N/A")
                self.db.add(guardian)
            else:
                guardian.parent_name = p_name
                guardian.relationship = profile_data.get("parent_relationship", "Father")
                guardian.phone_number = profile_data.get("parent_phone") or guardian.phone_number or "N/A"
                guardian.email = profile_data.get("parent_email")
                guardian.occupation = profile_data.get("parent_occupation")

        # Academic background
        s_10th = profile_data.get("school_10th")
        if s_10th:
            bg = student.academic_background
            if not bg:
                bg = StudentAcademicBackground(student_id=student.id)
                self.db.add(bg)
            bg.school_10th = s_10th
            bg.percentage_10th = profile_data.get("percentage_10th")
            bg.school_12th = profile_data.get("school_12th")
            bg.percentage_12th = profile_data.get("percentage_12th")

        student.profile_status = ProfileCompletionStatus.LOCKED.value
        student.is_locked = True

        self.audit.log(
            action=AuditAction.UPDATE.value,
            actor_type=AuditActorType.STUDENT.value,
            actor_id=student.register_number,
            entity_type="Student",
            entity_id=str(student.id),
            new_data={"profile_status": "LOCKED", "is_locked": True},
        )
        self.db.commit()
        self.db.refresh(student)
        return student

    def _to_response(self, req: ProfileEditRequest) -> ProfileEditRequestResponse:
        perm_resp = None
        if req.permission:
            perm_resp = StudentEditPermissionResponse(
                id=req.permission.id,
                student_id=req.permission.student_id,
                request_id=req.permission.request_id,
                field_name=req.permission.field_name,
                granted_at=req.permission.granted_at,
                expires_at=req.permission.expires_at,
                status=req.permission.status,
            )

        return ProfileEditRequestResponse(
            id=req.id,
            student_id=req.student_id,
            student_name=req.student.full_name if req.student else None,
            student_register_number=req.student.register_number if req.student else None,
            student_photo_url=req.student.profile_photo_url if req.student else None,
            classroom_id=req.classroom_id,
            section_name=req.section_name,
            field_name=req.field_name,
            current_value=req.current_value,
            requested_value=req.requested_value,
            reason=req.reason,
            status=req.status,
            requested_at=req.requested_at,
            reviewed_by_faculty_id=req.reviewed_by_faculty_id,
            reviewed_by_name=req.reviewed_by.name if req.reviewed_by else None,
            reviewed_at=req.reviewed_at,
            advisor_comment=req.advisor_comment,
            permission=perm_resp,
        )
