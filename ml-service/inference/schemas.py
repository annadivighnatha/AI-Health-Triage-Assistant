from dataclasses import dataclass


@dataclass(slots=True)
class Prediction:

    disease: str

    confidence: float

    probability: float

    similarity: float

    final_score: float

    matched_symptoms: list[str]

    missing_symptoms: list[str]


@dataclass(slots=True)
class PredictionResponse:

    predictions: list[Prediction]
