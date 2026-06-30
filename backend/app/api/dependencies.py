from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.session import SessionLocal
from app.services.consultation_service import ConsultationService
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