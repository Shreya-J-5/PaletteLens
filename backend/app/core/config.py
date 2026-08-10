import os
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env")))

class Settings(BaseSettings):
    PROJECT_NAME: str = "PaletteLens"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./palettelens.db"
    )
    
    # Redis & Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Security & Limits
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(50 * 1024 * 1024))) # 50MB
    MAX_CRAWL_PAGES: int = int(os.getenv("MAX_CRAWL_PAGES", "20"))
    CRAWL_TIMEOUT: int = int(os.getenv("CRAWL_TIMEOUT", "30")) # Seconds
    MAX_ANALYSIS_COLOURS: int = int(os.getenv("MAX_ANALYSIS_COLOURS", "40"))
    
    # Storage
    UPLOADS_DIR: str = os.getenv("UPLOADS_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../uploads")))

    class Config:
        case_sensitive = True

settings = Settings()
