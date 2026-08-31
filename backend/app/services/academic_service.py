from typing import List, Optional
from sqlalchemy.orm import Session
from app.core.exceptions import NotFoundException
from app.models.academic import (
    StudentAcademicBackground,
    SemesterAcademicRecord,
    AcademicAssessment,
    StudentSubjectMarks,
)
from app.repositories.academic_repository import AcademicRepository
from app.repositories.student_repository import StudentRepository
from app.schemas.academic import (
    AcademicBackgroundCreate,
    SemesterAcademicRecordCreate,
    AcademicAssessmentCreate,
    StudentSubjectMarksCreate,
)
from app.utils.validators import validate_marks


class AcademicService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AcademicRepository(db)
        self.student_repo = StudentRepository(db)

    # 1. Academic Background
    def get_background(self, student_id: int) -> Optional[StudentAcademicBackground]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_background(student_id)

    def set_background(self, data: AcademicBackgroundCreate) -> StudentAcademicBackground:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        # Auto compute percentages if marks provided
        d = data.model_dump(exclude_unset=True)
        if d.get("total_marks_10th") and d.get("maximum_marks_10th"):
            validate_marks(d["total_marks_10th"], d["maximum_marks_10th"])
            if not d.get("percentage_10th"):
                d["percentage_10th"] = round((d["total_marks_10th"] / d["maximum_marks_10th"]) * 100.0, 2)

        if d.get("total_marks_12th") and d.get("maximum_marks_12th"):
            validate_marks(d["total_marks_12th"], d["maximum_marks_12th"])
            if not d.get("percentage_12th"):
                d["percentage_12th"] = round((d["total_marks_12th"] / d["maximum_marks_12th"]) * 100.0, 2)

        return self.repo.create_or_update_background(data.student_id, d)

    # 2. Semester Records
    def get_semester_records(self, student_id: int) -> List[SemesterAcademicRecord]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_semester_records(student_id)

    def add_semester_record(self, data: SemesterAcademicRecordCreate) -> SemesterAcademicRecord:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        existing = self.repo.get_semester_record(data.student_id, data.semester)
        if existing:
            for k, v in data.model_dump(exclude_unset=True).items():
                setattr(existing, k, v)
            return self.repo.save_semester_record(existing)

        rec = SemesterAcademicRecord(**data.model_dump())
        return self.repo.save_semester_record(rec)

    # 3. Assessments
    def get_assessments(self, student_id: int, semester: Optional[int] = None) -> List[AcademicAssessment]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_assessments(student_id, semester)

    def add_assessment(self, data: AcademicAssessmentCreate) -> AcademicAssessment:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        validate_marks(data.obtained_marks, data.maximum_marks)
        assessment = AcademicAssessment(**data.model_dump())
        return self.repo.save_assessment(assessment)

    # 4. Subject Marks
    def get_subject_marks(self, student_id: int, semester: Optional[int] = None) -> List[StudentSubjectMarks]:
        if not self.student_repo.get_by_id(student_id):
            raise NotFoundException(f"Student with ID {student_id} not found", "STUDENT_NOT_FOUND")
        return self.repo.get_subject_marks(student_id, semester)

    def record_subject_marks(self, data: StudentSubjectMarksCreate) -> StudentSubjectMarks:
        if not self.student_repo.get_by_id(data.student_id):
            raise NotFoundException(f"Student with ID {data.student_id} not found", "STUDENT_NOT_FOUND")

        total = (data.internal_marks or 0.0) + (data.semester_marks or 0.0)
        d = data.model_dump()
        d["total_marks"] = total

        # Grade attribution
        if not d.get("grade"):
            if total >= 90:
                d["grade"] = "O"
                d["grade_points"] = 10.0
            elif total >= 80:
                d["grade"] = "A+"
                d["grade_points"] = 9.0
            elif total >= 70:
                d["grade"] = "A"
                d["grade_points"] = 8.0
            elif total >= 60:
                d["grade"] = "B+"
                d["grade_points"] = 7.0
            elif total >= 50:
                d["grade"] = "B"
                d["grade_points"] = 6.0
            else:
                d["grade"] = "RA"
                d["grade_points"] = 0.0

        rec = StudentSubjectMarks(**d)
        return self.repo.save_subject_marks(rec)