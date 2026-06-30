from sqlalchemy.orm import Session

from app.models.doctor_report import DoctorReport
from app.repositories.base_repository import BaseRepository


class DoctorReportRepository(
    BaseRepository[DoctorReport]
):

    def __init__(self, db: Session):
        super().__init__(DoctorReport, db)

    def get_by_consultation_id(
        self,
        consultation_id: int,
    ):
        return (
            self.db.query(DoctorReport)
            .filter(
                DoctorReport.consultation_id == consultation_id
            )
            .first()
        )

    def update_pdf_path(
        self,
        consultation_id: int,
        pdf_path: str,
    ):
        report = self.get_by_consultation_id(
            consultation_id
        )

        if report is None:
            return None

        report.pdf_path = pdf_path

        return self.update(report)