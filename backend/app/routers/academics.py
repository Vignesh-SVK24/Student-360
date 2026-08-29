from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.common import ApiResponse
from app.schemas.academic import (
    AcademicBackgroundCreate,
    AcademicBackgroundResponse,
    SemesterAcademicRecordCreate,
    SemesterAcademicRecordResponse,
    AcademicAssessmentCreate,
    AcademicAssessmentResponse,
    StudentSubjectMarksCreate,
    StudentSubjectMarksResponse,
)
from app.services.academic_service import AcademicService

router = APIRouter(tags=["Academics"])


# 1. Background
@router.get("/students/{student_id}/academics/background", response_model=ApiResponse[Optional[AcademicBackgroundResponse]])
def get_academic_background(student_id: int, db: Session = Depends(get_db)):
    """Get 10th and 12th schooling academic background."""
    service = AcademicService(db)
    bg = service.get_background(student_id)
    return ApiResponse(
        success=True,
        message="Academic background retrieved",
        data=AcademicBackgroundResponse.model_validate(bg) if bg else None,
    )


@router.post("/academics/background", response_model=ApiResponse[AcademicBackgroundResponse])
def set_academic_background(data: AcademicBackgroundCreate, db: Session = Depends(get_db)):
    """Save or update prior schooling academic background."""
    service = AcademicService(db)
    saved = service.set_background(data)
    return ApiResponse(
        success=True,
        message="Academic background saved",
        data=AcademicBackgroundResponse.model_validate(saved),
    )


# 2. Semester Records
@router.get("/students/{student_id}/academics/semesters", response_model=ApiResponse[List[SemesterAcademicRecordResponse]])
def get_semester_records(student_id: int, db: Session = Depends(get_db)):
    """Get semester academic performance records."""
    service = AcademicService(db)
    records = service.get_semester_records(student_id)
    return ApiResponse(
        success=True,
        message="Semester records retrieved",
        data=[SemesterAcademicRecordResponse.model_validate(r) for r in records],
    )


@router.post("/academics/semesters", response_model=ApiResponse[SemesterAcademicRecordResponse], status_code=status.HTTP_201_CREATED)
def add_semester_record(data: SemesterAcademicRecordCreate, db: Session = Depends(get_db)):
    """Add or update a semester academic record."""
    service = AcademicService(db)
    saved = service.add_semester_record(data)
    return ApiResponse(
        success=True,
        message="Semester record saved",
        data=SemesterAcademicRecordResponse.model_validate(saved),
    )


# 3. Assessments
@router.get("/students/{student_id}/academics/assessments", response_model=ApiResponse[List[AcademicAssessmentResponse]])
def get_assessments(
    student_id: int,
    semester: Optional[int] = Query(None, description="Filter by semester"),
    db: Session = Depends(get_db),
):
    """Get internal continuous assessments (IA1, IA2, assignments, labs)."""
    service = AcademicService(db)
    assessments = service.get_assessments(student_id, semester=semester)
    return ApiResponse(
        success=True,
        message="Assessments retrieved",
        data=[AcademicAssessmentResponse.model_validate(a) for a in assessments],
    )


@router.post("/academics/assessments", response_model=ApiResponse[AcademicAssessmentResponse], status_code=status.HTTP_201_CREATED)
def add_assessment(data: AcademicAssessmentCreate, db: Session = Depends(get_db)):
    """Record an internal assessment with validation."""
    service = AcademicService(db)
    saved = service.add_assessment(data)
    return ApiResponse(
        success=True,
        message="Assessment recorded",
        data=AcademicAssessmentResponse.model_validate(saved),
    )


# 4. Subject Marks
@router.get("/students/{student_id}/academics/subject-marks", response_model=ApiResponse[List[StudentSubjectMarksResponse]])
def get_subject_marks(
    student_id: int,
    semester: Optional[int] = Query(None, description="Filter by semester"),
    db: Session = Depends(get_db),
):
    """Get subject marks and assigned grades."""
    service = AcademicService(db)
    marks = service.get_subject_marks(student_id, semester=semester)
    res = [
        StudentSubjectMarksResponse(
            id=m.id,
            student_id=m.student_id,
            subject_id=m.subject_id,
            subject_code=m.subject.code if m.subject else None,
            subject_name=m.subject.name if m.subject else None,
            semester=m.semester,
            internal_marks=m.internal_marks,
            semester_marks=m.semester_marks,
            total_marks=m.total_marks,
            grade=m.grade,
            grade_points=m.grade_points,
            created_at=m.created_at,
            updated_at=m.updated_at,
        )
        for m in marks
    ]
    return ApiResponse(
        success=True,
        message="Subject marks retrieved",
        data=res,
    )


@router.post("/academics/subject-marks", response_model=ApiResponse[StudentSubjectMarksResponse], status_code=status.HTTP_201_CREATED)
def record_subject_marks(data: StudentSubjectMarksCreate, db: Session = Depends(get_db)):
    """Record subject marks."""
    service = AcademicService(db)
    saved = service.record_subject_marks(data)
    return ApiResponse(
        success=True,
        message="Subject marks recorded",
        data=StudentSubjectMarksResponse(
            id=saved.id,
            student_id=saved.student_id,
            subject_id=saved.subject_id,
            subject_code=saved.subject.code if saved.subject else None,
            subject_name=saved.subject.name if saved.subject else None,
            semester=saved.semester,
            internal_marks=saved.internal_marks,
            semester_marks=saved.semester_marks,
            total_marks=saved.total_marks,
            grade=saved.grade,
            grade_points=saved.grade_points,
            created_at=saved.created_at,
            updated_at=saved.updated_at,
        ),
    )