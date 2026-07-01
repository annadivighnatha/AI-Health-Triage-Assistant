from pathlib import Path
import json
import joblib

from sklearn.ensemble import (
    ExtraTreesClassifier,
    RandomForestClassifier,
)

from sklearn.metrics import (
    accuracy_score,
    f1_score,
)

from sklearn.model_selection import (
    train_test_split,
)

try:
    from xgboost import XGBClassifier
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

from config.settings import settings
from utils.logger import get_logger


class Trainer:

    def __init__(self):

        self.logger = get_logger(
            self.__class__.__name__
        )

    def train(
        self,
        X,
        y,
        labels,
    ):

        X_train, X_test, y_train, y_test = train_test_split(

            X,

            y,

            test_size=settings.get(
                "training",
                "test_size",
            ),

            random_state=settings.get(
                "training",
                "random_state",
            ),

            stratify=y,
        )

        models = {

            "RandomForest": RandomForestClassifier(

                n_estimators=300,

                random_state=42,
            ),

            "ExtraTrees": ExtraTreesClassifier(

                n_estimators=300,

                random_state=42,
            ),
        }

        if XGB_AVAILABLE:

            models["XGBoost"] = XGBClassifier(

                n_estimators=300,

                eval_metric="mlogloss",

                random_state=42,
            )

        metrics = {}

        best_model = None

        best_score = -1

        for name, model in models.items():

            self.logger.info(
                f"Training {name}"
            )

            model.fit(
                X_train,
                y_train,
            )

            predictions = model.predict(
                X_test
            )

            score = f1_score(

                y_test,

                predictions,

                average="weighted",
            )

            metrics[name] = {

                "accuracy": accuracy_score(
                    y_test,
                    predictions,
                ),

                "f1": score,
            }

            if score > best_score:

                best_score = score

                best_model = model

        Path(
            "artifacts/models"
        ).mkdir(
            parents=True,
            exist_ok=True,
        )

        joblib.dump(

            best_model,

            "artifacts/models/best_model.pkl",
        )

        Path(
            "artifacts/metrics"
        ).mkdir(
            parents=True,
            exist_ok=True,
        )

        Path(
            "artifacts/metrics/metrics.json"
        ).write_text(

            json.dumps(
                metrics,
                indent=4,
            ),

            encoding="utf-8",
        )

        Path("artifacts/encoders").mkdir(
            parents=True,
            exist_ok=True,
        )

        Path(
            "artifacts/encoders/label_mapping.json"
        ).write_text(
            json.dumps(labels, indent=4),
            encoding="utf-8",
        )

        self.logger.info(
            "Training Completed"
        )

        return best_model