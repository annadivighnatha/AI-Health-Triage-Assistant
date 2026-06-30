from sqlalchemy.orm import Session

from app.models.prediction import Prediction
from app.repositories.base_repository import BaseRepository


class PredictionRepository(
    BaseRepository[Prediction]
):

    def __init__(self, db: Session):
        super().__init__(Prediction, db)

    def get_by_consultation_id(
        self,
        consultation_id: int,
    ):
        return (
            self.db.query(Prediction)
            .filter(
                Prediction.consultation_id == consultation_id
            )
            .order_by(
                Prediction.rank.asc()
            )
            .all()
        )

    def get_top_prediction(
        self,
        consultation_id: int,
    ):
        return (
            self.db.query(Prediction)
            .filter(
                Prediction.consultation_id == consultation_id
            )
            .order_by(
                Prediction.rank.asc()
            )
            .first()
        )

    def delete_by_consultation(
        self,
        consultation_id: int,
    ):
        (
            self.db.query(Prediction)
            .filter(
                Prediction.consultation_id == consultation_id
            )
            .delete()
        )

        self.db.commit()