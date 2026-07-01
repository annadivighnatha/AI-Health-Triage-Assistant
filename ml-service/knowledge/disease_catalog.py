from knowledge.models import Disease


class DiseaseCatalog:

    def __init__(self):

        self._diseases: dict[str, Disease] = {}

    def add(
        self,
        disease: Disease,
    ):

        self._diseases[
            disease.name.lower()
        ] = disease

    def get(
        self,
        name: str,
    ) -> Disease | None:

        return self._diseases.get(
            name.lower()
        )

    def exists(
        self,
        name: str,
    ) -> bool:

        return (
            name.lower()
            in self._diseases
        )

    def all(self):

        return list(
            self._diseases.values()
        )

    def count(self):

        return len(
            self._diseases
        )