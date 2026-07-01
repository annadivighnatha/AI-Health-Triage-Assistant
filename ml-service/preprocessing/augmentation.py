import random

import numpy as np


class DatasetAugmenter:

    def augment(
        self,
        X,
        y,
        samples_per_disease=40,
        minimum_symptoms=2,
    ):

        augmented_X = []

        augmented_y = []

        for features, label in zip(X, y):

            indices = np.where(
                features == 1
            )[0]

            for _ in range(
                samples_per_disease
            ):

                # 1. Determine a safe minimum bound so we never pass (2, 1) to randint
                safe_min = min(minimum_symptoms, len(indices))

                # 2. Safely sample without throwing a ValueError
                selected = random.sample(
                    list(indices),
                    random.randint(safe_min, len(indices))
                )

                vector = np.zeros_like(
                    features
                )

                vector[selected] = 1

                augmented_X.append(
                    vector
                )

                augmented_y.append(
                    label
                )

        return (

            np.array(
                augmented_X
            ),

            np.array(
                augmented_y
            ),
        )