from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.services.base_service import BaseService


class UserService(BaseService):

    def __init__(self, db: Session):
        super().__init__(UserRepository(db))

    def get_by_email(self, email: str):
        return self.repository.get_by_email(email)