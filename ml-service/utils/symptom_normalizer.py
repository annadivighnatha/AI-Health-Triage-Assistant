class SymptomNormalizer:

    @staticmethod
    def normalize(symptom: str):

        return (

            symptom

            .strip()

            .lower()

            .replace("-", " ")

            .replace(" ", "_")

        )