from knowledge.models import Treatment


class TreatmentCatalog:

    def __init__(self):

        self._catalog: dict[
            str,
            Treatment,
        ] = {}

    def add(
        self,
        disease: str,
        treatments: list[str],
    ):

        self._catalog[
            disease.lower()
        ] = Treatment(
            disease=disease,
            treatments=treatments,
        )

    def get(
        self,
        disease: str,
    ):

        return self._catalog.get(
            disease.lower()
        )

    def all(self):

        return list(
            self._catalog.values()
        )