from dataclasses import dataclass


@dataclass(slots=True)
class Prediction:

    disease: str

    confidence: float


@dataclass(slots=True)
class PredictionResponse:

    predictions: list[Prediction]