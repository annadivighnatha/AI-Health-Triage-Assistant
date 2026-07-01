from pathlib import Path

import yaml


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings:

    _instance = None

    def __new__(cls):

        if cls._instance is None:
            cls._instance = super().__new__(cls)

        return cls._instance

    def __init__(self):

        if hasattr(self, "_loaded"):
            return

        config_path = BASE_DIR / "config" / "training.yaml"

        with open(config_path, "r", encoding="utf-8") as file:
            self.config = yaml.safe_load(file)

        self._loaded = True

    def get(self, *keys):

        value = self.config

        for key in keys:
            value = value[key]

        return value


settings = Settings()