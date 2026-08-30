def test_attendance_workflow_and_validation(client, faculty_headers):
    # Create student
    s_res = client.post(
        "/api/v1/students",
        json={"register_number": "23ATT001", "first_name": "Ramesh", "last_name": "K", "email": "ramesh.k@test.edu"},
        headers=faculty_headers,
    )
    student_id = s_res.json()["data"]["id"]

    # 1. Valid Attendance
    att_payload = {
        "student_id": student_id,
        "subject_id": 1,
        "semester": 3,
        "academic_year": "2024-2025",
        "total_classes": 50,
        "present_classes": 40,
        "absent_classes": 10,
    }
    rec_res = client.post("/api/v1/attendance", json=att_payload)
    assert rec_res.status_code == 201
    assert rec_res.json()["data"]["attendance_percentage"] == 80.0

    # 2. Invalid Attendance Validation: present > total
    invalid_payload = {
        "student_id": student_id,
        "subject_id": 2,
        "semester": 3,
        "academic_year": "2024-2025",
        "total_classes": 30,
        "present_classes": 35,  # Exceeds total!
        "absent_classes": 0,
    }
    inv_res = client.post("/api/v1/attendance", json=invalid_payload)
    assert inv_res.status_code == 422
    assert inv_res.json()["success"] is False
    assert "INVALID_ATTENDANCE" in inv_res.json()["error_code"]

    # 3. Summary Check
    sum_res = client.get(f"/api/v1/students/{student_id}/attendance/summary")
    assert sum_res.status_code == 200
    summary = sum_res.json()["data"]
    assert summary["overall_percentage"] == 80.0
    assert summary["is_compliant"] is True