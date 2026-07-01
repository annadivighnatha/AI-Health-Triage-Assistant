import pandas as pd

from preprocessing.base import BaseProcessor


class DatasetCleaner(BaseProcessor):

    @staticmethod
    def normalize_symptom(
        symptom: str,
    ) -> str:

        return (
            symptom.strip()
            .lower()
            .replace(" ", "_")
        )

    def process(
        self,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:

        self.logger.info(
            "Cleaning dataset..."
        )

        dataframe = dataframe.copy()

        dataframe["Symptoms"] = dataframe[
            "Symptoms"
        ].apply(self.clean_symptoms)

        output_path = self.settings.get(
            "dataset",
            "processed_path",
        )

        dataframe.to_csv(
            output_path,
            index=False,
        )

        self.logger.info(
            f"Processed dataset saved to {output_path}"
        )

        return dataframe

    def clean_symptoms(
        self,
        symptoms: str,
    ) -> str:

        cleaned = sorted(
            {
                self.normalize_symptom(
                    symptom
                )
                for symptom in symptoms.split(",")
            }
        )

        return ",".join(cleaned)