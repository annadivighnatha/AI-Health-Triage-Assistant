from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    
    APP_NAME: str
    APP_VERSION: str
    DEBUG: bool

    HOST: str
    PORT: int

    ML_SERVICE_URL: str

    DATABASE_URL: str

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GEMINI_API_KEY: str
    GEMINI_MODEL: str

    class Config:
        env_file = ".env"


settings = Settings()