from sqlalchemy import Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.base_model import BaseModel


class Prediction(Base, BaseModel):
    __tablename__ = "predictions"

    consultation_id: Mapped[int] = mapped_column(
        ForeignKey("consultations.id")
    )

    disease: Mapped[str] = mapped_column(
        String(150)
    )

    confidence: Mapped[float] = mapped_column(
        Float
    )

    rank: Mapped[int] = mapped_column(
        Integer
    )

    consultation = relationship(
        "Consultation",
        back_populates="predictions"
    )