from fastapi import APIRouter

from app.api.routes import consultation
from app.api.routes import explain
from app.api.routes import health
from app.api.routes import prediction

api_router = APIRouter()

api_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health"],
)

api_router.include_router(
    prediction.router,
)

api_router.include_router(
    explain.router,
)

api_router.include_router(
    consultation.router,
)
