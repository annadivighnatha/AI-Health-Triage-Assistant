from fastapi import FastAPI
from pydantic import BaseModel

from inference.predictor import Predictor


app = FastAPI(
    title="AI Health Triage ML Service",
    version="1.0.0"
)


predictor = Predictor()


class SymptomRequest(BaseModel):
    symptoms: list[str]


@app.get("/")
def home():
    return {
        "message": "AI Health Triage ML API Running"
    }


@app.post("/predict")
def predict(request: SymptomRequest):

    result = predictor.predict(
        request.symptoms
    )

    return result