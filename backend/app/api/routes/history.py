from fastapi import APIRouter, Depends

from app.api.dependencies import get_consultation_service, get_current_user_id
from app.schemas.history import HistoryItem, HistoryResponse
from app.services.consultation_service import ConsultationService

router = APIRouter(prefix="/history", tags=["History"])


@router.get("", response_model=HistoryResponse)
def get_history(
    user_id: int = Depends(get_current_user_id),
    service: ConsultationService = Depends(get_consultation_service),
):
    consultations = []

    for consultation in service.get_user_history(user_id):
        top_prediction = ""
        if consultation.predictions:
            ordered_predictions = sorted(consultation.predictions, key=lambda item: item.rank)
            top_prediction = ordered_predictions[0].disease

        consultations.append(
            HistoryItem(
                consultation_id=f"cons_{consultation.id}",
                date=consultation.created_at.date().isoformat(),
                top_prediction=top_prediction,
                urgency=consultation.urgency,
            )
        )

    return HistoryResponse(consultations=consultations)
