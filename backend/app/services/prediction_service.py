from __future__ import annotations

import logging

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)

from app.services.ml_client import MLClient


LOGGER = logging.getLogger(__name__)


class PredictionService:

    def __init__(
        self,
        client: MLClient | None = None,
    ):
        self.client = client or MLClient()


    async def predict(
        self,
        request: PredictionRequest,
    ) -> PredictionResponse:

        LOGGER.info(
            "Running prediction for %s symptoms",
            len(request.symptoms),
        )

        result = await self.client.predict(
            request.symptoms
        )

        return PredictionResponse.model_validate(
            result
        )