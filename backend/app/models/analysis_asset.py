import uuid
from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class AnalysisAsset(Base):
    __tablename__ = "analysis_assets"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    file_path = Column(String(1024), nullable=False)
    asset_type = Column(String(50), nullable=False) # screenshot, rendered_pdf, original_upload
    metadata_json = Column(Text, nullable=True)

    # Relationships
    analysis = relationship("Analysis", back_populates="assets")
