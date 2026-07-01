import logging
import sys

from config.settings import settings


LOG_LEVEL = settings.get("logging", "level")


logging.basicConfig(
    level=getattr(logging, LOG_LEVEL),
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)


def get_logger(name: str):

    return logging.getLogger(name)