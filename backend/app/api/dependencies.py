from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from jose import JWTError

from app.database.session import SessionLocal
from app.core.security import decode_access_token

from app.services.consultation_service import ConsultationService
from app.services.prediction_service import PredictionService
from app.services.user_service import UserService
from app.services.auth_service import AuthService


# OAuth2 JWT Authentication
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/login"
)


# Database dependency
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# User Service dependency
def get_user_service(
    db: Session = Depends(get_db),
):
    return UserService(db)


# Consultation Service dependency
def get_consultation_service(
    db: Session = Depends(get_db),
):
    return ConsultationService(db)


# Authentication Service dependency
def get_auth_service(
    db: Session = Depends(get_db),
):
    return AuthService(db)


# Prediction Service dependency
def get_prediction_service():
    return PredictionService()


# Current User Authentication
def get_current_user_id(
    token: str = Depends(oauth2_scheme),
) -> int:

    try:
        user_id = decode_access_token(token)

        return int(user_id)

    except (ValueError, JWTError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )