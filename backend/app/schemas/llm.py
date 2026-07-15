from pydantic import BaseModel, Field


class SpecialistRecommendation(BaseModel):
    specialty: str
    reason: str
    urgency: str | None = None


class SpecialistResponse(BaseModel):
    specialists: list[SpecialistRecommendation]


class ExplanationResponse(BaseModel):
    explanation: str

    precautions: list[str]

    recommended_tests: list[str]

    next_steps: list[str]

    foods_to_eat: list[str]

    foods_to_avoid: list[str]

    specialists: list[SpecialistRecommendation] = Field(default_factory=list)
