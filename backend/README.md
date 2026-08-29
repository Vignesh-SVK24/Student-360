# 🎓 Student 360 — Production Backend Architecture

Student 360 is a comprehensive College Student Information and Portfolio Management System. This repository contains the backend architecture built with **Python 3.11+**, **FastAPI**, **modern SQLAlchemy 2.0 ORM**, **Pydantic v2**, and **PostgreSQL** (with zero-friction local SQLite fallback).

---

## 🏛️ System Architecture

The backend strictly adheres to the clean, enterprise layered pattern:

`	ext
HTTP Client (Frontend / Mobile)
       ↓
API Router Layer (FastAPI Routers)
       ↓  (Validates request via Pydantic Schemas)
Service Layer (Business Logic, Formulas, Validations & Auditing)
       ↓
Repository Layer (Database queries & abstractions)
       ↓
SQLAlchemy 2.0 ORM & Database (PostgreSQL / SQLite)
`

### Key Architectural Strengths:
1. **Separation of Concerns**: Routers never query the database directly or execute calculations.
2. **Authoritative Backend Computations**: Attendance percentages, CGPA, and grade assignments are computed and validated on the backend rather than trusting frontend clients.
3. **Extensibility for Authentication**: The Student, Faculty, and AuditLog models are decoupled from authentication mechanisms, ready to be linked with a future User account and JWT token system without schema refactoring.
4. **Normalized Relational Data**: Structured across 15+ relational tables avoiding a single giant table anti-pattern.

---

## 📁 Directory Structure

`	ext
backend/
├── app/
│   ├── main.py                     # FastAPI application entry point, CORS & exception handlers
│   ├── core/
│   │   ├── config.py               # Pydantic Settings & environment variables
│   │   ├── database.py             # SQLAlchemy engine, session & declarative base
│   │   ├── constants.py            # Enums (StudentType, Gender, Skills, AssessmentType, etc.)
│   │   └── exceptions.py           # Custom application exceptions (NotFound, Conflict, etc.)
│   ├── models/
│   │   ├── __init__.py             # Central model exports
│   │   ├── base.py                 # TimestampMixin (created_at, updated_at)
│   │   ├── department.py           # Department model
│   │   ├── course.py               # Course model
│   │   ├── subject.py              # Subject model
│   │   ├── student.py              # Central Student model
│   │   ├── guardian.py             # Parent/Guardian details (1:N relationship)
│   │   ├── faculty.py              # Faculty profile model
│   │   ├── academic.py             # 10th/12th Background, Semester Records, Assessments, Subject Marks
│   │   ├── attendance.py           # Subject-wise attendance model
│   │   ├── achievement.py          # Awards, hackathons & leadership roles
│   │   ├── skill.py                # Student technical & soft skills inventory
│   │   ├── certificate.py          # Certifications & credential URLs
│   │   ├── project.py              # Projects & normalized Technologies (many-to-many)
│   │   ├── profile_link.py         # Social & portfolio URLs (GitHub, LinkedIn, etc.)
│   │   ├── remark.py               # Faculty mentorship remarks & evaluations
│   │   └── audit_log.py            # Action audit trail logging
│   ├── schemas/
│   │   ├── common.py               # Standard ApiResponse envelope & pagination info
│   │   ├── student.py              # Create, Update, Summary, Search schemas
│   │   ├── student_detail.py       # Full Student 360 dossier with all child portfolios
│   │   ├── department.py           # Department schemas
│   │   ├── course.py               # Course schemas
│   │   ├── subject.py              # Subject schemas
│   │   ├── guardian.py             # Guardian schemas
│   │   ├── faculty.py              # Faculty schemas
│   │   ├── academic.py             # Academic records & assessment schemas
│   │   ├── attendance.py           # Attendance & summary schemas
│   │   ├── achievement.py          # Achievement schemas
│   │   ├── skill.py                # Skill schemas
│   │   ├── certificate.py          # Certificate schemas
│   │   ├── project.py              # Project & technology schemas
│   │   ├── profile_link.py         # Profile link schemas
│   │   └── remark.py               # Faculty remark schemas
│   ├── repositories/               # Direct database query layer
│   │   ├── base.py                 # Generic BaseRepository
│   │   ├── student_repository.py   # Multi-field search, eager-loading & CRUD
│   │   ├── academic_repository.py  # Academic performance queries
│   │   ├── attendance_repository.py# Attendance tracking queries
│   │   ├── achievement_repository.py
│   │   ├── skill_repository.py
│   │   ├── certificate_repository.py
│   │   ├── project_repository.py
│   │   ├── remark_repository.py
│   │   ├── profile_link_repository.py
│   │   ├── faculty_repository.py
│   │   └── audit_repository.py     # System audit trail logger
│   ├── services/                   # Business logic layer
│   │   ├── student_service.py      # Student validation, search & dossier synthesis
│   │   ├── academic_service.py     # Marks calculation, grade assignment & validation
│   │   ├── attendance_service.py   # Attendance percentage, deficiency alerts (<75%)
│   │   ├── achievement_service.py  # Achievements business logic & URL validation
│   │   ├── skill_service.py        # Skills categorization & proficiencies
│   │   ├── certificate_service.py  # Certificate verification logic & date validation
│   │   ├── project_service.py      # Project tracking & technology linking
│   │   ├── profile_link_service.py # URL validation & security checks
│   │   ├── remark_service.py       # Faculty evaluations & grading
│   │   └── faculty_service.py      # Faculty profile management
│   ├── routers/                    # Thin HTTP API endpoint controllers
│   │   ├── api.py                  # Aggregated router under /api/v1
│   │   ├── health.py               # GET /api/v1/health
│   │   ├── students.py             # CRUD & /search endpoints
│   │   ├── attendance.py           # Student attendance & /summary
│   │   ├── academics.py            # Semesters, assessments & subject marks
│   │   ├── achievements.py         # Achievements CRUD
│   │   ├── skills.py               # Skills inventory CRUD
│   │   ├── certificates.py         # Certificates CRUD
│   │   ├── projects.py             # Projects CRUD
│   │   ├── profile_links.py        # Social & coding links CRUD
│   │   ├── remarks.py              # Faculty remarks CRUD
│   │   └── faculty.py              # Faculty directory
│   └── utils/
│       ├── pagination.py           # Reusable pagination parameters & envelope
│       ├── validators.py           # Regex, date range, marks & attendance validators
│       └── helpers.py              # Mathematical calculation helpers
├── alembic/                        # Database migration scripts
├── scripts/
│   └── seed_data.py                # Realistic seed data generator (10 complete student portfolios)
├── tests/                          # Automated Pytest suite
├── requirements.txt
├── .env.example
├── alembic.ini
└── README.md
`

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.11+
- (Optional) PostgreSQL 14+ (Local SQLite is preconfigured for instantaneous setup)

