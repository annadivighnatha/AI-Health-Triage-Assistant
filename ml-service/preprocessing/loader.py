from pathlib import Path

import pandas as pd

from preprocessing.base import BaseProcessor
from utils.exceptions import DatasetLoadingError


class DatasetLoader(BaseProcessor):

    def process(self, dataframe=None) -> pd.DataFrame:

        dataset_path = Path(
            self.settings.get("dataset", "raw_path")
        )

        self.logger.info(
            f"Loading dataset from: {dataset_path}"
        )

        if not dataset_path.exists():
            raise DatasetLoadingError(
                f"Dataset not found: {dataset_path}"
            )

        df = pd.read_csv(dataset_path)

        self.logger.info(
            f"Dataset loaded successfully ({len(df)} rows)"
        )

        return df