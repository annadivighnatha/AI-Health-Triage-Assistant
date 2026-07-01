import json
from pathlib import Path

import joblib


BASE_DIR = Path(__file__).resolve().parents[1]


class ModelLoader:

    def __init__(self):

        self.model = None

        self.vocabulary = None

        self.label_mapping = None

    def load(self):

        if self.model is None:

            self.model = joblib.load(
                BASE_DIR / "artifacts" / "models" / "best_model.pkl"
            )

        if self.vocabulary is None:

            self.vocabulary = json.loads(

                (BASE_DIR / "artifacts" / "knowledge" / "symptom_vocabulary.json").read_text(encoding="utf-8")
            )

        if self.label_mapping is None:

            self.label_mapping = json.loads(

                (BASE_DIR / "artifacts" / "encoders" / "label_mapping.json").read_text(encoding="utf-8")
            )

        return self
