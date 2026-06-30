from sqlalchemy.orm import Session

from app.models.consultation import Consultation
from app.repositories.base_repository import BaseRepository


class ConsultationRepository(
    BaseRepository[Consultation]
):

    def __init__(self, db: Session):
        super().__init__(Consultation, db)

    def get_user_history(
        self,
        user_id: int,
    ):
        return (
            self.db.query(Consultation)
            .filter(
                Consultation.user_id == user_id
            )
            .order_by(
                Consultation.created_at.desc()
            )
            .all()
        )