### 2. Setup Virtual Environment & Install Dependencies
From the ackend directory:
`ash
# Windows
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt

# Linux / macOS
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
`

### 3. Environment Variables
Copy .env.example to .env:
`ash
cp .env.example .env
`

To connect to a production **PostgreSQL** or **Supabase** instance, update DATABASE_URL in .env:
`env
DATABASE_URL=postgresql+psycopg2://postgres:your_password@localhost:5432/student360
`
*(For local testing/dev, the default sqlite:///./student360.db works out of the box without installing PostgreSQL).*

---

## 🗄️ Database Migrations (Alembic)

Alembic manages all schema versions:

`ash
# Create a new migration revision after modifying models
alembic revision --autogenerate -m "describe_changes"

# Apply pending migrations to the database
alembic upgrade head

# Rollback one migration step
alembic downgrade -1
`

---

## 🌱 Seed Realistic Demo Data

The seed script creates:
- 3 Academic Departments (AIML, CSE, ECE)
- 2 Degree Courses
- 5 Semester Subjects
- 2 Faculty Members
- 10 Complete Student 360 Dossiers (Personal details, Guardians, 10th/12th marks, Semester records, Attendance, Projects, Skills, Certificates, Links, Remarks, Audit logs)

Run the seeder:
`ash
python scripts/seed_data.py
`

---

## 🖥️ Running the Development Server

Start the FastAPI application with live hot-reload:
`ash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
`

- **API Base URL**: http://localhost:8000/api/v1
- **Interactive Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Alternative ReDoc Docs**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🧪 Running Automated Tests

Run the comprehensive automated test suite with Pytest:
`ash
pytest tests -v
`

Tests cover:
- Health check endpoints
- Student creation & duplicate register number rejection (409 Conflict)
- Student directory search with pagination & filters
- Full Student 360 dossier retrieval
- Attendance count validation (present <= total) & auto percentage calculation
- Attendance deficiency alert logic (< 75%)
- Internal continuous assessments with marks validation
- Achievement, Skill, Project, and Certificate CRUD operations

---

## 🔒 Future Authentication & Authorization Roadmap

The architecture was intentionally designed for the upcoming authentication phase:
1. **User Table**: Create a User entity with email, hashed_password, ole (STUDENT, FACULTY, ADMIN).
2. **Profile Linking**: Link User.id to Student.user_id or Faculty.user_id without changing any existing foreign keys.
3. **JWT Bearer Authentication**: FastAPI dependencies (get_current_user, equire_role) can be cleanly plugged into router endpoints.
4. **Role Permissions**:
   - STUDENT: Read/Update own portfolio, view own attendance & marks.
   - FACULTY: Search student directory, record attendance, enter subject marks, post mentorship remarks.
   - ADMIN: Manage faculty, departments, courses, and system configuration.