from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    symptoms: list[str] = Field(min_length=1, max_length=25)


class DiseasePrediction(BaseModel):
    disease: str
    confidence: float
    probability: float
    similarity: float
    final_score: float
    matched_symptoms: list[str]
    missing_symptoms: list[str]


class PredictionResponse(BaseModel):
    predictions: list[DiseasePrediction]

    model_config = ConfigDict(from_attributes=True)
