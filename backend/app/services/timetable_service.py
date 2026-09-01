from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.timetable import TimetableSlot
from app.models.department import Department
from app.models.classroom import FacultySubjectAssignment
from app.models.faculty import Faculty
from app.schemas.timetable import (
    TimetableSlotResponse,
    TimetableSlotUpdate,
    DayTimetable,
    WeeklyTimetableResponse,
    PeriodCreate,
)
from app.core.exceptions import NotFoundException, BadRequestException

DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

DEFAULT_SCHEDULE = {
    "Monday": [
        {"period": 1, "start": "09:00 AM", "end": "10:00 AM", "subject": "Deep Learning Architectures", "code": "AI8401", "room": "LH-301", "faculty": "Dr. Sarah Jenkins"},
        {"period": 2, "start": "10:00 AM", "end": "11:00 AM", "subject": "Natural Language Processing", "code": "AI8402", "room": "LH-301", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 3, "start": "11:15 AM", "end": "12:15 PM", "subject": "Cloud & Distributed Systems", "code": "CS8403", "room": "Lab 2", "faculty": "Prof. M. Ramanujam"},
        {"period": 4, "start": "12:15 PM", "end": "01:15 PM", "subject": "Machine Learning Lab", "code": "AI8411", "room": "AI Computing Lab", "faculty": "Dr. Sarah Jenkins"},
        {"period": 5, "start": "02:00 PM", "end": "03:00 PM", "subject": "Machine Learning Lab", "code": "AI8411", "room": "AI Computing Lab", "faculty": "Dr. Sarah Jenkins"},
        {"period": 6, "start": "03:00 PM", "end": "04:00 PM", "subject": "Engineering Optimization", "code": "MA8401", "room": "LH-301", "faculty": "Dr. R. Meenakshi"},
        {"period": 7, "start": "04:00 PM", "end": "04:50 PM", "subject": "Mentorship & Project Guidance", "code": "MC8401", "room": "Dept Seminar Hall", "faculty": "All Faculty"},
    ],
    "Tuesday": [
        {"period": 1, "start": "09:00 AM", "end": "10:00 AM", "subject": "Big Data Technologies", "code": "DS8401", "room": "LH-302", "faculty": "Dr. P. Rajesh"},
        {"period": 2, "start": "10:00 AM", "end": "11:00 AM", "subject": "Deep Learning Architectures", "code": "AI8401", "room": "LH-301", "faculty": "Dr. Sarah Jenkins"},
        {"period": 3, "start": "11:15 AM", "end": "12:15 PM", "subject": "AI Ethics & Governance", "code": "AI8404", "room": "LH-301", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 4, "start": "12:15 PM", "end": "01:15 PM", "subject": "Computer Vision", "code": "AI8403", "room": "LH-301", "faculty": "Prof. M. Ramanujam"},
        {"period": 5, "start": "02:00 PM", "end": "03:00 PM", "subject": "NLP & Speech Processing Lab", "code": "AI8412", "room": "Language Lab", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 6, "start": "03:00 PM", "end": "04:00 PM", "subject": "NLP & Speech Processing Lab", "code": "AI8412", "room": "Language Lab", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 7, "start": "04:00 PM", "end": "04:50 PM", "subject": "Technical Seminar", "code": "AI8413", "room": "Dept Seminar Hall", "faculty": "Prof. M. Ramanujam"},
    ],
    "Wednesday": [
        {"period": 1, "start": "09:00 AM", "end": "10:00 AM", "subject": "Natural Language Processing", "code": "AI8402", "room": "LH-301", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 2, "start": "10:00 AM", "end": "11:00 AM", "subject": "Cloud & Distributed Systems", "code": "CS8403", "room": "Lab 2", "faculty": "Prof. M. Ramanujam"},
        {"period": 3, "start": "11:15 AM", "end": "12:15 PM", "subject": "Computer Vision", "code": "AI8403", "room": "LH-301", "faculty": "Prof. M. Ramanujam"},
        {"period": 4, "start": "12:15 PM", "end": "01:15 PM", "subject": "Big Data Technologies", "code": "DS8401", "room": "LH-302", "faculty": "Dr. P. Rajesh"},
        {"period": 5, "start": "02:00 PM", "end": "03:00 PM", "subject": "Generative AI Research & Lab", "code": "AI8414", "room": "Innovation Hub", "faculty": "Dr. Sarah Jenkins"},
        {"period": 6, "start": "03:00 PM", "end": "04:00 PM", "subject": "Generative AI Research & Lab", "code": "AI8414", "room": "Innovation Hub", "faculty": "Dr. Sarah Jenkins"},
        {"period": 7, "start": "04:00 PM", "end": "04:50 PM", "subject": "Library / MOOC Study", "code": "MOOC84", "room": "Central Digital Library", "faculty": "Staff In-charge"},
    ],
    "Thursday": [
        {"period": 1, "start": "09:00 AM", "end": "10:00 AM", "subject": "Engineering Optimization", "code": "MA8401", "room": "LH-301", "faculty": "Dr. R. Meenakshi"},
        {"period": 2, "start": "10:00 AM", "end": "11:00 AM", "subject": "Deep Learning Architectures", "code": "AI8401", "room": "LH-301", "faculty": "Dr. Sarah Jenkins"},
        {"period": 3, "start": "11:15 AM", "end": "12:15 PM", "subject": "Natural Language Processing", "code": "AI8402", "room": "LH-301", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 4, "start": "12:15 PM", "end": "01:15 PM", "subject": "AI Ethics & Governance", "code": "AI8404", "room": "LH-301", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 5, "start": "02:00 PM", "end": "03:00 PM", "subject": "Cloud Deployment Lab", "code": "CS8413", "room": "Cloud Computing Center", "faculty": "Prof. M. Ramanujam"},
        {"period": 6, "start": "03:00 PM", "end": "04:00 PM", "subject": "Cloud Deployment Lab", "code": "CS8413", "room": "Cloud Computing Center", "faculty": "Prof. M. Ramanujam"},
        {"period": 7, "start": "04:00 PM", "end": "04:50 PM", "subject": "Placement Aptitude & Coding", "code": "TP8401", "room": "Auditorium", "faculty": "Training Dept"},
    ],
    "Friday": [
        {"period": 1, "start": "09:00 AM", "end": "10:00 AM", "subject": "Computer Vision", "code": "AI8403", "room": "LH-301", "faculty": "Prof. M. Ramanujam"},
        {"period": 2, "start": "10:00 AM", "end": "11:00 AM", "subject": "Big Data Technologies", "code": "DS8401", "room": "LH-302", "faculty": "Dr. P. Rajesh"},
        {"period": 3, "start": "11:15 AM", "end": "12:15 PM", "subject": "Cloud & Distributed Systems", "code": "CS8403", "room": "Lab 2", "faculty": "Prof. M. Ramanujam"},
        {"period": 4, "start": "12:15 PM", "end": "01:15 PM", "subject": "Engineering Optimization", "code": "MA8401", "room": "LH-301", "faculty": "Dr. R. Meenakshi"},
        {"period": 5, "start": "02:00 PM", "end": "03:00 PM", "subject": "Hackathon & Capstone Studio", "code": "PR8401", "room": "Incubation Cell", "faculty": "Dr. Sarah Jenkins"},
        {"period": 6, "start": "03:00 PM", "end": "04:00 PM", "subject": "Hackathon & Capstone Studio", "code": "PR8401", "room": "Incubation Cell", "faculty": "Dr. Sarah Jenkins"},
        {"period": 7, "start": "04:00 PM", "end": "04:50 PM", "subject": "Club & Extra-Curricular Activities", "code": "ECA84", "room": "Campus Grounds", "faculty": "Activity In-charge"},
    ],
    "Saturday": [
        {"period": 1, "start": "09:00 AM", "end": "10:00 AM", "subject": "Industry Expert Masterclass", "code": "IE8401", "room": "Virtual Seminar Hall", "faculty": "Guest Lecturer"},
        {"period": 2, "start": "10:00 AM", "end": "11:00 AM", "subject": "Applied Generative AI Workshop", "code": "WS8401", "room": "AI Lab 1", "faculty": "Dr. Sarah Jenkins"},
        {"period": 3, "start": "11:15 AM", "end": "12:15 PM", "subject": "Applied Generative AI Workshop", "code": "WS8401", "room": "AI Lab 1", "faculty": "Dr. Sarah Jenkins"},
        {"period": 4, "start": "12:15 PM", "end": "01:15 PM", "subject": "Weekly Quiz & Skill Assessment", "code": "AS8401", "room": "Exam Hall 2", "faculty": "Dr. K. Senthil Nathan"},
        {"period": 5, "start": "02:00 PM", "end": "03:00 PM", "subject": "Open Source Contribution Hour", "code": "OS8401", "room": "Open Computing Lab", "faculty": "Prof. M. Ramanujam"},
        {"period": 6, "start": "03:00 PM", "end": "04:00 PM", "subject": "Remedial Coaching & Doubts Session", "code": "RC8401", "room": "LH-301", "faculty": "All Faculty"},
        {"period": 7, "start": "04:00 PM", "end": "04:50 PM", "subject": "Sports / Fitness / Yoga", "code": "PED84", "room": "Sports Complex", "faculty": "Physical Director"},
    ],
}


