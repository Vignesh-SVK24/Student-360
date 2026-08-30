def test_project_crud_and_technologies(client, faculty_headers):
    # Create student
    s_res = client.post(
        "/api/v1/students",
        json={"register_number": "23PRJ001", "first_name": "Deepa", "last_name": "V", "email": "deepa.v@test.edu"},
        headers=faculty_headers,
    )
    student_id = s_res.json()["data"]["id"]

    proj_payload = {
        "student_id": student_id,
        "title": "Autonomous Indoor Robot Navigation",
        "short_description": "SLAM-based path planner for LiDAR-equipped rovers",
        "technologies": ["ROS2", "Python", "C++"],
        "github_url": "https://github.com/deepa/slam-rover",
    }
    proj_res = client.post("/api/v1/projects", json=proj_payload)
    assert proj_res.status_code == 201
    data = proj_res.json()["data"]
    assert data["title"] == "Autonomous Indoor Robot Navigation"
    assert "ROS2" in data["technologies"]

    # Get student detail includes project
    d_res = client.get(f"/api/v1/students/{student_id}")
    assert d_res.status_code == 200
    projects = d_res.json()["data"]["projects"]
    assert len(projects) == 1
    assert projects[0]["title"] == "Autonomous Indoor Robot Navigation"