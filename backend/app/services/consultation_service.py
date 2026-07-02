from __future__ import annotations

from sqlalchemy.orm import Session

from app.models.consultation import Consultation
from app.models.doctor_report import DoctorReport
from app.models.prediction import Prediction as PredictionModel
from app.models.symptom import ConsultationSymptom
from app.repositories.consultation_repository import ConsultationRepository
from app.services.base_service import BaseService
from app.schemas.prediction_flow import ConsultationCreateRequest


class ConsultationService(BaseService):
    def __init__(self, db: Session):
        self.db = db
        super().__init__(ConsultationRepository(db))

    def get_user_history(self, user_id: int):
        return self.repository.get_user_history(user_id)

    def create_consultation(
        self,
        user_id: int,
        request: ConsultationCreateRequest,
    ):
        consultation = Consultation(
            user_id=user_id,
            age=request.age,
            gender=request.gender,
            duration=request.duration,
            urgency=request.urgency,
        )
        self.db.add(consultation)
        self.db.flush()

        for symptom in request.symptoms:
            self.db.add(
                ConsultationSymptom(
                    consultation_id=consultation.id,
                    symptom_name=symptom,
                    severity=1,
                )
            )

        self.db.add(
            PredictionModel(
                consultation_id=consultation.id,
                disease=request.prediction.disease,
                confidence=request.prediction.confidence,
                rank=1,
            )
        )

        self.db.add(
            DoctorReport(
                consultation_id=consultation.id,
                summary=request.explanation.explanation,
                precautions=request.explanation.precautions,
                recommended_tests=request.explanation.recommended_tests,
                next_steps=request.explanation.next_steps,
                pdf_path=None,
            )
        )

        self.db.commit()
        self.db.refresh(consultation)

        return {
            "consultation_id": consultation.id,
            "status": "saved",
            "created_at": consultation.created_at.isoformat(),
        }
