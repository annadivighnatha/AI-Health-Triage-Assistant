class MLServiceException(Exception):
    """Base exception for ML Service."""


class DatasetLoadingError(MLServiceException):
    """Raised when dataset cannot be loaded."""


class DatasetValidationError(MLServiceException):
    """Raised when dataset validation fails."""


class DatasetCleaningError(MLServiceException):
    """Raised when preprocessing fails."""


class ModelTrainingError(MLServiceException):
    """Raised when model training fails."""


class PredictionError(MLServiceException):
    """Raised when inference fails."""