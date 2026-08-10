import os
import tempfile
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

# Load environment variables from .env file
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../.env")))

def get_writable_uploads_dir() -> str:
    env_dir = os.getenv("UPLOADS_DIR")
    if env_dir:
        try:
            os.makedirs(env_dir, exist_ok=True)
            return env_dir
        except Exception:
            pass

    # Try root uploads directory
    local_uploads = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../uploads"))
    try:
        os.makedirs(local_uploads, exist_ok=True)
        # Verify write permissions
        test_file = os.path.join(local_uploads, ".writable_test")
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
        return local_uploads
    except Exception:
        # Fallback to system temp directory (e.g. /tmp on Vercel/Linux)
        tmp_uploads = os.path.join(tempfile.gettempdir(), "palettelens_uploads")
        os.makedirs(tmp_uploads, exist_ok=True)
        return tmp_uploads

def get_writable_db_url() -> str:
    env_db = os.getenv("DATABASE_URL")
    if env_db:
        return env_db

    # Default sqlite db URL
    local_db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../palettelens.db"))
    try:
        # Test if parent directory is writable
        parent_dir = os.path.dirname(local_db_path)
        if os.access(parent_dir, os.W_OK) and not os.getenv("VERCEL"):
            return f"sqlite:///{local_db_path}"
    except Exception:
        pass

    # Fallback to temp directory sqlite database for Vercel/Serverless
    tmp_db_path = os.path.join(tempfile.gettempdir(), "palettelens.db")
    return f"sqlite:///{tmp_db_path}"

class Settings(BaseSettings):
    PROJECT_NAME: str = "PaletteLens"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = get_writable_db_url()
    
    # Redis & Celery
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # Security & Limits
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-in-production")
    MAX_FILE_SIZE: int = int(os.getenv("MAX_FILE_SIZE", str(50 * 1024 * 1024))) # 50MB
    MAX_CRAWL_PAGES: int = int(os.getenv("MAX_CRAWL_PAGES", "20"))
    CRAWL_TIMEOUT: int = int(os.getenv("CRAWL_TIMEOUT", "30")) # Seconds
    MAX_ANALYSIS_COLOURS: int = int(os.getenv("MAX_ANALYSIS_COLOURS", "40"))
    
    # Storage
    UPLOADS_DIR: str = get_writable_uploads_dir()

    class Config:
        case_sensitive = True

settings = Settings()
