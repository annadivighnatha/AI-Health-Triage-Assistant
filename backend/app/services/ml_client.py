import httpx

from app.core.config import settings


class MLClient:

    def __init__(self):
        self.url = settings.ML_SERVICE_URL


    async def predict(
        self,
        symptoms: list[str]
    ):

        async with httpx.AsyncClient() as client:

            response = await client.post(
                f"{self.url}/predict",
                json={
                    "symptoms": symptoms
                }
            )

            response.raise_for_status()

            return response.json()