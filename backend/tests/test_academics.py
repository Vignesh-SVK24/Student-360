def test_academic_background_and_assessments(client, faculty_headers):
    # Create student
    s_res = client.post(
        "/api/v1/students",
        json={"register_number": "23ACAD001", "first_name": "Harini", "last_name": "S", "email": "harini.s@test.edu"},
        headers=faculty_headers,
    )
    student_id = s_res.json()["data"]["id"]

    # 1. Background
    bg_payload = {
        "student_id": student_id,
        "school_10th": "Little Flower School",
        "total_marks_10th": 475.0,
        "maximum_marks_10th": 500.0,
        "year_of_passing_10th": 2021,
    }
    bg_res = client.post("/api/v1/academics/background", json=bg_payload)
    assert bg_res.status_code == 200
    assert bg_res.json()["data"]["percentage_10th"] == 95.0

    # 2. Continuous Assessment with validation
    # Valid
    ass_payload = {
        "student_id": student_id,
        "semester": 3,
        "subject": "Data Structures",
        "assessment_type": "Internal Assessment 1",
        "assessment_name": "Unit 1 & 2 Test",
        "maximum_marks": 50.0,
        "obtained_marks": 45.0,
    }
    ass_res = client.post("/api/v1/academics/assessments", json=ass_payload)
    assert ass_res.status_code == 201
    assert ass_res.json()["data"]["obtained_marks"] == 45.0

    # Invalid marks: obtained > maximum
    inv_ass = {
        "student_id": student_id,
        "semester": 3,
        "subject": "Data Structures",
        "assessment_name": "Test",
        "maximum_marks": 50.0,
        "obtained_marks": 55.0,
    }
    inv_res = client.post("/api/v1/academics/assessments", json=inv_ass)
    assert inv_res.status_code == 422
    assert inv_res.json()["success"] is False
    assert "MARKS_EXCEED_MAXIMUM" in inv_res.json()["error_code"]