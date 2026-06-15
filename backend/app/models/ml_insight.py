from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base


class MLInsight(Base):
    __tablename__ = "ml_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    insight_type = Column(String(50), nullable=False)  # anomaly, forecast, churn_prediction
    metric_name = Column(String(100), nullable=False)
    confidence_score = Column(Float, nullable=False)  # 0.0 - 1.0
    predicted_value = Column(Float, nullable=True)
    actual_value = Column(Float, nullable=True)
    insight_data = Column(JSON, nullable=True)  # Extra metadata as JSON
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    generated_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="ml_insights")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "insight_type": self.insight_type,
            "metric_name": self.metric_name,
            "confidence_score": self.confidence_score,
            "predicted_value": self.predicted_value,
            "actual_value": self.actual_value,
            "insight_data": self.insight_data,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "generated_at": self.generated_at.isoformat() if self.generated_at else None,
        }
