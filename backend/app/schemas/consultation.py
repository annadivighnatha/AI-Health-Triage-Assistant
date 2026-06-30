from pydantic import BaseModel, ConfigDict

from app.schemas.llm import ExplanationResponse
from app.schemas.prediction import PredictionResponse
from app.schemas.report import DoctorReportResponse


class ConsultationRequest(BaseModel):
    symptoms: list[str]
    age: int
    gender: str
    duration: str


class ConsultationResponse(BaseModel):
    consultation_id: int

    prediction: PredictionResponse

    explanation: ExplanationResponse

    report: DoctorReportResponse

    model_config = ConfigDict(from_attributes=True)