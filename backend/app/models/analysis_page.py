import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class AnalysisPage(Base):
    __tablename__ = "analysis_pages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String(2048), nullable=False)
    page_title = Column(String(512), nullable=True)
    screenshot_path = Column(String(1024), nullable=True)
    status = Column(String(50), default="completed", nullable=False) # completed, failed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    analysis = relationship("Analysis", back_populates="pages")
    colours = relationship("Colour", back_populates="page", cascade="all, delete-orphan")
