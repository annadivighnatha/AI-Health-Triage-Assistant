class SymptomNormalizer:

    @staticmethod
    def normalize(symptom: str) -> str:
        cleaned = " ".join(symptom.strip().lower().split())
        return cleaned.replace(" ", "_")

    @classmethod
    def normalize_many(cls, symptoms: list[str]) -> list[str]:
        return [cls.normalize(symptom) for symptom in symptoms if symptom and symptom.strip()]
