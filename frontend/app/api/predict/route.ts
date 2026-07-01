import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export type Prediction = {
  disease: string;
  confidence: number;
  urgency: "Green" | "Yellow" | "Orange" | "Red";
  reason: string;
};

export type PredictResponse = {
  predictions: Prediction[];
  disclaimer: "ML model predicts disease likelihood. LLM explains only. This is not medical advice.";
  model_version: "mock-v0.1-lemma";
};

type MockPrediction = Omit<Prediction, "urgency">;

const DISCLAIMER = "ML model predicts disease likelihood. LLM explains only. This is not medical advice.";
const MODEL_VERSION = "mock-v0.1-lemma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const symptomSchema = z
  .string()
  .min(2, "Each symptom must be at least 2 characters.")
  .max(50, "Each symptom must be at most 50 characters.")
  .regex(/^[a-z]+(?: [a-z]+)*$/, "Symptoms must be lowercase words.");

const predictSchema = z.object({
  symptoms: z
    .array(symptomSchema)
    .min(1, "At least one symptom is required.")
    .max(10, "At most 10 symptoms are allowed.")
    .refine((symptoms) => new Set(symptoms).size === symptoms.length, {
      message: "Symptoms must not contain duplicates.",
    }),
});

const cardiacOrNeuroEmergencies = new Set(["MI", "Stroke", "TIA", "Seizure"]);

function urgencyFor(disease: string, confidence: number): Prediction["urgency"] {
  if (confidence >= 0.8 && cardiacOrNeuroEmergencies.has(disease)) {
    return "Red";
  }

  if (confidence >= 0.7) {
    return "Orange";
  }

  if (confidence >= 0.5) {
    return "Yellow";
  }

  return "Green";
}

function includesAll(symptoms: string[], required: string[]) {
  const symptomSet = new Set(symptoms);
  return required.every((symptom) => symptomSet.has(symptom));
}

function mockPredict(symptoms: string[]): Prediction[] {
  let predictions: MockPrediction[];

  if (includesAll(symptoms, ["chest pain", "shortness of breath"])) {
    predictions = [
      { disease: "MI", confidence: 0.85, reason: "Cardiac red flags + high confidence" },
      { disease: "Angina", confidence: 0.71, reason: "Cardiac symptoms" },
      { disease: "Anxiety", confidence: 0.45, reason: "Non-cardiac possible" },
    ];
  } else if (includesAll(symptoms, ["fever", "cough", "fatigue"])) {
    predictions = [
      { disease: "Influenza", confidence: 0.78, reason: "High confidence viral pattern" },
      { disease: "Common Cold", confidence: 0.62, reason: "Mild symptom cluster" },
      { disease: "COVID-19", confidence: 0.58, reason: "Overlapping symptoms" },
    ];
  } else {
    predictions = [
      { disease: "Common Cold", confidence: 0.49, reason: "Limited mild symptom overlap" },
      { disease: "Influenza", confidence: 0.38, reason: "Partial viral symptom overlap" },
      { disease: "Anxiety", confidence: 0.31, reason: "Non-specific symptom pattern" },
    ];
  }

  return predictions
    .map((prediction) => ({
      ...prediction,
      urgency: urgencyFor(prediction.disease, prediction.confidence),
    }))
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

function jsonResponse(body: unknown, status: number) {
  return NextResponse.json(body, {
    status,
    headers: corsHeaders,
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = predictSchema.safeParse(body);

    if (!parsed.success) {
      return jsonResponse(
        {
          error: "Invalid request body.",
          details: parsed.error.flatten(),
        },
        400,
      );
    }

    const response: PredictResponse = {
      predictions: mockPredict(parsed.data.symptoms),
      disclaimer: DISCLAIMER,
      model_version: MODEL_VERSION,
    };

    return jsonResponse(response, 200);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return jsonResponse({ error: "Invalid JSON body." }, 400);
    }

    return jsonResponse({ error: "Internal server error." }, 500);
  }
}
