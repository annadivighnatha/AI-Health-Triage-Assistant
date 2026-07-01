from pathlib import Path

import pandas as pd

from config.settings import settings
from knowledge.builder import KnowledgeBuilder
from knowledge.exporter import KnowledgeExporter
from preprocessing.cleaner import DatasetCleaner
from preprocessing.explorer import DatasetExplorer
from preprocessing.loader import DatasetLoader
from preprocessing.validator import DatasetValidator
from utils.logger import get_logger


class PreprocessingPipeline:
    """
    Complete preprocessing pipeline.

    Flow:
        Load Dataset
            ↓
        Validate Dataset
            ↓
        Explore Dataset
            ↓
        Clean Dataset
            ↓
        Save Processed Dataset
            ↓
        Build Knowledge Registry
            ↓
        Export Knowledge Artifacts
    """

    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

        self.loader = DatasetLoader()
        self.validator = DatasetValidator()
        self.explorer = DatasetExplorer()
        self.cleaner = DatasetCleaner()

        self.knowledge_builder = KnowledgeBuilder()
        self.knowledge_exporter = KnowledgeExporter()

    def run(self) -> pd.DataFrame:
        self.logger.info("=" * 70)
        self.logger.info("Starting Preprocessing Pipeline")
        self.logger.info("=" * 70)

        # ------------------------------------------------------------------
        # Step 1 : Load Dataset
        # ------------------------------------------------------------------

        dataframe = self.loader.process()

        # ------------------------------------------------------------------
        # Step 2 : Validate Dataset
        # ------------------------------------------------------------------

        dataframe = self.validator.process(dataframe)

        # ------------------------------------------------------------------
        # Step 3 : Dataset Analysis
        # ------------------------------------------------------------------

        dataframe = self.explorer.process(dataframe)

        # ------------------------------------------------------------------
        # Step 4 : Clean Dataset
        # ------------------------------------------------------------------

        dataframe = self.cleaner.process(dataframe)

        # ------------------------------------------------------------------
        # Step 5 : Build Knowledge Registry
        # ------------------------------------------------------------------

        self.logger.info("Building Knowledge Registry...")

        registry = self.knowledge_builder.build(dataframe)

        # ------------------------------------------------------------------
        # Step 6 : Export Knowledge Artifacts
        # ------------------------------------------------------------------

        artifacts_dir = Path("artifacts") / "knowledge"

        self.knowledge_exporter.export(
            registry=registry,
            output_dir=artifacts_dir,
        )

        # ------------------------------------------------------------------
        # Pipeline Complete
        # ------------------------------------------------------------------

        self.logger.info("=" * 70)
        self.logger.info("Preprocessing Pipeline Completed Successfully")
        self.logger.info("=" * 70)

        self.logger.info(
            f"Total Diseases : {len(registry.get_all_diseases())}"
        )

        self.logger.info(
            f"Total Symptoms : {len(registry.get_all_symptoms())}"
        )

        self.logger.info(
            f"Knowledge Artifacts : {artifacts_dir.resolve()}"
        )

        return dataframe