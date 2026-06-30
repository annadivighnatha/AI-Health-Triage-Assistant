from datetime import datetime

from pydantic import BaseModel


class HistoryItem(BaseModel):
    consultation_id: int

    date: datetime

    disease: str

    urgency: str


class HistoryResponse(BaseModel):
    consultations: list[HistoryItem]