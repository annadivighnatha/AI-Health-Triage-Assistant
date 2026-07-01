import numpy as np

from inference.encoder import SymptomEncoder
from inference.loader import ModelLoader
from inference.schemas import (
    Prediction,
    PredictionResponse,
)


class Predictor:

    def __init__(self):

        self.loader = ModelLoader().load()

        self.encoder = SymptomEncoder(

            self.loader.vocabulary
        )

        self.index_to_disease = {

            int(v): k

            for k, v in self.loader.label_mapping.items()
        }

    def predict_proba(

        self,

        symptoms: list[str],
    ):

        vector = self.encoder.encode(

            symptoms
        )

        probabilities = (

            self.loader.model.predict_proba(
                vector
            )[0]
        )

        return probabilities

    def predict_top3(

        self,

        symptoms: list[str],
    ) -> PredictionResponse:

        probabilities = self.predict_proba(

            symptoms
        )

        indices = np.argsort(

            probabilities

        )[-3:][::-1]

        predictions = []

        for index in indices:

            predictions.append(

                Prediction(

                    disease=self.index_to_disease[
                        index
                    ],

                    confidence=round(

                        probabilities[index] * 100,

                        2,
                    ),
                )
            )

        return PredictionResponse(

            predictions=predictions
        )

    def predict(

        self,

        symptoms: list[str],
    ):

        return self.predict_top3(
            symptoms
        ).predictions[0]