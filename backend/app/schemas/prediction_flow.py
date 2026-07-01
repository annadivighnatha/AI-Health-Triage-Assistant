from pydantic import BaseModel, ConfigDict, Field

from app.schemas.llm import ExplanationResponse


class PredictionSummary(BaseModel):
    disease: str
    confidence: float = Field(ge=0, le=1)


class ExplainRequest(BaseModel):
    disease: str
    confidence: float = Field(ge=0, le=1)
    matched_symptoms: list[str]
    missing_symptoms: list[str] = Field(default_factory=list)
    all_symptoms: list[str] = Field(default_factory=list)
    age: int | None = None
    gender: str | None = None
    duration: str | None = None


class ExplainResponse(ExplanationResponse):
    model_config = ConfigDict(from_attributes=True)


class ConsultationCreateRequest(BaseModel):
    symptoms: list[str]
    age: int
    gender: str
    duration: str
    prediction: PredictionSummary
    explanation: ExplanationResponse
    urgency: str


class ConsultationCreateResponse(BaseModel):
    consultation_id: int
    status: str
    created_at: str

    model_config = ConfigDict(from_attributes=True)
