from fastapi import APIRouter
from app.routers import (
    health,
    auth,
    students,
    attendance,
    academics,
    achievements,
    skills,
    certificates,
    projects,
    profile_links,
    remarks,
    faculty,
    timetable,
    classrooms,
    profile_requests,
)

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(students.router)
api_router.include_router(attendance.router)
api_router.include_router(academics.router)
api_router.include_router(achievements.router)
api_router.include_router(skills.router)
api_router.include_router(certificates.router)
api_router.include_router(projects.router)
api_router.include_router(profile_links.router)
api_router.include_router(remarks.router)
api_router.include_router(faculty.router)
api_router.include_router(timetable.router)
api_router.include_router(classrooms.router)
api_router.include_router(profile_requests.router)