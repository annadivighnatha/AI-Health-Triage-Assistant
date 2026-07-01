import numpy as np


class SymptomEncoder:

    def __init__(self, vocabulary):

        self.vocabulary = vocabulary

    def encode(
        self,
        symptoms: list[str],
    ):

        vector = np.zeros(

            len(self.vocabulary),

            dtype=np.int8,
        )

        for symptom in symptoms:

            symptom = (

                symptom

                .strip()

                .lower()

                .replace(" ", "_")
            )

            if symptom in self.vocabulary:

                vector[
                    self.vocabulary[symptom]
                ] = 1

        return vector.reshape(1, -1)