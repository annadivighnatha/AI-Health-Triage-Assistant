from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.base_model import BaseModel


class Consultation(Base, BaseModel):
    __tablename__ = "consultations"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id")
    )

    age: Mapped[int] = mapped_column(Integer)

    gender: Mapped[str] = mapped_column(String(20))

    duration: Mapped[str] = mapped_column(String(100))

    urgency: Mapped[str] = mapped_column(String(20))

    user = relationship(
        "User",
        back_populates="consultations"
    )

    symptoms = relationship(
        "ConsultationSymptom",
        back_populates="consultation",
        cascade="all, delete-orphan"
    )

    predictions = relationship(
        "Prediction",
        back_populates="consultation",
        cascade="all, delete-orphan"
    )

    report = relationship(
        "DoctorReport",
        back_populates="consultation",
        uselist=False,
        cascade="all, delete-orphan"
    )