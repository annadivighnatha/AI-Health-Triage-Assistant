import numpy as np

from utils.symptom_normalizer import SymptomNormalizer


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

        for symptom in SymptomNormalizer.normalize_many(symptoms):

            if symptom in self.vocabulary:

                vector[
                    self.vocabulary[symptom]
                ] = 1

        return vector.reshape(1, -1)
