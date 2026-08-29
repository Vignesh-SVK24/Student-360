from typing import List, Optional


def calculate_attendance_percentage(present: int, total: int) -> float:
    if total <= 0:
        return 0.0
    pct = (present / total) * 100.0
    return round(min(100.0, max(0.0, pct)), 2)


def calculate_cgpa(sgpas: List[float]) -> float:
    valid = [s for s in sgpas if s is not None and s > 0]
    if not valid:
        return 0.0
    return round(sum(valid) / len(valid), 2)


def sanitize_search_query(query: Optional[str]) -> Optional[str]:
    if not query:
        return None
    cleaned = query.strip()
    return cleaned if cleaned else None