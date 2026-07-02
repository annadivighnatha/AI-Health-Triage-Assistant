from pydantic import BaseModel, ConfigDict


class HistoryItem(BaseModel):
    consultation_id: str
    date: str
    top_prediction: str
    urgency: str

    model_config = ConfigDict(from_attributes=True)


class HistoryResponse(BaseModel):
    consultations: list[HistoryItem]

    model_config = ConfigDict(from_attributes=True)
