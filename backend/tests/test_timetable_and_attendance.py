from fastapi import status


def test_timetable_and_period_attendance(client, faculty_headers):
    # 1. Create a test student
    s_res = client.post(
        "/api/v1/students",
        json={"register_number": "23TAB001", "first_name": "Kavitha", "last_name": "M", "email": "kavitha.m@test.edu"},
        headers=faculty_headers,
    )
    assert s_res.status_code == 201
    student = s_res.json()["data"]
    student_id = student["id"]

    # 2. Fetch 6-day timetable
    res = client.get("/api/v1/timetable")
    assert res.status_code == status.HTTP_200_OK
    data = res.json()["data"]
    assert "days" in data
    assert len(data["days"]) == 6
    day_names = [d["day"] for d in data["days"]]
    assert day_names == ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    monday_slots = data["days"][0]["slots"]
    assert len(monday_slots) >= 5
    slot_to_edit = monday_slots[0]
    slot_id = slot_to_edit["id"]

    # 3. Edit a timetable slot
    update_res = client.put(
        f"/api/v1/timetable/slots/{slot_id}",
        json={
            "subject_name": "Advanced Neural Networks",
            "start_time": "09:15 AM",
            "end_time": "10:15 AM",
            "room": "AI Lab 4",
        },
        headers=faculty_headers,
    )
    assert update_res.status_code == status.HTTP_200_OK
    updated_slot = update_res.json()["data"]
    assert updated_slot["subject_name"] == "Advanced Neural Networks"
    assert updated_slot["start_time"] == "09:15 AM"

    # 3b. Add a period row
    add_p = client.post(
        "/api/v1/timetable/periods",
        json={
            "start_time": "05:00 PM",
            "end_time": "05:45 PM",
            "subject_name": "Special Elective",
        },
        headers=faculty_headers,
    )
    assert add_p.status_code == status.HTTP_201_CREATED
    assert len(add_p.json()["data"]["days"][0]["slots"]) >= 6

    # 4. Mark period attendance with PRESENT, ABSENT, OD
    att_res = client.post(
        "/api/v1/attendance/period",
        json={
            "date": "2026-09-01",
            "day_of_week": "Monday",
            "period_number": 1,
            "subject_name": "Advanced Neural Networks",
            "timetable_slot_id": slot_id,
            "attendance": [
                {
                    "student_id": student_id,
                    "status": "OD",
                    "notes": "Representing college at hackathon",
                }
            ],
        },
    )
    assert att_res.status_code == status.HTTP_200_OK
    att_data = att_res.json()["data"]
    assert att_data["od_count"] == 1
    assert att_data["records"][0]["status"] == "OD"

    # 5. Query recorded period attendance
    get_att = client.get("/api/v1/attendance/period?date=2026-09-01&period_number=1")
    assert get_att.status_code == status.HTTP_200_OK
    assert get_att.json()["data"]["records"][0]["status"] == "OD"

    # 6. Check student access management
    acc_res = client.get(f"/api/v1/students/{student_id}/access")
    assert acc_res.status_code == status.HTTP_200_OK

    # Toggle/Grant student access
    post_acc = client.post(
        f"/api/v1/students/{student_id}/access",
        json={"is_active": True, "new_password": "NewStudentPass@123"},
    )
    assert post_acc.status_code == status.HTTP_200_OK
    assert post_acc.json()["data"]["is_active"] is True
