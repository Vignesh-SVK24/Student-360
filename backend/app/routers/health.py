from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/health", tags=["Health & Status"])


@router.get("", response_model=ApiResponse[dict])
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint checking API runtime and database connectivity."""
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)[:50]}"

    return ApiResponse(
        success=db_status == "healthy",
        message="System health status",
        data={
            "status": "healthy" if db_status == "healthy" else "degraded",
            "api": "online",
            "database": db_status,
            "version": "1.0.0",
        },
    )