import json
from pathlib import Path

import joblib


class ModelLoader:

    def __init__(self):

        self.model = None

        self.vocabulary = None

        self.label_mapping = None

    def load(self):

        if self.model is None:

            self.model = joblib.load(
                "artifacts/models/best_model.pkl"
            )

        if self.vocabulary is None:

            self.vocabulary = json.loads(

                Path(
                    "artifacts/knowledge/symptom_vocabulary.json"
                ).read_text()
            )

        if self.label_mapping is None:

            self.label_mapping = json.loads(

                Path(
                    "artifacts/encoders/label_mapping.json"
                ).read_text()
            )

        return self