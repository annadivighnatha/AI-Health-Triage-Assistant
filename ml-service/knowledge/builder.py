import pandas as pd

from knowledge.models import Disease
from knowledge.registry import KnowledgeRegistry


class KnowledgeBuilder:

    def build(
        self,
        dataframe: pd.DataFrame,
    ) -> KnowledgeRegistry:

        registry = KnowledgeRegistry()

        for _, row in dataframe.iterrows():

            symptoms = [
                symptom.strip()
                for symptom in row["Symptoms"].split(",")
                if symptom.strip()
            ]

            treatments = []

            if (
                isinstance(
                    row["Treatments"],
                    str,
                )
            ):

                treatments = [
                    treatment.strip()
                    for treatment in row[
                        "Treatments"
                    ].split(",")
                    if treatment.strip()
                ]

            disease = Disease(

                code=str(row["Code"]),

                name=row["Name"],

                symptoms=symptoms,

                treatments=treatments,
            )

            registry.add_disease(
                disease
            )

        return registry