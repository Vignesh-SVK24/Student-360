import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.department import Department
from app.models.course import Course
from app.models.subject import Subject
from app.models.faculty import Faculty
from app.models.student import Student
from app.models.guardian import Guardian
from app.models.classroom import Classroom, ClassroomMembership, FacultyClassroomAssignment
from app.models.academic import *
from app.security.password import hash_password
from app.core.constants import UserRole, FacultyClassroomRole, ClassroomStatus

def get_or_create(session, model, defaults=None, **kwargs):
    instance = session.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False
    else:
        params = dict((k, v) for k, v in kwargs.items())
        params.update(defaults or {})
        instance = model(**params)
        session.add(instance)
        return instance, True

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        print("Seeding Department...")
        dept, created = get_or_create(db, Department, code='AIDS', defaults={
            'name': 'Artificial Intelligence & Data Science'
        })
        db.commit()
        
        print("Seeding Course...")
        course, created = get_or_create(db, Course, code='BTAIDS', defaults={
            'name': 'B.Tech Artificial Intelligence & Data Science',
            'department_id': dept.id,
            'duration_years': 4
        })
        db.commit()

        print("Seeding Subjects...")
        subjects_data = [
            {'code': 'AI8401', 'name': 'Deep Learning Architectures', 'credits': 4.0},
            {'code': 'AI8402', 'name': 'Natural Language Processing', 'credits': 4.0},
            {'code': 'AI8403', 'name': 'Computer Vision', 'credits': 3.0},
            {'code': 'CS8403', 'name': 'Cloud & Distributed Systems', 'credits': 3.0},
            {'code': 'DS8401', 'name': 'Big Data Technologies', 'credits': 3.0},
            {'code': 'MA8401', 'name': 'Engineering Optimization', 'credits': 3.0},
        ]
        
        for sub in subjects_data:
            get_or_create(db, Subject, code=sub['code'], defaults={
                'name': sub['name'],
                'credits': sub['credits'],
                'course_id': course.id,
                'semester': 3
            })
        db.commit()

        print("Seeding Faculty User & Profile...")
        fac_user = db.query(User).filter((User.email == 'ramanujam.s@college.edu') | (User.username == 'ramanujam115') | (User.username == 'FAC-AIML-01')).first()
        if not fac_user:
            fac_user = User(
                email='ramanujam.s@college.edu',
                username='ramanujam115',
                password_hash=hash_password('Faculty@360'),
                role=UserRole.FACULTY.value
            )
            db.add(fac_user)
            db.commit()
        else:
            fac_user.username = 'ramanujam115'
            db.commit()
        
        fac_profile = db.query(Faculty).filter((Faculty.email == 'ramanujam.s@college.edu') | (Faculty.faculty_id == 'ramanujam115') | (Faculty.faculty_id == 'FAC-AIML-01')).first()
        if not fac_profile:
            fac_profile = Faculty(
                faculty_id='ramanujam115',
                name='Dr. S. Ramanujam',
                email='ramanujam.s@college.edu',
                department_id=dept.id,
                designation='Professor',
                assigned_role='CLASS_ADVISOR',
                user_id=fac_user.id
            )
            db.add(fac_profile)
            db.commit()
        else:
            fac_profile.faculty_id = 'ramanujam115'
            db.commit()

        print("Seeding Classroom...")
        classroom, created = get_or_create(db, Classroom, class_code='AIDS-IIA-2025', defaults={
            'class_name': 'AI & DS - Year II Section A',
            'department_id': dept.id,
            'academic_year': '2025-2026',
            'year': 'II',
            'semester': 3,
            'section': 'A',
            'created_by': fac_profile.id,
            'advisor_faculty_id': fac_profile.id
        })
        db.commit()

        print("Seeding FacultyClassroomAssignment...")
        get_or_create(db, FacultyClassroomAssignment, 
            faculty_id=fac_profile.id, 
            classroom_id=classroom.id, 
            defaults={
                'assignment_type': FacultyClassroomRole.ADVISOR.value
            }
        )
        db.commit()

        print("Seeding Student 1 (12-digit register number: 720725115001)...")
        stud1_user = db.query(User).filter((User.email == 'arun.kumar@college.edu') | (User.username == '720725115001') | (User.username == '23AIM001')).first()
        if not stud1_user:
            stud1_user = User(
                email='arun.kumar@college.edu',
                username='720725115001',
                password_hash=hash_password('Student@360'),
                role=UserRole.STUDENT.value
            )
            db.add(stud1_user)
            db.commit()
        else:
            stud1_user.username = '720725115001'
            db.commit()
        
        stud1 = db.query(Student).filter((Student.email == 'arun.kumar@college.edu') | (Student.register_number == '720725115001') | (Student.register_number == '23AIM001')).first()
        if not stud1:
            stud1 = Student(
                register_number='720725115001',
                first_name='Arun',
                last_name='Kumar',
                full_name='Arun Kumar',
                email='arun.kumar@college.edu',
                department_id=dept.id,
                course_id=course.id,
                year='II',
                semester=3,
                section='A',
                profile_status='COMPLETED',
                is_locked=True,
                user_id=stud1_user.id
            )
            db.add(stud1)
            db.commit()
        else:
            stud1.register_number = '720725115001'
            db.commit()
        
        get_or_create(db, ClassroomMembership, classroom_id=classroom.id, student_id=stud1.id, defaults={
            'status': ClassroomStatus.ACTIVE.value
        })
        
        get_or_create(db, Guardian, student_id=stud1.id, defaults={
            'parent_name': 'S. Kumaravel',
            'relationship': 'Father',
            'phone_number': '+91 94440 98765',
            'occupation': 'Senior Electrical Engineer'
        })
        db.commit()

        print("Seeding Student 2 (12-digit register number: 720725115002)...")
        stud2_user = db.query(User).filter((User.email == 'vignesh.k@college.edu') | (User.username == '720725115002') | (User.username == '23AIM002')).first()
        if not stud2_user:
            stud2_user = User(
                email='vignesh.k@college.edu',
                username='720725115002',
                password_hash=hash_password('Student@360'),
                role=UserRole.STUDENT.value
            )
            db.add(stud2_user)
            db.commit()
        else:
            stud2_user.username = '720725115002'
            db.commit()
        
        stud2 = db.query(Student).filter((Student.email == 'vignesh.k@college.edu') | (Student.register_number == '720725115002') | (Student.register_number == '23AIM002')).first()
        if not stud2:
            stud2 = Student(
                register_number='720725115002',
                first_name='Vignesh',
                last_name='K',
                full_name='Vignesh K',
                email='vignesh.k@college.edu',
                department_id=dept.id,
                course_id=course.id,
                year='II',
                semester=3,
                section='A',
                profile_status='INCOMPLETE',
                is_locked=False,
                user_id=stud2_user.id
            )
            db.add(stud2)
            db.commit()
        else:
            stud2.register_number = '720725115002'
            db.commit()
        
        get_or_create(db, ClassroomMembership, classroom_id=classroom.id, student_id=stud2.id, defaults={
            'status': ClassroomStatus.ACTIVE.value
        })
        db.commit()

        print("Seed data created successfully!")
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()