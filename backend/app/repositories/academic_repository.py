from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.academic import (
    StudentAcademicBackground,
    SemesterAcademicRecord,
    AcademicAssessment,
    StudentSubjectMarks,
)


class AcademicRepository:
    def __init__(self, db: Session):
        self.db = db

    # Background
    def get_background(self, student_id: int) -> Optional[StudentAcademicBackground]:
        return self.db.query(StudentAcademicBackground).filter(StudentAcademicBackground.student_id == student_id).first()

    def create_or_update_background(self, student_id: int, data: dict) -> StudentAcademicBackground:
        bg = self.get_background(student_id)
        payload = {**data, "student_id": student_id}
        if not bg:
            bg = StudentAcademicBackground(**payload)
            self.db.add(bg)
        else:
            for k, v in payload.items():
                if hasattr(bg, k) and v is not None:
                    setattr(bg, k, v)
        self.db.commit()
        self.db.refresh(bg)
        return bg

    # Semester Records
    def get_semester_records(self, student_id: int) -> List[SemesterAcademicRecord]:
        return (
            self.db.query(SemesterAcademicRecord)
            .filter(SemesterAcademicRecord.student_id == student_id)
            .order_by(SemesterAcademicRecord.semester.asc())
            .all()
        )

    def get_semester_record(self, student_id: int, semester: int) -> Optional[SemesterAcademicRecord]:
        return (
            self.db.query(SemesterAcademicRecord)
            .filter(SemesterAcademicRecord.student_id == student_id, SemesterAcademicRecord.semester == semester)
            .first()
        )

    def save_semester_record(self, record: SemesterAcademicRecord) -> SemesterAcademicRecord:
        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)
        return record

    # Assessments
    def get_assessments(self, student_id: int, semester: Optional[int] = None) -> List[AcademicAssessment]:
        q = self.db.query(AcademicAssessment).filter(AcademicAssessment.student_id == student_id)
        if semester:
            q = q.filter(AcademicAssessment.semester == semester)
        return q.order_by(AcademicAssessment.semester.asc(), AcademicAssessment.id.asc()).all()

    def save_assessment(self, assessment: AcademicAssessment) -> AcademicAssessment:
        self.db.add(assessment)
        self.db.commit()
        self.db.refresh(assessment)
        return assessment

    # Subject Marks
    def get_subject_marks(self, student_id: int, semester: Optional[int] = None) -> List[StudentSubjectMarks]:
        q = self.db.query(StudentSubjectMarks).options(joinedload(StudentSubjectMarks.subject)).filter(StudentSubjectMarks.student_id == student_id)
        if semester:
            q = q.filter(StudentSubjectMarks.semester == semester)
        return q.order_by(StudentSubjectMarks.semester.asc()).all()

    def save_subject_marks(self, marks: StudentSubjectMarks) -> StudentSubjectMarks:
        self.db.add(marks)
        self.db.commit()
        self.db.refresh(marks)
        return marks