from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas.prediction_flow import ExplainRequest, ExplainResponse
from app.services.llm_service import LLMService

router = APIRouter(prefix="/explain", tags=["Explanation"])


@router.post("", response_model=ExplainResponse, status_code=status.HTTP_200_OK)
def explain(request: ExplainRequest):
    try:
        print(f"Received explain request===========>: {request}")
        return LLMService().explain(request)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )
