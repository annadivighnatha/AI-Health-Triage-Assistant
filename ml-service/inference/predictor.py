from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path

import numpy as np

from evaluation.retriever import CandidateRetriever
from inference.encoder import SymptomEncoder
from inference.loader import ModelLoader
from inference.schemas import Prediction, PredictionResponse
from knowledge.models import Disease
from knowledge.registry import KnowledgeRegistry
from utils.symptom_normalizer import SymptomNormalizer

LOGGER = logging.getLogger(__name__)
BASE_DIR = Path(__file__).resolve().parents[1]
KNOWLEDGE_DIR = BASE_DIR / "artifacts" / "knowledge"


@lru_cache(maxsize=1)
def load_knowledge_registry() -> KnowledgeRegistry:
    registry = KnowledgeRegistry()
    disease_knowledge_path = KNOWLEDGE_DIR / "disease_knowledge.json"

    if not disease_knowledge_path.exists():
        raise FileNotFoundError(
            f"Knowledge artifact not found: {disease_knowledge_path}"
        )

    payload = json.loads(disease_knowledge_path.read_text(encoding="utf-8"))

    for disease_name, record in payload.items():
        symptoms = [
            SymptomNormalizer.normalize(symptom)
            for symptom in record.get("symptoms", [])
        ]
        disease = Disease(
            code=str(record.get("code", "")),
            name=disease_name,
            symptoms=symptoms,
            treatments=record.get("treatments", []),
        )
        registry.add_disease(disease)

    LOGGER.info("Loaded %s diseases into knowledge registry", len(registry.get_all_diseases()))
    return registry


class Predictor:
    def __init__(self, candidate_k: int = 20):
        self.loader = ModelLoader().load()
        self.encoder = SymptomEncoder(self.loader.vocabulary)
        self.index_to_disease = {
            int(v): k for k, v in self.loader.label_mapping.items()
        }
        self.registry = load_knowledge_registry()
        self.retriever = CandidateRetriever(self.registry)
        self.candidate_k = candidate_k

    def predict_proba(self, symptoms: list[str]) -> np.ndarray:
        vector = self.encoder.encode(symptoms)
        probabilities = self.loader.model.predict_proba(vector)[0]
        return probabilities

    def _disease_probability_map(self, symptoms: list[str]) -> dict[str, float]:
        probabilities = self.predict_proba(symptoms)
        return {
            self.index_to_disease[index]: float(probabilities[index])
            for index in range(len(probabilities))
        }

    def predict_top3(self, symptoms: list[str], top_k: int | None = None) -> PredictionResponse:
        normalized_symptoms = SymptomNormalizer.normalize_many(symptoms)
        candidate_limit = top_k or self.candidate_k
        candidates = self.retriever.retrieve(normalized_symptoms, top_k=candidate_limit)
        probability_by_disease = self._disease_probability_map(normalized_symptoms)

        ranked_predictions: list[Prediction] = []
        for candidate in candidates:
            probability = probability_by_disease.get(candidate.disease, 0.0)
            final_score = (0.70 * probability) + (0.30 * candidate.similarity)
            ranked_predictions.append(
                Prediction(
                    disease=candidate.disease,
                    confidence=round(final_score * 100, 2),
                    probability=round(probability, 6),
                    similarity=round(candidate.similarity, 6),
                    final_score=round(final_score, 6),
                    matched_symptoms=candidate.matched_symptoms,
                    missing_symptoms=candidate.missing_symptoms,
                )
            )

        ranked_predictions.sort(key=lambda prediction: prediction.final_score, reverse=True)

        return PredictionResponse(predictions=ranked_predictions[:3])

    def predict(self, symptoms: list[str]) -> Prediction:
        return self.predict_top3(symptoms).predictions[0]
