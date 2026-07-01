from knowledge.models import Disease, Symptom


class KnowledgeRegistry:

    def __init__(self):

        self.diseases: dict[str, Disease] = {}

        self.symptoms: dict[str, Symptom] = {}

    def add_disease(self, disease: Disease):

        self.diseases[disease.name.lower()] = disease

        for symptom_name in disease.symptoms:

            symptom = self.symptoms.setdefault(
                symptom_name,
                Symptom(name=symptom_name),
            )

            symptom.frequency += 1

            symptom.diseases.add(
                disease.name
            )

    def get_disease(
        self,
        name: str,
    ):

        return self.diseases.get(
            name.lower()
        )

    def get_symptom(
        self,
        symptom: str,
    ):

        return self.symptoms.get(
            symptom.lower()
        )

    def get_all_diseases(self):

        return list(
            self.diseases.values()
        )

    def get_all_symptoms(self):

        return list(
            self.symptoms.values()
        )

    def vocabulary(self):

        return sorted(
            self.symptoms.keys()
        )