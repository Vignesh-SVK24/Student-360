def test_achievement_and_skill_crud(client, faculty_headers):
    # Create student
    s_res = client.post(
        "/api/v1/students",
        json={"register_number": "23ACH001", "first_name": "Manoj", "last_name": "B", "email": "manoj.b@test.edu"},
        headers=faculty_headers,
    )
    student_id = s_res.json()["data"]["id"]

    # 1. Add Achievement
    ach_payload = {
        "student_id": student_id,
        "title": "National Cyber Security CTF 1st Place",
        "event_name": "CyberShield 2025",
        "position": "Winner",
        "certificate_url": "https://cyber.org/cert/123",
    }
    ach_res = client.post("/api/v1/achievements", json=ach_payload)
    assert ach_res.status_code == 201
    ach_id = ach_res.json()["data"]["id"]

    # List
    list_res = client.get(f"/api/v1/students/{student_id}/achievements")
    assert list_res.status_code == 200
    assert len(list_res.json()["data"]) == 1

    # 2. Add Skill
    sk_payload = {
        "student_id": student_id,
        "name": "Kubernetes",
        "category": "Tools",
        "proficiency_level": "Advanced",
    }
    sk_res = client.post("/api/v1/skills", json=sk_payload)
    assert sk_res.status_code == 201
    assert sk_res.json()["data"]["name"] == "Kubernetes"