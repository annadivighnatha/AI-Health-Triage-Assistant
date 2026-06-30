from pydantic import BaseModel, ConfigDict


class DoctorReportResponse(BaseModel):
    summary: str

    precautions: list[str]

    recommended_tests: list[str]

    next_steps: list[str]

    pdf_url: str | None = None

    model_config = ConfigDict(from_attributes=True)