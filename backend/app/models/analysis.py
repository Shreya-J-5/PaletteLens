import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.db.database import Base

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    source_type = Column(String(50), nullable=False, index=True) # website, image, pdf, file
    source_url = Column(String(2048), nullable=True)
    original_filename = Column(String(512), nullable=True)
    status = Column(String(50), default="pending", nullable=False, index=True) # pending, processing, completed, failed
    progress_step = Column(String(255), default="Initialized", nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    pages = relationship("AnalysisPage", back_populates="analysis", cascade="all, delete-orphan")
    colours = relationship("Colour", back_populates="analysis", cascade="all, delete-orphan")
    assets = relationship("AnalysisAsset", back_populates="analysis", cascade="all, delete-orphan")
