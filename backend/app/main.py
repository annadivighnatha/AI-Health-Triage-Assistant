from fastapi import FastAPI

from app.core.config import settings
from app.api.router import api_router
from app.core.constants import APP_DESCRIPTION, API_PREFIX
from app.api.routes.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    debug=settings.DEBUG,
    description=APP_DESCRIPTION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your Next.js dev URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=API_PREFIX)

api_router.include_router(auth_router)

@app.get("/", tags=["Root"])
def root():
    return {
        "application": settings.APP_NAME,
        "status": "running",
    }