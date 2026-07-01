from pathlib import Path
import json

from knowledge.registry import KnowledgeRegistry
from utils.logger import get_logger


class VocabularyBuilder:

    def __init__(self):
        self.logger = get_logger(self.__class__.__name__)

    def build(
        self,
        registry: KnowledgeRegistry,
    ) -> dict[str, int]:

        vocabulary = {
            symptom: index
            for index, symptom in enumerate(
                sorted(registry.symptoms.keys())
            )
        }

        self.logger.info(
            f"Vocabulary Size : {len(vocabulary)}"
        )

        return vocabulary

    def save(
        self,
        vocabulary: dict[str, int],
        output_path: str,
    ):

        output = Path(output_path)

        output.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        output.write_text(
            json.dumps(
                vocabulary,
                indent=4,
            ),
            encoding="utf-8",
        )