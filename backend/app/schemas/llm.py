from pydantic import BaseModel


class ExplanationResponse(BaseModel):
    explanation: str

    precautions: list[str]

    recommended_tests: list[str]

    next_steps: list[str]