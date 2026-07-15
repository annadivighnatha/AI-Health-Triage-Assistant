export type UrgencyLevel = "Low" | "Moderate" | "High" | "Emergency"

export interface Prediction {
  disease: string
  confidence: number
  matchedSymptoms: string[]
  missingSymptoms?: string[]
  similarity?: number
}

export interface TriageResult {
  predictions: Prediction[]
  urgency: UrgencyLevel
  explanation: string
  precautions: string[]
  recommendedTests: string[]
  foods_to_eat: string[]
  foods_to_avoid: string[]
  specialists?: { specialty: string; reason: string; urgency?: string }[]
}

export interface Consultation {
  id: string
  date: string
  symptoms: string[]
  topPrediction: string
  confidence: number
  urgency: UrgencyLevel
  result: TriageResult
}

// Common symptom vocabulary used by the autocomplete
export const COMMON_SYMPTOMS: string[] = [
  "Fever",
  "Cough",
  "Fatigue",
  "Headache",
  "Sore throat",
  "Runny nose",
  "Shortness of breath",
  "Chest pain",
  "Nausea",
  "Vomiting",
  "Diarrhea",
  "Muscle aches",
  "Loss of taste or smell",
  "Dizziness",
  "Abdominal pain",
  "Rash",
  "Chills",
  "Joint pain",
  "Sneezing",
  "Congestion",
]

// Urgency meta used across badges and explanations
export const URGENCY_META: Record<
  UrgencyLevel,
  { label: string; meaning: string; colorVar: string; description: string }
> = {
  Low: {
    label: "Green - Low",
    meaning: "Self-care is sufficient",
    colorVar: "low",
    description: "Mild, common symptoms. Monitor and rest.",
  },
  Moderate: {
    label: "Yellow - Moderate",
    meaning: "Consult a doctor (non-urgent)",
    colorVar: "moderate",
    description: "Persistent symptoms. Book a non-urgent appointment.",
  },
  High: {
    label: "Orange - High",
    meaning: "Visit within 24 hours",
    colorVar: "high",
    description: "Symptoms may worsen quickly. Seek care soon.",
  },
  Emergency: {
    label: "Red - Emergency",
    meaning: "Seek immediate care",
    colorVar: "emergency",
    description: "High-risk combination. Call emergency services now.",
  },
}

