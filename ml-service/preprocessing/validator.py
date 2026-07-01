import pandas as pd

from preprocessing.base import BaseProcessor
from utils.exceptions import DatasetValidationError


class DatasetValidator(BaseProcessor):

    REQUIRED_COLUMNS = [
        "Code",
        "Name",
        "Symptoms",
        "Treatments",
    ]

    def process(
        self,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:

        self.logger.info("Validating dataset...")

        missing_columns = [
            column
            for column in self.REQUIRED_COLUMNS
            if column not in dataframe.columns
        ]

        if missing_columns:
            raise DatasetValidationError(
                f"Missing columns: {missing_columns}"
            )

        duplicate_diseases = dataframe[
            "Name"
        ].duplicated().sum()

        if duplicate_diseases > 0:
            self.logger.warning(
                f"Duplicate diseases: {duplicate_diseases}"
            )

        if dataframe["Symptoms"].isnull().any():
            raise DatasetValidationError(
                "Symptoms column contains null values."
            )

        self.logger.info(
            "Dataset validation successful."
        )

        return dataframe