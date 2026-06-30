from pydantic import BaseModel, ConfigDict


class DiseasePrediction(BaseModel):
    disease: str
    confidence: float


class PredictionResponse(BaseModel):
    predictions: list[DiseasePrediction]
    matched_symptoms: list[str]
    urgency: str

    model_config = ConfigDict(from_attributes=True)