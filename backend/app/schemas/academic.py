from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.core.constants import AssessmentType


# 1. Academic Background (10th / 12th)
class AcademicBackgroundBase(BaseModel):
    student_id: int
    school_10th: Optional[str] = None
    board_10th: Optional[str] = None
    total_marks_10th: Optional[float] = None
    maximum_marks_10th: Optional[float] = None
    percentage_10th: Optional[float] = None
    year_of_passing_10th: Optional[int] = None

    school_12th: Optional[str] = None
    board_12th: Optional[str] = None
    total_marks_12th: Optional[float] = None
    maximum_marks_12th: Optional[float] = None
    percentage_12th: Optional[float] = None
    year_of_passing_12th: Optional[int] = None


class AcademicBackgroundCreate(AcademicBackgroundBase):
    pass


class AcademicBackgroundUpdate(BaseModel):
    school_10th: Optional[str] = None
    board_10th: Optional[str] = None
    total_marks_10th: Optional[float] = None
    maximum_marks_10th: Optional[float] = None
    percentage_10th: Optional[float] = None
    year_of_passing_10th: Optional[int] = None

    school_12th: Optional[str] = None
    board_12th: Optional[str] = None
    total_marks_12th: Optional[float] = None
    maximum_marks_12th: Optional[float] = None
    percentage_12th: Optional[float] = None
    year_of_passing_12th: Optional[int] = None


class AcademicBackgroundResponse(AcademicBackgroundBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# 2. Semester Records
class SemesterAcademicRecordBase(BaseModel):
    student_id: int
    semester: int
    academic_year: str
    internal_score: Optional[float] = None
    semester_score: Optional[float] = None
    percentage: Optional[float] = None
    sgpa: Optional[float] = None
    cgpa: Optional[float] = None


class SemesterAcademicRecordCreate(SemesterAcademicRecordBase):
    pass


class SemesterAcademicRecordUpdate(BaseModel):
    internal_score: Optional[float] = None
    semester_score: Optional[float] = None
    percentage: Optional[float] = None
    sgpa: Optional[float] = None
    cgpa: Optional[float] = None


class SemesterAcademicRecordResponse(SemesterAcademicRecordBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# 3. Assessments
class AcademicAssessmentBase(BaseModel):
    student_id: int
    semester: int
    subject: str
    assessment_type: str = AssessmentType.IA1.value
    assessment_name: str
    maximum_marks: float = 50.0
    obtained_marks: float
    assessment_date: Optional[date] = None


class AcademicAssessmentCreate(AcademicAssessmentBase):
    pass


class AcademicAssessmentUpdate(BaseModel):
    subject: Optional[str] = None
    assessment_type: Optional[str] = None
    assessment_name: Optional[str] = None
    maximum_marks: Optional[float] = None
    obtained_marks: Optional[float] = None
    assessment_date: Optional[date] = None


class AcademicAssessmentResponse(AcademicAssessmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# 4. Subject Marks
class StudentSubjectMarksBase(BaseModel):
    student_id: int
    subject_id: int
    semester: int
    internal_marks: float = 0.0
    semester_marks: float = 0.0
    total_marks: float = 0.0
    grade: Optional[str] = None
    grade_points: Optional[float] = None


class StudentSubjectMarksCreate(StudentSubjectMarksBase):
    pass


class StudentSubjectMarksUpdate(BaseModel):
    internal_marks: Optional[float] = None
    semester_marks: Optional[float] = None
    total_marks: Optional[float] = None
    grade: Optional[str] = None
    grade_points: Optional[float] = None


class StudentSubjectMarksResponse(StudentSubjectMarksBase):
    id: int
    subject_code: Optional[str] = None
    subject_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)