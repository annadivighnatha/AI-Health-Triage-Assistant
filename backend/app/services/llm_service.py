from __future__ import annotations

import json
import logging
import re
from urllib import request
from urllib.error import HTTPError

from app.core.config import settings
from app.schemas.llm import ExplanationResponse
from app.schemas.prediction_flow import ExplainRequest

LOGGER = logging.getLogger(__name__)


class LLMService:
    def explain(self, payload: ExplainRequest) -> ExplanationResponse:
        if settings.GEMINI_API_KEY:
            try:
                return self._explain_with_gemini(payload)
            except Exception as exc:  # noqa: BLE001
                LOGGER.exception("Gemini explanation failed, falling back to heuristic: %s", exc)
                return self._explain_with_heuristic(payload)
        else:
            LOGGER.warning("GEMINI_API_KEY not set, using heuristic explanation")
            return self._explain_with_heuristic(payload)

    def _explain_with_heuristic(self, payload: ExplainRequest) -> ExplanationResponse:
        summary = (
            f"The symptoms most closely match {payload.disease}. "
            f"Matched symptoms: {', '.join(payload.matched_symptoms) or 'none'}. "
            f"Missing symptoms: {', '.join(payload.missing_symptoms) or 'none'}."
        )

        precautions = [
            "Rest and stay hydrated.",
            "Track symptom changes over the next 24 to 48 hours.",
            "Seek medical care if symptoms worsen or new red-flag symptoms appear.",
        ]

        recommended_tests = [
            "Clinical evaluation",
            "Additional tests based on the attending clinician's judgment",
        ]

        next_steps = [
            "Review the top prediction with the patient.",
            "Escalate to urgent care if severe symptoms are present.",
        ]

        return ExplanationResponse(
            explanation=summary,
            precautions=precautions,
            recommended_tests=recommended_tests,
            next_steps=next_steps,
        )

    def _explain_with_gemini(self, payload: ExplainRequest) -> ExplanationResponse:
        prompt = self._build_prompt(payload)
        body = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 1024,
                "responseMimeType": "application/json",
                "responseSchema": {
                    "type": "object",
                    "properties": {
                        "explanation": {"type": "string"},
                        "precautions": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "recommended_tests": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                        "next_steps": {
                            "type": "array",
                            "items": {"type": "string"},
                        },
                    },
                    "required": [
                        "explanation",
                        "precautions",
                        "recommended_tests",
                        "next_steps",
                    ],
                    
                },
            },
        }

        endpoint = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            f"{settings.GEMINI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
        )

        req = request.Request(
            endpoint,
            data=json.dumps(body).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )

        try:
            with request.urlopen(req, timeout=45) as resp:
                payload_data = json.loads(resp.read().decode("utf-8"))
        except HTTPError as e:
            error_body = e.read().decode("utf-8")
            LOGGER.error("Gemini API error response: %s", error_body)
            raise

        text = self._extract_text(payload_data)
        LOGGER.info("Gemini explanation generated for disease=%s", payload.disease)
        return self._parse_explanation(text, fallback=self._explain_with_heuristic(payload))

    @staticmethod
    def _build_prompt(payload: ExplainRequest) -> str:
        return (
            "You are a medical triage explanation assistant. "
            "Explain the prediction in patient-friendly language. "
            "Return valid JSON with keys: explanation, precautions, recommended_tests, next_steps. "
            "Do not diagnose beyond the provided disease.\n\n"
            f"Disease: {payload.disease}\n"
            f"Confidence: {payload.confidence}\n"
            f"Matched symptoms: {', '.join(payload.matched_symptoms)}\n"
            f"Missing symptoms: {', '.join(payload.missing_symptoms) or 'none'}\n"
            f"Age: {payload.age if payload.age is not None else 'unknown'}\n"
            f"Gender: {payload.gender or 'unknown'}\n"
            f"Duration: {payload.duration or 'unknown'}\n"
        )

    @staticmethod
    def _extract_text(payload: dict) -> str:
        candidates = payload.get("candidates", [])
        for candidate in candidates:
            content = candidate.get("content", {})
            parts = content.get("parts", [])
            texts = [part.get("text", "") for part in parts if isinstance(part, dict)]
            if texts:
                return "\n".join(texts)
        raise ValueError("Gemini response did not include text content")

    @staticmethod
    def _parse_explanation(text: str, fallback: ExplanationResponse) -> ExplanationResponse:
        try:
            parsed = json.loads(LLMService._extract_json_block(text))
            return ExplanationResponse.model_validate(parsed)
        except Exception as exc:  # noqa: BLE001
            LOGGER.warning("Failed to parse Gemini response as JSON: %s", exc)
            return fallback

    @staticmethod
    def _extract_json_block(text: str) -> str:
        cleaned = text.strip()

        fence_match = re.search(r"```(?:json)?\s*(.*?)\s*```", cleaned, flags=re.DOTALL | re.IGNORECASE)
        if fence_match:
            return fence_match.group(1).strip()

        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return cleaned[start : end + 1]

        return cleaned
