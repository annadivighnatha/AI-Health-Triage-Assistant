from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TimestampSchema(BaseModel):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    message: str


class IDResponse(BaseModel):
    id: int


class Pagination(BaseModel):
    page: int
    size: int
    total: int