from knowledge.registry import KnowledgeRegistry


class CandidateRetriever:

    def __init__(self, registry: KnowledgeRegistry):
        self.registry = registry

    @staticmethod
    def jaccard(user: set[str], disease: set[str]) -> float:
        union = user | disease
        if not union:
            return 0.0
        return len(user & disease) / len(union)

    def retrieve(
        self,
        symptoms: list[str],
        top_k: int = 20,
    ):

        user_symptoms = {
            symptom.strip().lower().replace(" ", "_")
            for symptom in symptoms
        }

        candidates = []

        for disease in self.registry.get_all_diseases():

            score = self.jaccard(
                user_symptoms,
                set(disease.symptoms),
            )

            candidates.append(
                {
                    "disease": disease.name,
                    "similarity": score,
                }
            )

        candidates.sort(
            key=lambda x: x["similarity"],
            reverse=True,
        )

        return candidates[:top_k]