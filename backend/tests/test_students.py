def test_create_and_get_student(client, faculty_headers):
    payload = {
        "register_number": "23TEST001",
        "first_name": "Karthik",
        "last_name": "Raja",
        "email": "karthik.raja@test.edu",
        "phone_number": "+91 99999 88888",
        "year": "II",
        "semester": 3,
        "section": "A",
        "student_type": "Day Scholar",
    }
    # 1. Create
    res = client.post("/api/v1/students", json=payload, headers=faculty_headers)
    assert res.status_code == 201
    res_data = res.json()
    assert res_data["success"] is True
    student_id = res_data["data"]["id"]
    assert res_data["data"]["register_number"] == "23TEST001"
    assert res_data["data"]["full_name"] == "Karthik Raja"

    # 2. Get Detail
    detail_res = client.get(f"/api/v1/students/{student_id}")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()["data"]
    assert detail_data["id"] == student_id
    assert detail_data["email"] == "karthik.raja@test.edu"

    # 3. Patch Update
    patch_res = client.patch(f"/api/v1/students/{student_id}", json={"section": "B"})
    assert patch_res.status_code == 200
    assert patch_res.json()["data"]["section"] == "B"


def test_duplicate_register_number_rejected(client, faculty_headers):
    payload = {
        "register_number": "23DUP001",
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@test.edu",
    }
    res1 = client.post("/api/v1/students", json=payload, headers=faculty_headers)
    assert res1.status_code == 201

    # Second attempt with same register number
    payload2 = {
        "register_number": "23dup001",  # case insensitive
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane.doe@test.edu",
    }
    res2 = client.post("/api/v1/students", json=payload2, headers=faculty_headers)
    assert res2.status_code == 409
    assert res2.json()["error_code"] == "DUPLICATE_REGISTER_NUMBER"


def test_search_students(client, faculty_headers):
    client.post(
        "/api/v1/students",
        json={
            "register_number": "23SRC001",
            "first_name": "Subramanian",
            "last_name": "V",
            "email": "subbu.v@test.edu",
        },
        headers=faculty_headers,
    )

    # Search by partial name
    res = client.get("/api/v1/students/search?query=subram")
    assert res.status_code == 200
    data = res.json()["data"]
    assert data["pagination"]["total"] >= 1
    matched = [s for s in data["items"] if s["register_number"] == "23SRC001"]
    assert len(matched) == 1

    # Search by register number
    res_reg = client.get("/api/v1/students/search?register_number=23SRC")
    assert res_reg.status_code == 200
    assert res_reg.json()["data"]["pagination"]["total"] >= 1