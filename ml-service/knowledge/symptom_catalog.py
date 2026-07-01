from knowledge.models import Symptom


class SymptomCatalog:

    def __init__(self):

        self._symptoms: dict[
            str,
            Symptom,
        ] = {}

    def add(
        self,
        symptom_name: str,
        disease: str,
    ):

        symptom_name = symptom_name.lower()

        if symptom_name not in self._symptoms:

            self._symptoms[
                symptom_name
            ] = Symptom(
                name=symptom_name
            )

        symptom = self._symptoms[
            symptom_name
        ]

        symptom.frequency += 1

        symptom.diseases.add(
            disease
        )

    def get(
        self,
        symptom_name: str,
    ):

        return self._symptoms.get(
            symptom_name.lower()
        )

    def vocabulary(self):

        return sorted(
            self._symptoms.keys()
        )

    def count(self):

        return len(
            self._symptoms
        )

    def all(self):

        return list(
            self._symptoms.values()
        )