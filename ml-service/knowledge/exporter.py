import json
from pathlib import Path

from knowledge.registry import (
    KnowledgeRegistry,
)


class KnowledgeExporter:

    def export(
        self,
        registry: KnowledgeRegistry,
        output_dir: str,
    ):

        output = Path(output_dir)

        output.mkdir(
            parents=True,
            exist_ok=True,
        )

        diseases = {}

        for disease in registry.get_all_diseases():

            diseases[disease.name] = {

                "code": disease.code,

                "symptoms": disease.symptoms,

                "treatments": disease.treatments,
            }

        symptoms = {}

        for symptom in registry.get_all_symptoms():

            symptoms[symptom.name] = {

                "frequency": symptom.frequency,

                "diseases": sorted(
                    symptom.diseases
                ),
            }

        vocabulary = {

            symptom: index

            for index, symptom in enumerate(
                registry.vocabulary()
            )
        }

        (output / "disease_knowledge.json").write_text(
            json.dumps(
                diseases,
                indent=4,
            ),
            encoding="utf-8",
        )

        (output / "symptom_metadata.json").write_text(
            json.dumps(
                symptoms,
                indent=4,
            ),
            encoding="utf-8",
        )

        (output / "symptom_vocabulary.json").write_text(
            json.dumps(
                vocabulary,
                indent=4,
            ),
            encoding="utf-8",
        )