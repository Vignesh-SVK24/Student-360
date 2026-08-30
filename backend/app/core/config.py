from typing import List, Union
import json
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "Student 360 API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api/v1"
    PORT: int = 8000
    HOST: str = "0.0.0.0"

    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://vignesh-svk24.github.io",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                return [i.strip() for i in v.split(",") if i.strip()]
        return v

    DATABASE_URL: str = "sqlite:///./student360.db"

    STORAGE_BACKEND: str = "local"
    STORAGE_BASE_PATH: str = "./uploads"
    STORAGE_BASE_URL: str = "http://localhost:8000/uploads"

    MINIMUM_ATTENDANCE_PERCENTAGE: float = 75.0
    DEFAULT_PASSING_PERCENTAGE: float = 50.0

    SECRET_KEY: str = "student360-dev-super-secret-key-change-in-production-360"
    JWT_SECRET_KEY: str = "student360-jwt-secret-key-production-change-360"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    REFRESH_TOKEN_REMEMBER_DAYS: int = 30
    PASSWORD_RESET_EXPIRE_MINUTES: int = 30
    DEFAULT_STUDENT_INITIAL_PASSWORD: str = "Student@360"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()