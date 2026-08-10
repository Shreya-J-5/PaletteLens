import uuid
from sqlalchemy import Column, String, Float, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Colour(Base):
    __tablename__ = "colours"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    analysis_id = Column(String(36), ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    page_id = Column(String(36), ForeignKey("analysis_pages.id", ondelete="CASCADE"), nullable=True, index=True)
    hex = Column(String(10), nullable=False, index=True)
    rgb_r = Column(Integer, nullable=False)
    rgb_g = Column(Integer, nullable=False)
    rgb_b = Column(Integer, nullable=False)
    hsl_h = Column(Float, nullable=False)
    hsl_s = Column(Float, nullable=False)
    hsl_l = Column(Float, nullable=False)
    lab_l = Column(Float, nullable=False)
    lab_a = Column(Float, nullable=False)
    lab_b = Column(Float, nullable=False)
    usage_percentage = Column(Float, default=0.0, nullable=False)
    colour_role = Column(String(50), nullable=True) # Background, Surface, Text, Primary, Secondary, Accent, Border, Highlight
    role_confidence = Column(String(20), default="Inferred", nullable=True) # Detected, Inferred
    occurrence_count = Column(Integer, default=1, nullable=False)

    # Relationships
    analysis = relationship("Analysis", back_populates="colours")
    page = relationship("AnalysisPage", back_populates="colours")
