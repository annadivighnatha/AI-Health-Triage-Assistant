from abc import ABC, abstractmethod

import pandas as pd

from config.settings import settings
from utils.logger import get_logger


class BaseProcessor(ABC):

    def __init__(self):

        self.settings = settings

        self.logger = get_logger(
            self.__class__.__name__
        )

    @abstractmethod
    def process(
        self,
        dataframe: pd.DataFrame,
    ) -> pd.DataFrame:
        """
        Process dataframe.
        """
        raise NotImplementedError