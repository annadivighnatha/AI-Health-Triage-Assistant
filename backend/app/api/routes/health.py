from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health():
    return {
        "status": "healthy",
        "message": "AI Health Triage Assistant API is running smoothly."
    }