// Deterministic-feeling mock of the /predict + /explain pipeline.
// In production this would call the ML model then the LLM explanation service.
export function mockPredict(symptoms: string[]): TriageResult {
  const set = new Set(symptoms.map((s) => s.toLowerCase()))
  const has = (s: string) => set.has(s.toLowerCase())

  // Emergency rule: chest pain + shortness of breath overrides confidence
  const isEmergency = has("Chest pain") && has("Shortness of breath")

  let predictions: Prediction[]
  let explanation: string
  let precautions: string[]
  let recommendedTests: string[]
  let foods_to_eat: string[]
  let foods_to_avoid: string[]

  if (isEmergency) {
    predictions = [
      { disease: "Acute Cardiac Event", confidence: 0.62, matchedSymptoms: ["Chest pain", "Shortness of breath"] },
      { disease: "Pulmonary Embolism", confidence: 0.24, matchedSymptoms: ["Chest pain", "Shortness of breath"] },
      { disease: "Severe Anxiety Attack", confidence: 0.14, matchedSymptoms: ["Chest pain"] },
    ]
    explanation =
      "Your combination of chest pain and shortness of breath is a high-risk pattern that requires immediate evaluation. This is flagged as an emergency regardless of model confidence."
    precautions = [
      "Call emergency services immediately",
      "Do not drive yourself to the hospital",
      "Sit down and stay calm while help arrives",
      "Chew aspirin only if advised by a professional",
    ]
    recommendedTests = ["ECG / EKG", "Troponin blood test", "Chest X-ray"]
    foods_to_eat = ["Clear fluids", "Light soups", "Soft easy-to-digest meals"]
    foods_to_avoid = ["Alcohol", "Very spicy food", "Heavy fried meals"]
  } else if (has("Fever") && has("Cough") && (has("Fatigue") || has("Headache"))) {
    predictions = [
      { disease: "Influenza", confidence: 0.78, matchedSymptoms: ["Fever", "Cough", "Fatigue", "Headache"].filter(has) },
      { disease: "Common Cold", confidence: 0.14, matchedSymptoms: ["Cough", "Runny nose", "Congestion"].filter(has) },
      { disease: "COVID-19", confidence: 0.08, matchedSymptoms: ["Fever", "Cough", "Loss of taste or smell"].filter(has) },
    ]
    explanation =
      "Your symptoms closely match a common seasonal flu pattern. Fever combined with fatigue and a cough is a strong indicator of Influenza, though a cold or COVID-19 remain possible."
    precautions = [
      "Stay hydrated and rest",
      "Monitor your temperature regularly",
      "Isolate to avoid spreading infection",
      "See a doctor if fever exceeds 102 F for more than 2 days",
    ]
    recommendedTests = ["Rapid Influenza Diagnostic Test (RIDT)", "COVID-19 rapid antigen test"]
    foods_to_eat = ["Warm soups", "Fluids", "Fruit and bland meals"]
    foods_to_avoid = ["Alcohol", "Very sugary drinks", "Greasy foods"]
  } else if (has("Nausea") || has("Vomiting") || has("Diarrhea") || has("Abdominal pain")) {
    predictions = [
      { disease: "Gastroenteritis", confidence: 0.71, matchedSymptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal pain"].filter(has) },
      { disease: "Food Poisoning", confidence: 0.21, matchedSymptoms: ["Nausea", "Vomiting", "Diarrhea"].filter(has) },
      { disease: "Irritable Bowel Syndrome", confidence: 0.08, matchedSymptoms: ["Abdominal pain", "Diarrhea"].filter(has) },
    ]
    explanation =
      "Your digestive symptoms suggest a gastrointestinal infection, most likely viral gastroenteritis. These conditions are usually self-limiting but require attention to hydration."
    precautions = [
      "Drink oral rehydration fluids",
      "Eat bland foods (rice, toast, bananas)",
      "Avoid dairy and fatty foods",
      "Seek care if you cannot keep fluids down for 24 hours",
    ]
    recommendedTests = ["Stool analysis", "Basic metabolic panel"]
    foods_to_eat = ["Oral rehydration solution", "Bananas", "Rice", "Toast"]
    foods_to_avoid = ["Dairy", "Greasy foods", "Spicy foods"]
  } else {
    predictions = [
      { disease: "Upper Respiratory Infection", confidence: 0.58, matchedSymptoms: symptoms.slice(0, 3) },
      { disease: "Seasonal Allergies", confidence: 0.27, matchedSymptoms: ["Sneezing", "Runny nose", "Congestion"].filter(has) },
      { disease: "Viral Syndrome", confidence: 0.15, matchedSymptoms: symptoms.slice(0, 2) },
    ]
    explanation =
      "Based on the symptoms provided, the model suggests a mild upper respiratory or allergic pattern. Confidence is moderate, so monitoring is recommended."
    precautions = [
      "Rest and stay hydrated",
      "Use over-the-counter symptom relief as needed",
      "Track whether symptoms worsen over several days",
      "Consult a doctor if symptoms persist beyond a week",
    ]
    recommendedTests = ["Physical examination", "Allergy panel (if recurrent)"]
    foods_to_eat = ["Warm fluids", "Light balanced meals", "Fresh fruit"]
    foods_to_avoid = ["Alcohol", "Excess caffeine", "Heavy processed food"]
  }

  let urgency: UrgencyLevel = "Low"
  if (isEmergency) {
    urgency = "Emergency"
  } else {
    const top = predictions[0].confidence
    const symptomCount = symptoms.length
    if (top < 0.6 || symptomCount >= 5) urgency = "High"
    else if (top < 0.75 || symptomCount >= 3) urgency = "Moderate"
    else urgency = "Low"
  }

  return { predictions, urgency, explanation, precautions, recommendedTests, foods_to_eat, foods_to_avoid }
}

// Mock past consultations for the History page
export const MOCK_HISTORY: Consultation[] = [
  {
    id: "cons_88421",
    date: "2026-06-28",
    symptoms: ["Fever", "Cough", "Fatigue", "Headache"],
    topPrediction: "Influenza",
    confidence: 0.78,
    urgency: "Moderate",
    result: mockPredict(["Fever", "Cough", "Fatigue", "Headache"]),
  },
  {
    id: "cons_88390",
    date: "2026-06-21",
    symptoms: ["Nausea", "Vomiting", "Abdominal pain"],
    topPrediction: "Gastroenteritis",
    confidence: 0.71,
    urgency: "Moderate",
    result: mockPredict(["Nausea", "Vomiting", "Abdominal pain"]),
  },
  {
    id: "cons_88102",
    date: "2026-06-14",
    symptoms: ["Sneezing", "Runny nose", "Congestion"],
    topPrediction: "Seasonal Allergies",
    confidence: 0.58,
    urgency: "Low",
    result: mockPredict(["Sneezing", "Runny nose", "Congestion"]),
  },
  {
    id: "cons_87999",
    date: "2026-06-03",
    symptoms: ["Chest pain", "Shortness of breath"],
    topPrediction: "Acute Cardiac Event",
    confidence: 0.62,
    urgency: "Emergency",
    result: mockPredict(["Chest pain", "Shortness of breath"]),
  },
  {
    id: "cons_87810",
    date: "2026-05-27",
    symptoms: ["Sore throat", "Cough"],
    topPrediction: "Upper Respiratory Infection",
    confidence: 0.58,
    urgency: "Low",
    result: mockPredict(["Sore throat", "Cough"]),
  },
]
