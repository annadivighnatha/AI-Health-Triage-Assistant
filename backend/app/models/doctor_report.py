from sqlalchemy import ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.models.base_model import BaseModel


class DoctorReport(Base, BaseModel):
    __tablename__ = "doctor_reports"

    consultation_id: Mapped[int] = mapped_column(
        ForeignKey("consultations.id"),
        unique=True
    )

    summary: Mapped[str] = mapped_column(String)

    precautions: Mapped[list] = mapped_column(JSON)

    recommended_tests: Mapped[list] = mapped_column(JSON)

    next_steps: Mapped[list] = mapped_column(JSON)

    pdf_path: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    consultation = relationship(
        "Consultation",
        back_populates="report"
    )