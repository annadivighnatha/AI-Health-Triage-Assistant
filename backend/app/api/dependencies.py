from fastapi import Depends
from fastapi import Header, HTTPException, status
from sqlalchemy.orm import Session

from jose import JWTError

from app.database.session import SessionLocal
from app.core.security import decode_access_token
from app.services.consultation_service import ConsultationService
from app.services.prediction_service import PredictionService
from app.services.user_service import UserService
from app.services.auth_service import AuthService


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def get_user_service(
    db: Session = Depends(get_db),
):
    return UserService(db)


def get_consultation_service(
    db: Session = Depends(get_db),
):
    return ConsultationService(db)

def get_auth_service(
    db: Session = Depends(get_db),
):
    return AuthService(db)


def get_prediction_service():
    return PredictionService()


def get_current_user_id(
    authorization: str | None = Header(default=None),
) -> int:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = authorization.split(" ", 1)[1].strip()
    try:
        return int(decode_access_token(token))
    except (ValueError, JWTError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
