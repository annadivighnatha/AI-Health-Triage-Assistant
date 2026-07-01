from inference.predictor import Predictor

predictor = Predictor()

result = predictor.predict_top3(
    [
        "fever",
        "cough",
        "fatigue",
    ]
)

print(result)