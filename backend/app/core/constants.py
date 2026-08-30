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