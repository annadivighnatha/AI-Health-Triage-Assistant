from __future__ import annotations

import logging
import sys
from dataclasses import asdict
from pathlib import Path

from app.schemas.prediction import PredictionRequest, PredictionResponse

LOGGER = logging.getLogger(__name__)
ROOT_DIR = Path(__file__).resolve().parents[3]
ML_SERVICE_DIR = ROOT_DIR / "ml-service"

if str(ML_SERVICE_DIR) not in sys.path:
    sys.path.insert(0, str(ML_SERVICE_DIR))

from inference.predictor import Predictor  # noqa: E402


class PredictionService:
    def __init__(self, predictor: Predictor | None = None):
        self.predictor = predictor or Predictor()

    def predict(self, request: PredictionRequest) -> PredictionResponse:
        LOGGER.info("Running prediction for %s symptoms", len(request.symptoms))
        result = self.predictor.predict_top3(request.symptoms)
        return PredictionResponse.model_validate(asdict(result))