class TimetableService:
    def __init__(self, db: Session):
        self.db = db

    def initialize_if_empty(self, classroom_id: Optional[int] = None) -> None:
        """Seed standard 6-day curriculum timetable if no slots exist."""
        query = self.db.query(TimetableSlot)
        if classroom_id:
            query = query.filter(TimetableSlot.classroom_id == classroom_id)
        count = query.count()

        if count == 0:
            dept = self.db.query(Department).first()
            dept_id = dept.id if dept else None

            for day, periods in DEFAULT_SCHEDULE.items():
                for p in periods:
                    slot = TimetableSlot(
                        classroom_id=classroom_id,
                        day_of_week=day,
                        period_number=p["period"],
                        start_time=p["start"],
                        end_time=p["end"],
                        subject_name=p["subject"],
                        subject_code=p["code"],
                        entry_type="SUBJECT",
                        room=p["room"],
                        faculty_name=p["faculty"],
                        department_id=dept_id,
                    )
                    self.db.add(slot)
            self.db.commit()

    def get_weekly_timetable(self, classroom_id: Optional[int] = None) -> WeeklyTimetableResponse:
        self.initialize_if_empty(classroom_id)
        query = self.db.query(TimetableSlot)
        if classroom_id:
            query = query.filter(TimetableSlot.classroom_id == classroom_id)
        all_slots = query.all()

        days_map = {d: [] for d in DAYS_ORDER}
        for slot in all_slots:
            if slot.day_of_week in days_map:
                days_map[slot.day_of_week].append(TimetableSlotResponse.model_validate(slot))

        days_list = []
        for day in DAYS_ORDER:
            slots = sorted(days_map[day], key=lambda s: s.period_number)
            days_list.append(DayTimetable(day=day, slots=slots))

        return WeeklyTimetableResponse(classroom_id=classroom_id, days=days_list)

    def update_slot(self, slot_id: int, update_data: TimetableSlotUpdate) -> TimetableSlotResponse:
        slot = self.db.query(TimetableSlot).filter(TimetableSlot.id == slot_id).first()
        if not slot:
            raise NotFoundException(f"Timetable slot #{slot_id} not found", "SLOT_NOT_FOUND")

        if update_data.subject_name is not None:
            slot.subject_name = update_data.subject_name.strip()
        if update_data.subject_code is not None:
            slot.subject_code = update_data.subject_code.strip()
        if update_data.entry_type is not None:
            slot.entry_type = update_data.entry_type.strip()
        if update_data.start_time is not None:
            slot.start_time = update_data.start_time.strip()
        if update_data.end_time is not None:
            slot.end_time = update_data.end_time.strip()
        if update_data.room is not None:
            slot.room = update_data.room.strip()
        if update_data.faculty_name is not None:
            slot.faculty_name = update_data.faculty_name.strip()
        if update_data.faculty_id is not None:
            slot.faculty_id = update_data.faculty_id
        if update_data.subject_id is not None:
            slot.subject_id = update_data.subject_id

        self.db.commit()
        self.db.refresh(slot)
        return TimetableSlotResponse.model_validate(slot)

    def add_period_row(self, data: PeriodCreate) -> WeeklyTimetableResponse:
        """Add a new period slot across all 6 days."""
        query = self.db.query(TimetableSlot)
        if data.classroom_id:
            query = query.filter(TimetableSlot.classroom_id == data.classroom_id)
        
        # Determine next period number
        existing_slots = query.filter(TimetableSlot.day_of_week == "Monday").all()
        next_period = len(existing_slots) + 1

        for day in DAYS_ORDER:
            slot = TimetableSlot(
                classroom_id=data.classroom_id,
                day_of_week=day,
                period_number=next_period,
                start_time=data.start_time,
                end_time=data.end_time,
                subject_name=data.subject_name or "Free Period",
                subject_code=data.subject_code,
                entry_type=data.entry_type or "SUBJECT",
            )
            self.db.add(slot)
        self.db.commit()
        return self.get_weekly_timetable(data.classroom_id)

    def delete_period_row(self, period_number: int, classroom_id: Optional[int] = None) -> WeeklyTimetableResponse:
        """Delete a period row across all 6 days."""
        query = self.db.query(TimetableSlot).filter(TimetableSlot.period_number == period_number)
        if classroom_id:
            query = query.filter(TimetableSlot.classroom_id == classroom_id)
        query.delete()
        self.db.commit()
        return self.get_weekly_timetable(classroom_id)

    def reset_schedule(self, classroom_id: Optional[int] = None) -> WeeklyTimetableResponse:
        """Reset timetable to factory defaults."""
        query = self.db.query(TimetableSlot)
        if classroom_id:
            query = query.filter(TimetableSlot.classroom_id == classroom_id)
        query.delete()
        self.db.commit()
        self.initialize_if_empty(classroom_id)
        return self.get_weekly_timetable(classroom_id)

