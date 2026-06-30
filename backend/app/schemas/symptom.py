from pydantic import BaseModel


class SymptomInput(BaseModel):
    name: str
    severity: int = 1


class SymptomSuggestion(BaseModel):
    symptom: str


class SymptomListResponse(BaseModel):
    symptoms: list[SymptomSuggestion]