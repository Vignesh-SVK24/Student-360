import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import Base, engine
from app.core.exceptions import AppException
from app.routers.api import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("student360")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Student 360 API Backend...")
    # Create tables if not existing (e.g. in dev/sqlite mode)
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema verified.")
    yield
    logger.info("Shutting down Student 360 API Backend...")


app = FastAPI(
    title="Student 360 API",
    description=(
        "Comprehensive College Student Information & Portfolio Management System Backend API. "
        "Engineered with clean layered architecture: Routers -> Services -> Repositories -> SQLAlchemy ORM."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.message,
            "error_code": exc.error_code,
            "details": exc.details,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        errors.append({"field": loc, "message": err.get("msg")})

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Input validation error",
            "error_code": "VALIDATION_ERROR",
            "details": errors,
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled system error: {str(exc)}", exc_info=settings.DEBUG)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred. Please contact the administrator.",
            "error_code": "INTERNAL_SERVER_ERROR",
        },
    )


# Root welcome
@app.get("/", tags=["System"])
def root():
    return {
        "name": "Student 360 API",
        "version": "1.0.0",
        "status": "online",
        "documentation": "/docs",
        "api_prefix": settings.API_PREFIX,
    }


# Include v1 API routes
app.include_router(api_router, prefix=settings.API_PREFIX)