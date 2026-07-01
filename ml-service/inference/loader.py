from __future__ import annotations

import json
from pathlib import Path
from typing import Any

import joblib
from sklearn.preprocessing import LabelEncoder

BASE_DIR = Path(__file__).resolve().parents[1]


class ModelLoader:
    """
    Loads and caches all inference artifacts.

    Artifacts:
        artifacts/
            models/
                best_model.pkl

            encoders/
                label_encoder.pkl

            knowledge/
                symptom_vocabulary.json
                disease_knowledge.json
                symptom_metadata.json
    """

    def __init__(self) -> None:

        self.model: Any | None = None

        self.encoder: LabelEncoder | None = None

        self.vocabulary: dict[str, int] | None = None

        self.disease_knowledge: dict | None = None

        self.symptom_metadata: dict | None = None

        self.loaded = False

    def load(self) -> "ModelLoader":

        if self.loaded:
            return self

        self.model = self._load_model()

        self.encoder = self._load_encoder()

        self.vocabulary = self._load_vocabulary()

        self.disease_knowledge = self._load_disease_knowledge()

        self.symptom_metadata = self._load_symptom_metadata()

        self.loaded = True

        return self

    def _load_model(self):

        model_path = (
            BASE_DIR
            / "artifacts"
            / "models"
            / "best_model.pkl"
        )

        if not model_path.exists():
            raise FileNotFoundError(
                f"Model not found: {model_path}"
            )

        return joblib.load(model_path)

    def _load_encoder(self) -> LabelEncoder:

        encoder_path = (
            BASE_DIR
            / "artifacts"
            / "encoders"
            / "label_encoder.pkl"
        )

        if not encoder_path.exists():
            raise FileNotFoundError(
                f"LabelEncoder not found: {encoder_path}"
            )

        encoder = joblib.load(encoder_path)

        if not isinstance(
            encoder,
            LabelEncoder,
        ):
            raise TypeError(
                "Loaded encoder is not a LabelEncoder."
            )

        return encoder

    def _load_vocabulary(self) -> dict[str, int]:

        vocabulary_path = (
            BASE_DIR
            / "artifacts"
            / "knowledge"
            / "symptom_vocabulary.json"
        )

        if not vocabulary_path.exists():
            raise FileNotFoundError(
                f"Vocabulary not found: {vocabulary_path}"
            )

        with open(
            vocabulary_path,
            "r",
            encoding="utf-8",
        ) as file:

            vocabulary = json.load(file)

        return {
            str(key): int(value)
            for key, value in vocabulary.items()
        }

    def _load_disease_knowledge(self) -> dict:

        path = (
            BASE_DIR
            / "artifacts"
            / "knowledge"
            / "disease_knowledge.json"
        )

        if not path.exists():
            return {}

        with open(
            path,
            "r",
            encoding="utf-8",
        ) as file:

            return json.load(file)

    def _load_symptom_metadata(self) -> dict:

        path = (
            BASE_DIR
            / "artifacts"
            / "knowledge"
            / "symptom_metadata.json"
        )

        if not path.exists():
            return {}

        with open(
            path,
            "r",
            encoding="utf-8",
        ) as file:

            return json.load(file)

    @property
    def num_classes(self) -> int:

        if self.encoder is None:
            return 0

        return len(self.encoder.classes_)

    @property
    def vocabulary_size(self) -> int:

        if self.vocabulary is None:
            return 0

        return len(self.vocabulary)

    def health(self) -> dict:

        return {

            "model_loaded": self.model is not None,

            "encoder_loaded": self.encoder is not None,

            "vocabulary_size": self.vocabulary_size,

            "classes": self.num_classes,

            "knowledge_loaded": bool(
                self.disease_knowledge
            ),

            "symptom_metadata_loaded": bool(
                self.symptom_metadata
            ),
        }