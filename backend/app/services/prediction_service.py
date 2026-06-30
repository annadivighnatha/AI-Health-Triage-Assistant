from sqlalchemy.orm import Session

from app.repositories.prediction_repository import PredictionRepository
from app.services.base_service import BaseService


class PredictionService(BaseService):

    def __init__(self, db: Session):
        super().__init__(PredictionRepository(db))

    def get_predictions(self, consultation_id: int):
        return self.repository.get_by_consultation_id(
            consultation_id
        )

    def get_top_prediction(self, consultation_id: int):
        return self.repository.get_top_prediction(
            consultation_id
        )