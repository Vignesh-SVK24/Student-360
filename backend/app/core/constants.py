from enum import Enum


class StudentType(str, Enum):
    DAY_SCHOLAR = "Day Scholar"
    HOSTELLER = "Hosteller"


class Gender(str, Enum):
    MALE = "Male"
    FEMALE = "Female"
    OTHER = "Other"
    PREFER_NOT_TO_SAY = "Prefer not to say"


class SkillCategory(str, Enum):
    PROGRAMMING = "Programming"
    TECHNICAL = "Technical"
    TOOLS = "Tools"
    SOFT_SKILLS = "Soft Skills"
    OTHER = "Other"


class SkillProficiency(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"
    EXPERT = "Expert"


class RemarkGrade(str, Enum):
    POOR = "Poor"
    AVERAGE = "Average"
    BETTER = "Better"
    GOOD = "Good"
    EXCELLENT = "Excellent"


class AssessmentType(str, Enum):
    IA1 = "Internal Assessment 1"
    IA2 = "Internal Assessment 2"
    IA3 = "Internal Assessment 3"
    ASSIGNMENT = "Assignment"
    LAB = "Lab Assessment"
    OTHER = "Other"


class ProfilePlatform(str, Enum):
    GITHUB = "GitHub"
    LINKEDIN = "LinkedIn"
    PORTFOLIO = "Portfolio"
    WEBSITE = "Website"
    LEETCODE = "LeetCode"
    CODECHEF = "CodeChef"
    KAGGLE = "Kaggle"
    OTHER = "Other"


class AuditAction(str, Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"


class AuditActorType(str, Enum):
    STUDENT = "STUDENT"
    FACULTY = "FACULTY"
    ADMIN = "ADMIN"
    SYSTEM = "SYSTEM"


class UserRole(str, Enum):
    STUDENT = "STUDENT"
    FACULTY = "FACULTY"
    ADMIN = "ADMIN"


class AccountStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    SUSPENDED = "SUSPENDED"
    PENDING = "PENDING"


class FacultyRole(str, Enum):
    HOD = "HOD"
    ASSOCIATE_PROFESSOR = "ASSOCIATE_PROFESSOR"
    CLASS_ADVISOR = "CLASS_ADVISOR"
    CLASS_TUTOR = "CLASS_TUTOR"
    SUBJECT_FACULTY = "SUBJECT_FACULTY"


class ProfileCompletionStatus(str, Enum):
    INCOMPLETE = "INCOMPLETE"
    PENDING_REVIEW = "PENDING_REVIEW"
    COMPLETED = "COMPLETED"
    LOCKED = "LOCKED"


class EditRequestStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"
    USED = "USED"


class AttendanceStatus(str, Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    OD = "OD"


class ClassroomStatus(str, Enum):
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"
    ARCHIVED = "ARCHIVED"


class FacultyClassroomRole(str, Enum):
    ADVISOR = "ADVISOR"
    TUTOR = "TUTOR"


class TimetableEntryType(str, Enum):
    SUBJECT = "SUBJECT"
    BREAK = "BREAK"
    LUNCH = "LUNCH"
    FREE = "FREE"