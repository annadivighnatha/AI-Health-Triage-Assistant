import json
from collections import Counter
from pathlib import Path

import pandas as pd

from preprocessing.base import BaseProcessor


class DatasetExplorer(BaseProcessor):

    def process(
        self,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:

        self.logger.info("Analyzing dataset...")

        symptom_counter = Counter()

        symptom_counts = []

        for symptoms in dataframe["Symptoms"]:

            symptom_list = [
                symptom.strip().lower()
                for symptom in symptoms.split(",")
            ]

            symptom_counter.update(symptom_list)

            symptom_counts.append(
                len(symptom_list)
            )

        report = {

            "total_diseases": len(dataframe),

            "unique_symptoms": len(symptom_counter),

            "average_symptoms": round(
                sum(symptom_counts)
                / len(symptom_counts),
                2,
            ),

            "max_symptoms": max(symptom_counts),

            "min_symptoms": min(symptom_counts),

            "top_20_symptoms": dict(
                symptom_counter.most_common(20)
            ),
        }

        report_path = Path(
            self.settings.get(
                "dataset",
                "reports_path",
            )
        )

        report_path.mkdir(
            parents=True,
            exist_ok=True,
        )

        with open(
            report_path / "dataset_report.json",
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                report,
                file,
                indent=4,
            )

        self.logger.info(
            "Dataset report generated."
        )

        return dataframe