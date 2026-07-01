import argparse

import pandas as pd

from config.settings import settings
from preprocessing.pipeline import (
    PreprocessingPipeline,
)
from knowledge.builder import KnowledgeBuilder

from preprocessing.vocabulary_builder import VocabularyBuilder

from preprocessing.feature_builder import FeatureBuilder

from preprocessing.augmentation import DatasetAugmenter

from training.trainer import Trainer


def main():

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "command",
        choices=[
            "preprocess",
            "train",
            "evaluate",
            "predict",
        ],
    )

    args = parser.parse_args()

    if args.command == "preprocess":

        pipeline = PreprocessingPipeline()

        pipeline.run()
    
    elif args.command == "train":

        registry = KnowledgeBuilder().build(
            pd.read_csv(
                settings.get(
                    "dataset",
                    "processed_path",
                )
            )
        )

        vocabulary = VocabularyBuilder().build(
            registry
        )

        VocabularyBuilder().save(

            vocabulary,

            "artifacts/knowledge/symptom_vocabulary.json",
        )

        X, y, labels = FeatureBuilder().build(

            registry,

            vocabulary,
        )

        X, y = DatasetAugmenter().augment(
            X,
            y,
        )

        Trainer().train(
            X,
            y,
            labels,
        )


if __name__ == "__main__":
    main()