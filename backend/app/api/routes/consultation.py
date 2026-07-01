from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies import get_consultation_service, get_current_user_id
from app.schemas.prediction_flow import ConsultationCreateRequest, ConsultationCreateResponse
from app.services.consultation_service import ConsultationService

router = APIRouter(prefix="/consultation", tags=["Consultation"])


@router.post("", response_model=ConsultationCreateResponse, status_code=status.HTTP_201_CREATED)
def create_consultation(
    request: ConsultationCreateRequest,
    user_id: int = Depends(get_current_user_id),
    service: ConsultationService = Depends(get_consultation_service),
):
    try:
        return service.create_consultation(user_id, request)
    except HTTPException:
        raise
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
