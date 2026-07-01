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

    knowledge_file = KNOWLEDGE_DIR / "disease_knowledge.json"

    if not knowledge_file.exists():
        raise FileNotFoundError(
            f"Knowledge artifact not found: {knowledge_file}"
        )

    payload = json.loads(
        knowledge_file.read_text(encoding="utf-8")
    )

    for disease_name, record in payload.items():

        disease = Disease(
            code=str(record.get("code", "")),
            name=disease_name,
            symptoms=[
                SymptomNormalizer.normalize(symptom)
                for symptom in record.get("symptoms", [])
            ],
            treatments=record.get("treatments", []),
        )

        registry.add_disease(disease)

    LOGGER.info(
        "Knowledge Registry Loaded (%s diseases)",
        len(registry.get_all_diseases()),
    )

    return registry


class Predictor:

    ML_WEIGHT = 0.70
    SIMILARITY_WEIGHT = 0.30

    def __init__(
        self,
        candidate_k: int = 20,
    ):

        self.loader = ModelLoader().load()

        self.model = self.loader.model

        self.encoder = self.loader.encoder

        self.symptom_encoder = SymptomEncoder(
            self.loader.vocabulary
        )

        self.registry = load_knowledge_registry()

        self.retriever = CandidateRetriever(
            self.registry
        )

        self.candidate_k = candidate_k

    def predict_proba(
        self,
        symptoms: list[str],
    ) -> np.ndarray:

        vector = self.symptom_encoder.encode(
            symptoms
        )

        probabilities = self.model.predict_proba(vector)[0]

        LOGGER.debug(
            "Prediction completed. Max probability = %.4f",
            probabilities.max(),
        )

        return probabilities

    def _build_probability_map(
        self,
        symptoms: list[str],
    ) -> dict[str, float]:

        probabilities = self.predict_proba(
            symptoms
        )

        probability_map = {}

        for class_id, probability in zip(
            self.model.classes_,
            probabilities,
        ):

            disease = self.encoder.inverse_transform(
                [class_id]
            )[0]

            probability_map[
                disease.lower()
            ] = float(probability)

        return probability_map

    def predict_top3(
        self,
        symptoms: list[str],
        top_k: int | None = None,
    ) -> PredictionResponse:

        normalized_symptoms = (
            SymptomNormalizer.normalize_many(
                symptoms
            )
        )

        candidates = self.retriever.retrieve(

            normalized_symptoms,

            top_k=top_k
            or self.candidate_k,
        )

        probability_map = (
            self._build_probability_map(
                normalized_symptoms
            )
        )

        predictions = []

        for candidate in candidates:

            probability = probability_map.get(

                candidate.disease.lower(),

                0.0,
            )

            similarity = candidate.similarity

            final_score = (

                self.ML_WEIGHT * probability

                +

                self.SIMILARITY_WEIGHT
                * similarity
            )

            predictions.append(

                Prediction(

                    disease=candidate.disease,

                    confidence=round(
                        final_score * 100,
                        2,
                    ),

                    probability=round(
                        probability,
                        4,
                    ),

                    similarity=round(
                        similarity,
                        4,
                    ),

                    final_score=round(
                        final_score,
                        4,
                    ),

                    matched_symptoms=candidate.matched_symptoms,

                    missing_symptoms=candidate.missing_symptoms,
                )
            )

        predictions.sort(

            key=lambda prediction:
            prediction.final_score,

            reverse=True,
        )

        return PredictionResponse(

            predictions=predictions[:3]
        )

    def predict(
        self,
        symptoms: list[str],
    ) -> Prediction:

        return self.predict_top3(
            symptoms
        ).predictions[0]

    def debug_prediction(
        self,
        symptoms: list[str],
    ):

        probabilities = self.predict_proba(
            symptoms
        )

        print("=" * 80)

        print("TOP 10 ML PREDICTIONS")

        top = np.argsort(
            probabilities
        )[-10:][::-1]

        for class_id in top:

            disease = self.encoder.inverse_transform(
                [self.model.classes_[class_id]]
            )[0]

            print(
                f"{disease:<40}"
                f"{probabilities[class_id]:.4f}"
            )

        print("=" * 80)