from __future__ import annotations

from dataclasses import dataclass

from knowledge.registry import KnowledgeRegistry
from utils.symptom_normalizer import SymptomNormalizer


@dataclass(slots=True)
class RetrievedCandidate:
    disease: str
    similarity: float
    matched_symptoms: list[str]
    missing_symptoms: list[str]


class CandidateRetriever:
    def __init__(self, registry: KnowledgeRegistry):
        self.registry = registry

    @staticmethod
    def jaccard(user_symptoms: set[str], disease_symptoms: set[str]) -> float:
        union = user_symptoms | disease_symptoms
        if not union:
            return 0.0
        return len(user_symptoms & disease_symptoms) / len(union)

    def retrieve(self, symptoms: list[str], top_k: int = 20) -> list[RetrievedCandidate]:
        normalized_user_symptoms = set(SymptomNormalizer.normalize_many(symptoms))
        candidates: list[RetrievedCandidate] = []

        for disease in self.registry.get_all_diseases():
            disease_symptoms = set(SymptomNormalizer.normalize_many(disease.symptoms))
            matched_symptoms = sorted(normalized_user_symptoms & disease_symptoms)
            missing_symptoms = sorted(disease_symptoms - normalized_user_symptoms)

            candidates.append(
                RetrievedCandidate(
                    disease=disease.name,
                    similarity=self.jaccard(normalized_user_symptoms, disease_symptoms),
                    matched_symptoms=matched_symptoms,
                    missing_symptoms=missing_symptoms,
                )
            )

        candidates.sort(key=lambda candidate: candidate.similarity, reverse=True)
        return candidates[:top_k]
