from sklearn.preprocessing import LabelEncoder
import joblib
from pathlib import Path
import numpy as np

class FeatureBuilder:

    def build(self, registry, vocabulary):

        X = []
        disease_names = []

        for disease in registry.get_all_diseases():

            vector = [0] * len(vocabulary)

            for symptom in disease.symptoms:
                if symptom in vocabulary:
                    vector[vocabulary[symptom]] = 1

            X.append(vector)
            disease_names.append(disease.name)

        encoder = LabelEncoder()

        y = encoder.fit_transform(disease_names)

        Path("artifacts/encoders").mkdir(
            parents=True,
            exist_ok=True,
        )

        joblib.dump(
            encoder,
            "artifacts/encoders/label_encoder.pkl",
        )

        return (
            np.asarray(X, dtype=np.int8),
            np.asarray(y, dtype=np.int32),
            encoder,
        )