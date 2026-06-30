from sqlalchemy.orm import Session

from app.repositories.consultation_repository import ConsultationRepository
from app.services.base_service import BaseService


class ConsultationService(BaseService):

    def __init__(self, db: Session):
        super().__init__(ConsultationRepository(db))

    def get_user_history(self, user_id: int):
        return self.repository.get_user_history(user_id)