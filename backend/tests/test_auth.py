import pytest
from app.core.constants import UserRole, AccountStatus
from app.models.user import User
from app.models.student import Student
from app.models.faculty import Faculty
from app.security.password import hash_password


@pytest.fixture(autouse=True)
def seed_auth_data(db_session):
    # Seed test student 23AIM001
    u_s1 = User(
        email="arun.kumar@college.edu",
        username="23AIM001",
        password_hash=hash_password("Student@360"),
        role=UserRole.STUDENT.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    # Seed test student 23AIM002
    u_s2 = User(
        email="vignesh.k@college.edu",
        username="23AIM002",
        password_hash=hash_password("Student@360"),
        role=UserRole.STUDENT.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    # Seed test faculty FAC-AIML-01
    u_f1 = User(
        email="ramanujam.s@college.edu",
        username="FAC-AIML-01",
        password_hash=hash_password("Faculty@360"),
        role=UserRole.FACULTY.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    db_session.add_all([u_s1, u_s2, u_f1])
    db_session.flush()

    s1 = Student(
        user_id=u_s1.id,
        register_number="23AIM001",
        first_name="Arun",
        last_name="Kumar",
        full_name="Arun Kumar",
        email="arun.kumar@college.edu",
        active=True,
    )
    s2 = Student(
        user_id=u_s2.id,
        register_number="23AIM002",
        first_name="Vignesh",
        last_name="K",
        full_name="Vignesh K",
        email="vignesh.k@college.edu",
        active=True,
    )
    f1 = Faculty(
        user_id=u_f1.id,
        faculty_id="FAC-AIML-01",
        name="Dr. S. Ramanujam",
        email="ramanujam.s@college.edu",
        designation="Professor",
        active=True,
    )
    db_session.add_all([s1, s2, f1])
    db_session.commit()


def test_student_login_with_register_number(client):
    res = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "23AIM001", "password": "Student@360", "remember_me": True},
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["role"] == UserRole.STUDENT.value
    assert data["user"]["identifier"] == "23AIM001"


def test_student_login_with_email(client):
    res = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "arun.kumar@college.edu", "password": "Student@360"},
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["user"]["email"] == "arun.kumar@college.edu"


def test_student_invalid_password(client):
    res = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "23AIM001", "password": "WrongPassword123"},
    )
    assert res.status_code == 401
    assert res.json()["error_code"] == "INVALID_CREDENTIALS"


def test_faculty_login_with_id_and_email(client):
    # With ID
    res = client.post(
        "/api/v1/auth/faculty/login",
        json={"identifier": "FAC-AIML-01", "password": "Faculty@360"},
    )
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["user"]["role"] == UserRole.FACULTY.value
    assert data["user"]["identifier"] == "FAC-AIML-01"

    # With Email
    res_email = client.post(
        "/api/v1/auth/faculty/login",
        json={"identifier": "ramanujam.s@college.edu", "password": "Faculty@360"},
    )
    assert res_email.status_code == 200


def test_cross_role_login_rejection(client):
    # Student attempting faculty login
    res1 = client.post(
        "/api/v1/auth/faculty/login",
        json={"identifier": "23AIM001", "password": "Student@360"},
    )
    assert res1.status_code == 401

    # Faculty attempting student login
    res2 = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "FAC-AIML-01", "password": "Faculty@360"},
    )
    assert res2.status_code == 401


def test_auth_me_and_refresh_token(client):
    # 1. Login
    login_res = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "23AIM001", "password": "Student@360"},
    )
    token = login_res.json()["data"]["access_token"]
    refresh_token = login_res.json()["data"]["refresh_token"]

    # 2. Call /auth/me
    me_res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["data"]["identifier"] == "23AIM001"

    # 3. Refresh token
    ref_res = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
    assert ref_res.status_code == 200
    assert "access_token" in ref_res.json()["data"]


def test_faculty_registration_and_login(client):
    reg_payload = {
        "name": "Dr. Anirudh K",
        "faculty_id": "FAC-CSE-99",
        "email": "anirudh.k@college.edu",
        "phone_number": "+91 99887 76655",
        "department_id": 2,
        "designation": "Assistant Professor",
        "password": "SecurePassword@123",
        "confirm_password": "SecurePassword@123",
    }
    reg_res = client.post("/api/v1/auth/faculty/register", json=reg_payload)
    assert reg_res.status_code == 201
    assert reg_res.json()["data"]["user"]["identifier"] == "FAC-CSE-99"

    # Test login with newly registered faculty
    login_res = client.post(
        "/api/v1/auth/faculty/login",
        json={"identifier": "FAC-CSE-99", "password": "SecurePassword@123"},
    )
    assert login_res.status_code == 200


def test_faculty_add_student_workflow(client):
    # Faculty login
    fac_login = client.post(
        "/api/v1/auth/faculty/login",
        json={"identifier": "FAC-AIML-01", "password": "Faculty@360"},
    )
    fac_token = fac_login.json()["data"]["access_token"]

    # Add Student
    new_stud = {
        "register_number": "23AIM099",
        "first_name": "Gokul",
        "last_name": "Nath",
        "email": "gokul.nath@college.edu",
        "phone_number": "+91 91234 56789",
        "department_id": 1,
        "course_id": 1,
        "year": "II",
        "semester": 3,
        "section": "B",
        "student_type": "Day Scholar",
        "parent_name": "N. Natarajan",
        "parent_phone": "+91 99440 12345",
        "school_10th": "DAV Higher Secondary",
        "total_marks_10th": 485.0,
        "maximum_marks_10th": 500.0,
        "initial_password": "Student@360",
    }
    create_res = client.post(
        "/api/v1/students",
        json=new_stud,
        headers={"Authorization": f"Bearer {fac_token}"},
    )
    assert create_res.status_code == 201
    assert create_res.json()["data"]["register_number"] == "23AIM099"

    # Test that newly added student can immediately log in!
    stud_login = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "23AIM099", "password": "Student@360"},
    )
    assert stud_login.status_code == 200
    assert stud_login.json()["data"]["user"]["identifier"] == "23AIM099"


def test_student_name_change(client):
    # Student login
    login_res = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "23AIM002", "password": "Student@360"},
    )
    stud_token = login_res.json()["data"]["access_token"]

    # Change name
    name_payload = {
        "first_name": "Vignesh",
        "middle_name": "Kumar",
        "last_name": "S",
        "display_name": "Vignesh K (Coder)",
    }
    res = client.patch(
        "/api/v1/students/me/name",
        json=name_payload,
        headers={"Authorization": f"Bearer {stud_token}"},
    )
    assert res.status_code == 200
    assert res.json()["data"]["full_name"] == "Vignesh Kumar S"


def test_student_cannot_add_student(client):
    # Student login
    login_res = client.post(
        "/api/v1/auth/student/login",
        json={"identifier": "23AIM001", "password": "Student@360"},
    )
    stud_token = login_res.json()["data"]["access_token"]

    # Attempt to add student
    res = client.post(
        "/api/v1/students",
        json={"register_number": "23HACK01", "first_name": "Bad", "last_name": "Actor", "email": "bad@actor.com"},
        headers={"Authorization": f"Bearer {stud_token}"},
    )
    assert res.status_code == 403