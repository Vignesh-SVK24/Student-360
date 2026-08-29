import sys
import os
from datetime import date

# Ensure backend root is in sys.path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal, Base, engine
from app.core.constants import StudentType, Gender, RemarkGrade, AssessmentType, SkillCategory, SkillProficiency
from app.models import (
    Department,
    Course,
    Subject,
    Faculty,
    Student,
    Guardian,
    StudentAcademicBackground,
    SemesterAcademicRecord,
    AcademicAssessment,
    StudentSubjectMarks,
    StudentAttendance,
    Achievement,
    Skill,
    Certificate,
    Project,
    Technology,
    ProfileLink,
    FacultyRemark,
    AuditLog,
)


def seed_database():
    print("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(Student).count() > 0:
            print("Database already contains student records. Clearing old demo data...")
            # Truncate / delete all in child order
            for tbl in reversed(Base.metadata.sorted_tables):
                db.execute(tbl.delete())
            db.commit()

        print("Seeding Departments...")
        dept_aiml = Department(name="Artificial Intelligence & Data Science", code="AIML", description="Department of AI and Data Science")
        dept_cse = Department(name="Computer Science & Engineering", code="CSE", description="Department of CSE")
        dept_ece = Department(name="Electronics & Communication", code="ECE", description="Department of ECE")
        db.add_all([dept_aiml, dept_cse, dept_ece])
        db.commit()

        print("Seeding Courses...")
        course_ai = Course(department_id=dept_aiml.id, name="B.Tech Artificial Intelligence & Data Science", code="BT-AIDS", duration_years=4)
        course_cs = Course(department_id=dept_cse.id, name="B.E. Computer Science & Engineering", code="BE-CSE", duration_years=4)
        db.add_all([course_ai, course_cs])
        db.commit()

        print("Seeding Subjects...")
        sub1 = Subject(course_id=course_ai.id, semester=3, name="Data Structures & Algorithms", code="CS3301", maximum_marks=100.0, credits=4.0)
        sub2 = Subject(course_id=course_ai.id, semester=3, name="Probability and Linear Algebra", code="MA3354", maximum_marks=100.0, credits=4.0)
        sub3 = Subject(course_id=course_ai.id, semester=3, name="Object Oriented Programming with Java", code="CS3391", maximum_marks=100.0, credits=3.0)
        sub4 = Subject(course_id=course_ai.id, semester=4, name="Database Management Systems", code="CS3492", maximum_marks=100.0, credits=3.0)
        sub5 = Subject(course_id=course_ai.id, semester=4, name="Deep Learning Architectures", code="AI3401", maximum_marks=100.0, credits=4.0)
        db.add_all([sub1, sub2, sub3, sub4, sub5])
        db.commit()

        print("Seeding Faculty...")
        fac1 = Faculty(
            faculty_id="FAC-AIML-01",
            name="Dr. S. Ramanujam",
            email="ramanujam.s@college.edu",
            phone_number="+91 94441 23456",
            department_id=dept_aiml.id,
            designation="Professor & Head of Department",
            profile_photo_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
        )
        fac2 = Faculty(
            faculty_id="FAC-AIML-02",
            name="Prof. Meenakshi Sundaram",
            email="meenakshi.s@college.edu",
            phone_number="+91 98410 76543",
            department_id=dept_aiml.id,
            designation="Associate Professor",
            profile_photo_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300",
        )
        db.add_all([fac1, fac2])
        db.commit()

        print("Seeding Technologies...")
        techs = {
            "Python": Technology(name="Python", category="Language"),
            "TensorFlow": Technology(name="TensorFlow", category="ML/AI"),
            "PyTorch": Technology(name="PyTorch", category="ML/AI"),
            "FastAPI": Technology(name="FastAPI", category="Backend"),
            "React": Technology(name="React", category="Frontend"),
            "TypeScript": Technology(name="TypeScript", category="Language"),
            "PostgreSQL": Technology(name="PostgreSQL", category="Database"),
            "Docker": Technology(name="Docker", category="DevOps"),
            "OpenCV": Technology(name="OpenCV", category="Vision"),
            "YOLOv8": Technology(name="YOLOv8", category="Vision"),
        }
        db.add_all(list(techs.values()))
        db.commit()

        print("Seeding 10 Realistic Student 360 Profiles...")
        student_data = [
            {
                "reg": "23AIM001", "fn": "Arun", "ln": "Kumar", "email": "arun.kumar@college.edu", "phone": "+91 98451 23410",
                "dob": date(2005, 5, 14), "gender": Gender.MALE.value, "type": StudentType.DAY_SCHOLAR.value,
                "address": "No. 42, West Coast Road, Anna Nagar, Chennai - 600040", "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
                "p_name": "S. Kumaravel", "p_phone": "+91 94440 98765", "p_rel": "Father", "p_occ": "Senior Electrical Engineer",
                "s10": "St. John's Matriculation (96.4%)", "s12": "DAV Senior Secondary (96.0%)",
                "skills": ["Python", "TensorFlow", "Deep Learning", "React", "TypeScript", "FastAPI"],
                "ach": ("Smart India Hackathon Winner", "SIH 2025 National Grand Finale", "1st Place (Gold)", "Team Lead"),
                "proj": ("HealthAI Diagnostics", "Automated pneumonia detection from chest X-rays using deep convolutional networks.", ["Python", "PyTorch", "FastAPI", "React"]),
                "cert": ("AWS Certified Machine Learning - Specialty", "Amazon Web Services", "https://aws.amazon.com/verify"),
                "rem": (RemarkGrade.EXCELLENT.value, "Exceptional grasp of computer vision paradigms and scalable API architectures. Consistent academic leadership."),
                "att": (45, 41, 4), "cgpa": 8.42, "sgpa": [8.30, 8.54],
            },
            {
                "reg": "23AIM002", "fn": "Vignesh", "ln": "K", "email": "vignesh.k@college.edu", "phone": "+91 94432 87654",
                "dob": date(2005, 9, 22), "gender": Gender.MALE.value, "type": StudentType.HOSTELLER.value,
                "address": "Plot 18, Lake View Colony, Gandhi Road, Coimbatore - 641004", "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                "p_name": "M. Krishnan", "p_phone": "+91 98421 11223", "p_rel": "Father", "p_occ": "Branch Manager, SBI",
                "s10": "Kendriya Vidyalaya (92.8%)", "s12": "SRV Matriculation Higher Secondary (91.2%)",
                "skills": ["PyTorch", "Computer Vision", "OpenCV", "Flask", "Docker", "PostgreSQL"],
                "ach": ("Tamil Nadu State AI Hackathon", "TN AI Mission Grand Challenge", "1st Runner Up", "Vision Lead"),
                "proj": ("Autonomous Drone Obstacle Detection", "Edge-computing drone obstacle detection algorithm with real-time avoidance.", ["Python", "OpenCV", "Docker"]),
                "cert": ("Deep Learning Specialization", "Coursera / DeepLearning.AI", "https://coursera.org/verify"),
                "rem": (RemarkGrade.GOOD.value, "Solid problem solving capability in robotic perception. Recommended to improve theoretical mathematics attendance."),
                "att": (45, 31, 14), "cgpa": 7.45, "sgpa": [7.30, 7.60],
            },
            {
                "reg": "23AIM003", "fn": "Priya", "ln": "Dharshini", "email": "priya.d@college.edu", "phone": "+91 97890 12345",
                "dob": date(2005, 11, 3), "gender": Gender.FEMALE.value, "type": StudentType.DAY_SCHOLAR.value,
                "address": "12/4, Circular Garden Lane, Adyar, Chennai - 600020", "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                "p_name": "Dr. R. Dharshini", "p_phone": "+91 97890 99887", "p_rel": "Mother", "p_occ": "Professor of Biochemistry",
                "s10": "Bala Vidya Mandir (98.2%)", "s12": "Chettinad Vidyashram (97.4%)",
                "skills": ["Python", "NLP", "HuggingFace", "FastAPI", "React", "PostgreSQL"],
                "ach": ("ACM Student Research Paper Award", "International Conference on NLP 2024", "Best Paper", "Primary Author"),
                "proj": ("Multilingual MedVoice Assistant", "Local dialect conversational voice agent for primary health centers in rural districts.", ["Python", "FastAPI", "React"]),
                "cert": ("Hugging Face NLP Specialist", "Hugging Face Academy", "https://huggingface.co/verify"),
                "rem": (RemarkGrade.EXCELLENT.value, "Outstanding dedication to Natural Language Processing research. Active student mentor."),
                "att": (45, 43, 2), "cgpa": 9.15, "sgpa": [9.05, 9.25],
            },
            {
                "reg": "23AIM004", "fn": "Sneha", "ln": "R", "email": "sneha.r@college.edu", "phone": "+91 98401 54321",
                "dob": date(2005, 7, 19), "gender": Gender.FEMALE.value, "type": StudentType.DAY_SCHOLAR.value,
                "address": "55/2, 4th Cross Street, Velachery, Chennai - 600042", "photo": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
                "p_name": "K. Radhakrishnan", "p_phone": "+91 98401 99001", "p_rel": "Father", "p_occ": "Software Architect",
                "s10": "Vidya Mandir Mylapore (95.0%)", "s12": "SBOA Matriculation (94.5%)",
                "skills": ["React", "TypeScript", "Tailwind CSS", "Node.js", "Python", "Docker"],
                "ach": ("Smart Cities App Challenge", "Govt of Tamil Nadu IT Expo", "Winner (1st)", "Frontend Architect"),
                "proj": ("Metropolitan Bus Fleet Live Tracker", "PWA for live urban transit tracking with passenger load estimation.", ["React", "TypeScript", "FastAPI"]),
                "cert": ("Meta Front-End Developer Professional", "Meta / Coursera", "https://coursera.org/verify"),
                "rem": (RemarkGrade.GOOD.value, "Strong intuitive design and frontend systems sense. Dependable project collaborator."),
                "att": (45, 38, 7), "cgpa": 8.12, "sgpa": [8.00, 8.24],
            },
            {
                "reg": "23AIM005", "fn": "Karthi", "ln": "S", "email": "karthi.s@college.edu", "phone": "+91 97102 33445",
                "dob": date(2004, 12, 10), "gender": Gender.MALE.value, "type": StudentType.HOSTELLER.value,
                "address": "88, Cross Cut Road, Gandhipuram, Coimbatore - 641012", "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
                "p_name": "S. Selvaraj", "p_phone": "+91 97102 88776", "p_rel": "Father", "p_occ": "Automobile Business Owner",
                "s10": "Mani Higher Secondary (91.0%)", "s12": "Sri Chaitanya Junior College (89.5%)",
                "skills": ["Python", "Pandas", "Scikit-Learn", "FastAPI", "SQL", "Tableau"],
                "ach": ("National Financial Data Analytics Sprint", "FinTech Summit Bengaluru", "2nd Place", "Data Analyst"),
                "proj": ("Credit Risk Prediction Engine", "Machine learning classification model predicting micro-loan default probabilities.", ["Python", "FastAPI", "PostgreSQL"]),
                "cert": ("IBM Data Science Professional", "IBM", "https://ibm.com/verify"),
                "rem": (RemarkGrade.BETTER.value, "Good analytical acumen. Needs to maintain regularity in submission of laboratory records."),
                "att": (45, 33, 12), "cgpa": 7.68, "sgpa": [7.50, 7.86],
            },
            {
                "reg": "23AIM006", "fn": "Divya", "ln": "Bharathi", "email": "divya.b@college.edu", "phone": "+91 98840 55667",
                "dob": date(2005, 2, 28), "gender": Gender.FEMALE.value, "type": StudentType.DAY_SCHOLAR.value,
                "address": "40, North Usman Road, T. Nagar, Chennai - 600017", "photo": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400",
                "p_name": "B. Natarajan", "p_phone": "+91 98840 11223", "p_rel": "Father", "p_occ": "Chartered Accountant",
                "s10": "Rosary Matriculation (97.0%)", "s12": "Shrine Vailankanni Higher Secondary (96.2%)",
                "skills": ["Python", "TensorFlow", "Computer Vision", "Docker", "PyTorch"],
                "ach": ("Intel AI Global Impact Festival", "Intel Global Education Initiative", "Country Finalist", "Lead Researcher"),
                "proj": ("Paddy Crop Pest Detection Mobile System", "Compact MobileNet model identifying paddy leaf blight and stem borers.", ["Python", "TensorFlow", "Docker"]),
                "cert": ("Intel Edge AI Certification", "Intel", "https://intel.com/verify"),
                "rem": (RemarkGrade.EXCELLENT.value, "High intellectual rigor. Demonstrates practical engineering focus on agriculture challenges."),
                "att": (45, 42, 3), "cgpa": 8.78, "sgpa": [8.65, 8.91],
            },
            {
                "reg": "23AIM007", "fn": "Rahul", "ln": "M", "email": "rahul.m@college.edu", "phone": "+91 94450 77889",
                "dob": date(2005, 8, 15), "gender": Gender.MALE.value, "type": StudentType.HOSTELLER.value,
                "address": "15, Royal Enclave, Salem - 636004", "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400",
                "p_name": "M. Murugan", "p_phone": "+91 94450 11234", "p_rel": "Father", "p_occ": "Civil Contractor",
                "s10": "Holy Cross Matriculation (89.4%)", "s12": "Cluny Vidya Nikethan (88.0%)",
                "skills": ["Python", "Linux", "Docker", "Kubernetes", "FastAPI", "PostgreSQL"],
                "ach": ("Red Hat Open Source Challenge", "Red Hat University Contest", "Finalist", "Systems Engineer"),
                "proj": ("High Availability Distributed Microservices Cluster", "Resilient containerized deployment pipeline for cloud services.", ["Docker", "Python", "FastAPI"]),
                "cert": ("Docker Certified Associate", "Mirantis", "https://docker.com/verify"),
                "rem": (RemarkGrade.AVERAGE.value, "Good practical skills in DevOps. Needs to improve theoretical examination performance."),
                "att": (45, 29, 16), "cgpa": 6.85, "sgpa": [6.70, 7.00],
            },
            {
                "reg": "23AIM008", "fn": "Ananya", "ln": "S", "email": "ananya.s@college.edu", "phone": "+91 97910 88990",
                "dob": date(2005, 4, 11), "gender": Gender.FEMALE.value, "type": StudentType.DAY_SCHOLAR.value,
                "address": "6, 2nd Main Road, Besant Nagar, Chennai - 600090", "photo": "https://images.unsplash.com/photo-1534751516642-a171edd2521b?w=400",
                "p_name": "S. Sundararaman", "p_phone": "+91 97910 22334", "p_rel": "Father", "p_occ": "Vice President, Cognizant",
                "s10": "BVM Global (98.6%)", "s12": "Sishya School (97.8%)",
                "skills": ["Python", "PyTorch", "Reinforcement Learning", "FastAPI", "React"],
                "ach": ("Kaggle Grandmaster Competition Silver", "Kaggle Community", "Silver Medal", "Solo Participant"),
                "proj": ("RL Traffic Signal Optimization Agent", "Deep Q-network optimizing multi-junction urban traffic signal intervals.", ["Python", "PyTorch", "FastAPI"]),
                "cert": ("Reinforcement Learning Specialization", "University of Alberta / Coursera", "https://coursera.org/verify"),
                "rem": (RemarkGrade.EXCELLENT.value, "Top-tier coding standards. Excellent contributor to technical clubs and seminar presentations."),
                "att": (45, 44, 1), "cgpa": 9.40, "sgpa": [9.30, 9.50],
            },
            {
                "reg": "23AIM009", "fn": "Mohammed", "ln": "Farhan", "email": "farhan.m@college.edu", "phone": "+91 98411 66778",
                "dob": date(2005, 10, 5), "gender": Gender.MALE.value, "type": StudentType.DAY_SCHOLAR.value,
                "address": "33, Triplicane High Road, Chennai - 600005", "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400",
                "p_name": "F. Mohammed Ibrahim", "p_phone": "+91 98411 99881", "p_rel": "Father", "p_occ": "Merchant Exporter",
                "s10": "Don Bosco Matriculation (93.5%)", "s12": "St. Bede's Anglo Indian (92.0%)",
                "skills": ["Python", "React", "Node.js", "MongoDB", "PostgreSQL", "Tailwind CSS"],
                "ach": ("Hack-o-Holic 36hr Hackathon", "IEEE Student Branch", "1st Runner Up", "Full Stack Developer"),
                "proj": ("Decentralized Student Credentials Ledger", "Tamper-evident academic certification registry using cryptographic proofs.", ["React", "Python", "FastAPI"]),
                "cert": ("PostgreSQL 15 Advanced Developer", "PostgreSQL Institute", "https://postgres.org/verify"),
                "rem": (RemarkGrade.GOOD.value, "Creative full stack developer. Highly enthusiastic about building real world software products."),
                "att": (45, 36, 9), "cgpa": 7.90, "sgpa": [7.80, 8.00],
            },
            {
                "reg": "23AIM010", "fn": "Swetha", "ln": "P", "email": "swetha.p@college.edu", "phone": "+91 96001 44556",
                "dob": date(2005, 6, 25), "gender": Gender.FEMALE.value, "type": StudentType.HOSTELLER.value,
                "address": "22, VOC Nagar, Thanjavur - 613001", "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
                "p_name": "P. Pandian", "p_phone": "+91 96001 11229", "p_rel": "Father", "p_occ": "Agriculturalist",
                "s10": "Maxworth Matriculation (95.2%)", "s12": "Kalyanasundaram Higher Secondary (94.0%)",
                "skills": ["Python", "Data Science", "SQL", "Scikit-Learn", "FastAPI"],
                "ach": ("State Level Science Exhibition 2024", "Tamil Nadu Science Forum", "Gold Medal", "Presenter"),
                "proj": ("Groundwater Level Forecasting Model", "Time series prediction algorithm forecasting regional water table depths.", ["Python", "FastAPI", "PostgreSQL"]),
                "cert": ("Google Data Analytics Professional Certificate", "Google", "https://coursera.org/verify"),
                "rem": (RemarkGrade.EXCELLENT.value, "Remarkable persistence and clarity in data storytelling. Consistent academic excellence."),
                "att": (45, 40, 5), "cgpa": 8.55, "sgpa": [8.40, 8.70],
            },
        ]

        for s_info in student_data:
            s = Student(
                register_number=s_info["reg"],
                first_name=s_info["fn"],
                last_name=s_info["ln"],
                full_name=f"{s_info['fn']} {s_info['ln']}",
                email=s_info["email"],
                phone_number=s_info["phone"],
                date_of_birth=s_info["dob"],
                gender=s_info["gender"],
                address=s_info["address"],
                profile_photo_url=s_info["photo"],
                department_id=dept_aiml.id,
                course_id=course_ai.id,
                year="II",
                semester=3,
                section="A",
                student_type=s_info["type"],
                active=True,
            )
            db.add(s)
            db.commit()
            db.refresh(s)

            # Guardian
            g = Guardian(
                student_id=s.id,
                parent_name=s_info["p_name"],
                relationship=s_info["p_rel"],
                phone_number=s_info["p_phone"],
                email=f"parent.{s.first_name.lower()}@gmail.com",
                occupation=s_info["p_occ"],
                address=s.address,
                is_primary_contact=True,
            )
            db.add(g)

            # Academic Background
            ab = StudentAcademicBackground(
                student_id=s.id,
                school_10th=s_info["s10"],
                board_10th="State / Matriculation",
                total_marks_10th=480.0,
                maximum_marks_10th=500.0,
                percentage_10th=96.0,
                year_of_passing_10th=2021,
                school_12th=s_info["s12"],
                board_12th="Tamil Nadu State Board",
                total_marks_12th=570.0,
                maximum_marks_12th=600.0,
                percentage_12th=95.0,
                year_of_passing_12th=2023,
            )
            db.add(ab)

            # Semester records
            sr1 = SemesterAcademicRecord(student_id=s.id, semester=1, academic_year="2023-2024", sgpa=s_info["sgpa"][0], cgpa=s_info["sgpa"][0])
            sr2 = SemesterAcademicRecord(student_id=s.id, semester=2, academic_year="2023-2024", sgpa=s_info["sgpa"][1], cgpa=s_info["cgpa"])
            db.add_all([sr1, sr2])

            # Continuous Assessments
            ia1 = AcademicAssessment(student_id=s.id, semester=3, subject="Data Structures & Algorithms", assessment_type=AssessmentType.IA1.value, assessment_name="Unit 1 & 2 Test", maximum_marks=50.0, obtained_marks=44.0, assessment_date=date(2024, 9, 20))
            ia2 = AcademicAssessment(student_id=s.id, semester=3, subject="Probability and Linear Algebra", assessment_type=AssessmentType.IA1.value, assessment_name="Unit 1 & 2 Test", maximum_marks=50.0, obtained_marks=42.0, assessment_date=date(2024, 9, 22))
            db.add_all([ia1, ia2])

            # Subject marks
            sm1 = StudentSubjectMarks(student_id=s.id, subject_id=sub1.id, semester=3, internal_marks=46.0, semester_marks=42.0, total_marks=88.0, grade="A+", grade_points=9.0)
            sm2 = StudentSubjectMarks(student_id=s.id, subject_id=sub2.id, semester=3, internal_marks=44.0, semester_marks=40.0, total_marks=84.0, grade="A+", grade_points=9.0)
            db.add_all([sm1, sm2])

            # Attendance
            tot, pres, absn = s_info["att"]
            pct = round((pres / tot) * 100.0, 2)
            att1 = StudentAttendance(student_id=s.id, subject_id=sub1.id, semester=3, academic_year="2024-2025", total_classes=tot, present_classes=pres, absent_classes=absn, attendance_percentage=pct)
            att2 = StudentAttendance(student_id=s.id, subject_id=sub2.id, semester=3, academic_year="2024-2025", total_classes=tot, present_classes=pres, absent_classes=absn, attendance_percentage=pct)
            db.add_all([att1, att2])

            # Skills
            for sk_name in s_info["skills"]:
                db.add(Skill(student_id=s.id, name=sk_name, category=SkillCategory.PROGRAMMING.value, proficiency_level=SkillProficiency.ADVANCED.value))

            # Achievement
            ach_title, ach_evt, ach_pos, ach_role = s_info["ach"]
            db.add(Achievement(
                student_id=s.id,
                title=ach_title,
                event_name=ach_evt,
                position=ach_pos,
                leadership_role=ach_role,
                description=f"Recognized at {ach_evt} for exemplary engineering presentation.",
                achievement_date=date(2024, 11, 15),
                certificate_url="https://drive.google.com/demo-cert",
            ))

            # Project
            p_title, p_desc, p_t = s_info["proj"]
            proj_obj = Project(
                student_id=s.id,
                title=p_title,
                short_description=p_desc[:120],
                detailed_description=p_desc,
                student_role="Lead Architect",
                github_url=f"https://github.com/{s_info['fn'].lower()}/{p_title.lower().replace(' ', '-')}",
                technologies=[techs[t] for t in p_t if t in techs],
            )
            db.add(proj_obj)

            # Certificate
            c_title, c_org, c_url = s_info["cert"]
            db.add(Certificate(
                student_id=s.id,
                title=c_title,
                issuing_organization=c_org,
                issue_date=date(2024, 8, 1),
                credential_id=f"CERT-{s.register_number}-2024",
                credential_url=c_url,
            ))

            # Profile Links
            db.add(ProfileLink(student_id=s.id, platform="GitHub", url=f"https://github.com/{s_info['fn'].lower()}", is_public=True))
            db.add(ProfileLink(student_id=s.id, platform="LinkedIn", url=f"https://linkedin.com/in/{s_info['fn'].lower()}-{s_info['ln'].lower()}", is_public=True))

            # Faculty Remark
            r_grade, r_text = s_info["rem"]
            db.add(FacultyRemark(
                student_id=s.id,
                faculty_id=fac1.id,
                grade=r_grade,
                remark=r_text,
            ))

            # Audit Log
            db.add(AuditLog(
                action="INITIAL_SEED",
                actor_type="SYSTEM",
                actor_id="seeder",
                entity_type="Student",
                entity_id=str(s.id),
                new_data={"register_number": s.register_number, "full_name": s.full_name},
            ))

            db.commit()

        print(f"Successfully seeded {len(student_data)} complete Student 360 dossiers!")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()