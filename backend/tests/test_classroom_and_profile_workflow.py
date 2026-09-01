import pytest
from app.models.user import User
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.classroom import Classroom, ClassroomMembership
from app.models.profile_request import ProfileEditRequest, StudentEditPermission
from app.core.constants import (
    FacultyRole,
    UserRole,
    AccountStatus,
    ProfileCompletionStatus,
    EditRequestStatus,
)
from app.security.password import hash_password
from app.security.jwt import create_access_token


@pytest.fixture
def advisor_faculty_and_headers(db_session):
    user = User(
        email="advisor.jenkins@college.edu",
        username="ADV-JENKINS-01",
        password_hash=hash_password("Advisor@360"),
        role=UserRole.FACULTY.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    db_session.add(user)
    db_session.flush()

    faculty = Faculty(
        user_id=user.id,
        faculty_id="ADV-JENKINS-01",
        name="Dr. Sarah Jenkins",
        email="advisor.jenkins@college.edu",
        designation="Associate Professor",
        assigned_role=FacultyRole.CLASS_ADVISOR.value,
        active=True,
    )
    db_session.add(faculty)
    db_session.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return faculty, {"Authorization": f"Bearer {token}"}


@pytest.fixture
def subject_faculty_headers(db_session):
    user = User(
        email="subject.master@college.edu",
        username="SUBFAC-01",
        password_hash=hash_password("SubFac@360"),
        role=UserRole.FACULTY.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    db_session.add(user)
    db_session.flush()

    faculty = Faculty(
        user_id=user.id,
        faculty_id="SUBFAC-01",
        name="Prof. Subject Master",
        email="subject.master@college.edu",
        designation="Assistant Professor",
        assigned_role=FacultyRole.SUBJECT_FACULTY.value,
        active=True,
    )
    db_session.add(faculty)
    db_session.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    return {"Authorization": f"Bearer {token}"}


def test_advisor_creates_classroom_and_student(client, advisor_faculty_and_headers):
    _, headers = advisor_faculty_and_headers

    # 1. Create Classroom
    cls_payload = {
        "class_name": "B.Tech AI & Data Science - Year II A",
        "academic_year": "2025-2026",
        "year": "II",
        "semester": 3,
        "section": "A",
        "is_active": True,
    }
    res = client.post("/api/v1/classrooms", json=cls_payload, headers=headers)
    assert res.status_code == 201
    cls_data = res.json()["data"]
    cls_id = cls_data["id"]
    assert cls_data["class_name"] == "B.Tech AI & Data Science - Year II A"

    # 2. Advisor creates Student Profile with minimal initial credentials
    stud_payload = {
        "name": "Kavitha Sundaram",
        "register_number": "710023AD045",
        "password": "SecureStudent@123",
        "confirm_password": "SecureStudent@123",
    }
    res = client.post(f"/api/v1/classrooms/{cls_id}/students", json=stud_payload, headers=headers)
    assert res.status_code == 201
    stud_data = res.json()["data"]
    assert stud_data["register_number"] == "710023AD045"
    assert stud_data["profile_status"] == ProfileCompletionStatus.INCOMPLETE.value
    assert stud_data["is_locked"] is False

    # 3. Check classroom details contains student
    res = client.get(f"/api/v1/classrooms/{cls_id}", headers=headers)
    assert res.status_code == 200
    assert len(res.json()["data"]["students"]) == 1


def test_student_profile_completion_and_locking(client, db_session):
    # Setup Student
    user = User(
        email="710023ad045@college.edu",
        username="710023AD045",
        password_hash=hash_password("SecureStudent@123"),
        role=UserRole.STUDENT.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    db_session.add(user)
    db_session.flush()

    student = Student(
        user_id=user.id,
        register_number="710023AD045",
        first_name="Kavitha",
        last_name="Sundaram",
        full_name="Kavitha Sundaram",
        email="710023ad045@college.edu",
        profile_status=ProfileCompletionStatus.INCOMPLETE.value,
        is_locked=False,
        active=True,
    )
    db_session.add(student)
    db_session.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    headers = {"Authorization": f"Bearer {token}"}

    # Student Completes Profile
    completion_payload = {
        "phone_number": "9876543210",
        "gender": "Female",
        "address": "42 Anna Nagar, Chennai",
        "parent_name": "Sundaram Ramasamy",
        "parent_phone": "9876543211",
        "school_10th": "DAV Matriculation",
        "percentage_10th": 94.5,
    }
    res = client.post("/api/v1/students/me/complete-profile", json=completion_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["profile_status"] == ProfileCompletionStatus.LOCKED.value
    assert data["is_locked"] is True


def test_field_level_edit_request_and_approval_workflow(client, db_session, advisor_faculty_and_headers):
    advisor_faculty, advisor_headers = advisor_faculty_and_headers

    # Setup Classroom, Student, and Membership
    user = User(
        email="710023ad099@college.edu",
        username="710023AD099",
        password_hash=hash_password("Student@123"),
        role=UserRole.STUDENT.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    db_session.add(user)
    db_session.flush()

    student = Student(
        user_id=user.id,
        register_number="710023AD099",
        first_name="Praveen",
        last_name="Kumar",
        full_name="Praveen Kumar",
        email="710023ad099@college.edu",
        phone_number="9111111111",
        profile_status=ProfileCompletionStatus.LOCKED.value,
        is_locked=True,
        active=True,
    )
    db_session.add(student)
    db_session.flush()

    classroom = Classroom(
        class_name="AI & DS Year II",
        class_code="AIDS-Y2-A",
        academic_year="2025-2026",
        year="II",
        semester=3,
        section="A",
        advisor_faculty_id=advisor_faculty.id,
    )
    db_session.add(classroom)
    db_session.flush()

    membership = ClassroomMembership(
        classroom_id=classroom.id,
        student_id=student.id,
        status="ACTIVE",
    )
    db_session.add(membership)
    db_session.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    student_headers = {"Authorization": f"Bearer {token}"}

    # 1. Student submits edit request for phone_number
    req_payload = {
        "section_name": "Contact Information",
        "field_name": "phone_number",
        "current_value": "9111111111",
        "requested_value": "9999988888",
        "reason": "Changed my primary mobile number",
    }
    res = client.post("/api/v1/students/me/profile-edit-requests", json=req_payload, headers=student_headers)
    assert res.status_code == 201
    req_id = res.json()["data"]["id"]

    # 2. Advisor views requests for classroom
    cls_reqs = client.get(f"/api/v1/classrooms/{classroom.id}/profile-edit-requests", headers=advisor_headers)
    assert cls_reqs.status_code == 200
    assert len(cls_reqs.json()["data"]) >= 1

    # 3. Advisor approves the request
    res = client.post(f"/api/v1/profile-edit-requests/{req_id}/approve", headers=advisor_headers)
    assert res.status_code == 200
    assert res.json()["data"]["status"] == EditRequestStatus.APPROVED.value
    assert res.json()["data"]["permission"] is not None

    # 4. Student applies update to phone_number
    update_payload = {
        "field_name": "phone_number",
        "new_value": "9999988888",
    }
    res = client.patch("/api/v1/students/me/approved-field", json=update_payload, headers=student_headers)
    assert res.status_code == 200
    assert res.json()["data"]["phone_number"] == "9999988888"
    assert res.json()["data"]["is_locked"] is True

    # 5. Subsequent unauthorized edit fails because permission was marked USED
    res = client.patch("/api/v1/students/me/approved-field", json=update_payload, headers=student_headers)
    assert res.status_code == 403


def test_name_change_approval_workflow(client, db_session, advisor_faculty_and_headers):
    advisor_faculty, advisor_headers = advisor_faculty_and_headers

    user = User(
        email="710023ad100@college.edu",
        username="710023AD100",
        password_hash=hash_password("Student@123"),
        role=UserRole.STUDENT.value,
        is_active=True,
        status=AccountStatus.ACTIVE.value,
    )
    db_session.add(user)
    db_session.flush()

    student = Student(
        user_id=user.id,
        register_number="710023AD100",
        first_name="Vignesh",
        last_name="S",
        full_name="Vignesh S",
        email="710023ad100@college.edu",
        profile_status=ProfileCompletionStatus.LOCKED.value,
        is_locked=True,
        active=True,
    )
    db_session.add(student)
    db_session.flush()

    classroom = Classroom(
        class_name="AI & DS Year II",
        class_code="AIDS-Y2-B",
        academic_year="2025-2026",
        year="II",
        semester=3,
        section="B",
        advisor_faculty_id=advisor_faculty.id,
    )
    db_session.add(classroom)
    db_session.flush()

    membership = ClassroomMembership(
        classroom_id=classroom.id,
        student_id=student.id,
        status="ACTIVE",
    )
    db_session.add(membership)
    db_session.commit()

    token = create_access_token({"sub": str(user.id), "role": user.role, "email": user.email})
    student_headers = {"Authorization": f"Bearer {token}"}

    # 1. Student submits Name Change request
    res = client.post(
        "/api/v1/students/me/name-change-request",
        json={"requested_name": "Vignesh Sundaravadivel", "reason": "Gazette name correction"},
        headers=student_headers,
    )
    assert res.status_code == 201
    req_id = res.json()["data"]["id"]

    # 2. Advisor approves
    res = client.post(f"/api/v1/profile-edit-requests/{req_id}/approve", headers=advisor_headers)
    assert res.status_code == 200

    # 3. Student updates name
    res = client.patch(
        "/api/v1/students/me/approved-field",
        json={"field_name": "full_name", "new_value": "Vignesh Sundaravadivel"},
        headers=student_headers,
    )
    assert res.status_code == 200
    assert res.json()["data"]["full_name"] == "Vignesh Sundaravadivel"
    assert res.json()["data"]["first_name"] == "Vignesh"
    assert res.json()["data"]["last_name"] == "Sundaravadivel"


def test_subject_faculty_cannot_create_classroom(client, subject_faculty_headers):
    # Subject Faculty cannot create classrooms (requires Advisor/Tutor/HOD)
    cls_payload = {
        "class_name": "Unauthorized Class",
        "academic_year": "2025-2026",
        "year": "I",
        "semester": 1,
        "section": "A",
    }
    res = client.post("/api/v1/classrooms", json=cls_payload, headers=subject_faculty_headers)
    assert res.status_code == 403
