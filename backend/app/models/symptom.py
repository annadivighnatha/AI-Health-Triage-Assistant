from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.base_model import BaseModel


class ConsultationSymptom(Base, BaseModel):
    __tablename__ = "consultation_symptoms"

    consultation_id: Mapped[int] = mapped_column(
        ForeignKey("consultations.id")
    )

    symptom_name: Mapped[str] = mapped_column(
        String(100)
    )

    severity: Mapped[int] = mapped_column(
        Integer,
        default=1
    )

    consultation = relationship(
        "Consultation",
        back_populates="symptoms"
    )