from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest


class AuthService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def register(
        self,
        request: RegisterRequest,
    ):
        existing_user = self.user_repository.get_by_email(
            request.email
        )

        if existing_user:
            raise ValueError("Email already exists")

        user = User(
            name=request.name,
            email=request.email,
            password_hash=hash_password(request.password),
        )

        return self.user_repository.create(user)

    def login(
        self,
        request: LoginRequest,
    ):
        user = self.user_repository.get_by_email(
            request.email
        )

        if not user:
            raise ValueError("Invalid credentials")

        if not verify_password(
            request.password,
            user.password_hash,
        ):
            raise ValueError("Invalid credentials")

        token = create_access_token(str(user.id))

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }