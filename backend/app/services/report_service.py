from sqlalchemy.orm import Session

from app.repositories.doctor_report_repository import (
    DoctorReportRepository,
)
from app.services.base_service import BaseService


class DoctorReportService(BaseService):

    def __init__(self, db: Session):
        super().__init__(DoctorReportRepository(db))

    def get_report(
        self,
        consultation_id: int,
    ):
        return self.repository.get_by_consultation_id(
            consultation_id
        )

    def update_pdf(
        self,
        consultation_id: int,
        pdf_path: str,
    ):
        return self.repository.update_pdf_path(
            consultation_id,
            pdf_path,
        )