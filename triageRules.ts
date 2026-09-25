export type SeverityLevel = "Critical" | "Severe" | "Moderate" | "Low";

export interface TriageResult {
  severity: SeverityLevel;
  triage_level: number; // 1 = Critical, 2 = Severe, 3 = Moderate, 4 = Low
  likely_condition: string;
  immediate_actions: string[];
  warning_signs: string[];
  hospital_needed: boolean;
  ambulance_needed: boolean;
  ambulance_availability: string; // e.g. "Available - Estimated response time: 8 mins"
  nearest_hospital: {
    name: string;
    address: string;
    distance_km: number;
    phone_number: string;
    ambulance_available: boolean;
    ambulance_response_min: number;
    specialization: string[];
    zone?: string;
    type?: string;
    available_ambulances?: number;
    ambulance_status?: string;
  } | null;
  alternate_hospitals?: {
    name: string;
    distance_km: number;
    phone_number: string;
    ambulance_response_min: number;
    zone?: string;
    type?: string;
    available_ambulances?: number;
    ambulance_status?: string;
  }[];
  clarifying_questions: string[];
  patient_summary: {
    reported_symptoms: string;
    reported_location: string;
    patient_age?: number;
    additional_notes?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
      is_gps_precise: boolean;
    } | null;
  };
  timestamp: string;
}

export interface SampleTestCase {
  id: string;
  title: string;
  expectedSeverity: SeverityLevel;
  symptoms: string;
  location: string;
  age: number;
  additional_info: string;
  description: string;
}

export const SAMPLE_TRIAGE_CASES: SampleTestCase[] = [
  {
    id: "case_critical_cardiac",
    title: "🚨 Critical: Acute Chest Pain & Shortness of Breath",
    expectedSeverity: "Critical",
    symptoms: "Sudden crushing retrosternal chest pain radiating to left arm, neck and jaw. Profuse cold sweating, shortness of breath, and extreme dizziness.",
    location: "Dwarka, Delhi",
    age: 58,
    additional_info: "History of hypertension and high cholesterol. Symptoms started 25 minutes ago.",
    description: "Acute Coronary Syndrome / Myocardial Infarction red flags requiring immediate ambulance."
  },
  {
    id: "case_severe_burn",
    title: "🔴 Severe: Deep Second-Degree Oil Burn",
    expectedSeverity: "Severe",
    symptoms: "Large boiling cooking oil spill over right forearm and hand. Severe blistering, peeling skin, intense throbbing pain, and swelling.",
    location: "Central Delhi",
    age: 34,
    additional_info: "Burn area approx 8x12 cm. Patient is conscious and shivering slightly from shock.",
    description: "Extensive partial-thickness burn requiring urgent emergency department burn care."
  },
  {
    id: "case_moderate_fever",
    title: "🟡 Moderate: High Fever & Persistent Productive Cough",
    expectedSeverity: "Moderate",
    symptoms: "Fever of 102.5°F for 36 hours with yellowish sputum cough, chest wall soreness from coughing, chills, and fatigue. No breathing difficulty.",
    location: "South Delhi",
    age: 29,
    additional_info: "Taking paracetamol with only temporary reduction. Breathing rate is normal.",
    description: "Suspected lower respiratory infection requiring prompt outpatient / clinic evaluation."
  },
  {
    id: "case_low_cold",
    title: "🟢 Low: Mild Seasonal Cold & Sneezing",
    expectedSeverity: "Low",
    symptoms: "Mild scratchy throat, clear runny nose, intermittent sneezing, and slight head heaviness for the past 12 hours. No fever, no cough.",
    location: "Dwarka, Delhi",
    age: 24,
    additional_info: "No underlying medical conditions. Appetite and energy levels normal.",
    description: "Upper respiratory viral illness suitable for supportive home care."
  }
];

/**
 * Deterministic clinical keyword and rule evaluator
 * Used when running client-side, offline, or as a reliable fail-safe fallback
 */
export function evaluateRuleBasedTriage(
  symptomsText: string,
  age: number = 30,
  additionalInfo: string = ""
): {
  severity: SeverityLevel;
  triage_level: number;
  likely_condition: string;
  immediate_actions: string[];
  warning_signs: string[];
  hospital_needed: boolean;
  ambulance_needed: boolean;
  clarifying_questions: string[];
} {
  const combined = `${symptomsText} ${additionalInfo}`.toLowerCase();

  // Strip negated statements like "no fever", "without fever", "no chills", etc.
  let cleanedText = combined
    .replace(/\b(no|without|denies|neither)\s+(fever|chills|vomiting|headache|pain|cough|breathing difficulty)\b/g, '')
    .replace(/\bno\s+shortness\s+of\s+breath\b/g, '');

  // 1. CRITICAL RULES
  const criticalKeywords = [
    "chest pain", "heart attack", "crushing chest", "radiating to arm", "radiating to jaw",
    "stroke", "facial droop", "slurred speech", "loss of speech", "paralysis", "hemiplegia",
    "unconscious", "unresponsive", "passed out", "fainted and not waking",
    "cannot breathe", "severe difficulty breathing", "gasping", "blue lips", "cyanosis", "stridor", "choking",
    "arterial bleed", "spurting blood", "massive bleeding", "profuse hemorrhage",
    "anaphylaxis", "throat closing", "tongue swollen", "severe allergic shock",
    "cardiac arrest", "no pulse"
  ];

  const hasCritical = criticalKeywords.some((k) => cleanedText.includes(k));

  if (hasCritical) {
    let condition = "Suspected Acute Cardiopulmonary / Neurovascular Emergency";
    if (cleanedText.includes("chest") || cleanedText.includes("heart")) {
      condition = "Suspected Acute Coronary Syndrome / Myocardial Infarction";
    } else if (cleanedText.includes("stroke") || cleanedText.includes("slur") || cleanedText.includes("droop")) {
      condition = "Suspected Acute Cerebrovascular Event (Stroke)";
    } else if (cleanedText.includes("bleed") || cleanedText.includes("blood")) {
      condition = "Severe Uncontrolled Hemorrhage / Trauma";
    } else if (cleanedText.includes("anaphylaxis") || cleanedText.includes("throat closing")) {
      condition = "Severe Anaphylactic Reaction";
    }

    return {
      severity: "Critical",
      triage_level: 1,
      likely_condition: condition,
      immediate_actions: [
        "Call 112 / 102 for emergency ambulance dispatch immediately",
        "Have patient sit or lie down comfortably in a position that eases breathing",
        "Loosen all tight clothing around neck and waist; do not leave patient alone",
        cleanedText.includes("chest") ? "If patient is conscious and not allergic to aspirin, consider 325mg chewable aspirin under medical dispatch advice" : "Maintain open airway and monitor breathing continuously",
        "Prepare emergency contact numbers and medical history records for arriving paramedics"
      ],
      warning_signs: [
        "Sudden loss of consciousness or unresponsiveness",
        "Cyanosis (bluish or grey tint on lips, face, or fingernails)",
        "Rapid deterioration of pulse or respiratory effort",
        "Seizure activity or sudden onset delirium"
      ],
      hospital_needed: true,
      ambulance_needed: true,
      clarifying_questions: [
        "Is the patient conscious, alert, and able to respond right now?",
        "When exactly did the symptoms start (exact minutes/hours)?",
        "Is there any known history of heart disease, stroke, or severe allergies?"
      ]
    };
  }

  // 2. SEVERE RULES
  const severeKeywords = [
    "severe burn", "boiling oil", "deep burn", "third degree", "blistered burn",
    "broken bone", "compound fracture", "bone visible", "open fracture", "dislocated",
    "severe abdominal", "acute belly pain", "vomiting blood", "rectal bleeding",
    "poison", "swallowed chemical", "overdose", "snake bite", "toxic ingestion",
    "head trauma", "head injury with vomiting", "lost consciousness briefly",
    "fever 104", "high fever with stiff neck", "seizure", "convulsion",
    "severe asthma", "asthma attack", "inhaler not working"
  ];

  const hasSevere = severeKeywords.some((k) => cleanedText.includes(k));

  if (hasSevere) {
    let condition = "Urgent Acute Medical Condition / Significant Trauma";
    if (cleanedText.includes("burn")) condition = "Severe Partial/Full-Thickness Burn Injury";
    else if (cleanedText.includes("fracture") || cleanedText.includes("broken")) condition = "Suspected Fracture / Orthopedic Trauma";
    else if (cleanedText.includes("poison") || cleanedText.includes("chemical") || cleanedText.includes("overdose")) condition = "Acute Poisoning / Toxic Exposure";
    else if (cleanedText.includes("abdominal")) condition = "Acute Abdomen (Suspected Surgical Evaluation)";

    return {
      severity: "Severe",
      triage_level: 2,
      likely_condition: condition,
      immediate_actions: [
        "Proceed immediately to the nearest Emergency Department",
        "Call hospital emergency line or dispatch ambulance if transport is unsafe",
        cleanedText.includes("burn") ? "Cool the burn with gentle running tap water for 10-20 minutes; do NOT apply ice, butter, or paste" : "Immobilize the affected area and avoid unnecessary movement",
        "Keep patient calm, warm, and resting; do NOT give food or oral fluids if surgery might be required"
      ],
      warning_signs: [
        "Inability to tolerate oral fluids or persistent intractable vomiting",
        "Spreading numbness, pallor, or loss of distal pulse",
        "Spiking fever accompanied by extreme lethargy or neck stiffness"
      ],
      hospital_needed: true,
      ambulance_needed: true,
      clarifying_questions: [
        "Can the patient safely walk or be transported in a private vehicle?",
        "Has the patient had anything to eat or drink in the last 6 hours?",
        "Is pain rapidly intensifying or radiating elsewhere?"
      ]
    };
  }

  // 3. MODERATE RULES
  const moderateKeywords = [
    "fever", "chills", "moderate pain", "sprain", "twisted ankle", "swollen ankle",
    "vomiting", "diarrhea", "dehydration", "headache", "migraine", "earache",
    "urinary burning", "painful urination", "cut needing stitches", "deep cut",
    "flu symptoms", "body aches", "101", "102", "103"
  ];

  const hasModerate = moderateKeywords.some((k) => cleanedText.includes(k));

  if (hasModerate) {
    let condition = "Moderate Acute Illness / Musculoskeletal Strain";
    if (cleanedText.includes("fever") || cleanedText.includes("chills")) condition = "Febrile Acute Illness / Systemic Infection";
    else if (cleanedText.includes("vomit") || cleanedText.includes("diarrhea")) condition = "Acute Gastroenteritis / Dehydration Risk";
    else if (cleanedText.includes("sprain") || cleanedText.includes("ankle")) condition = "Soft Tissue Sprain / Strain";

    return {
      severity: "Moderate",
      triage_level: 3,
      likely_condition: condition,
      immediate_actions: [
        "Seek medical evaluation at an urgent care center or hospital outpatient clinic today",
        "Rest and keep hydrated with oral rehydration salts (ORS) or electrolyte water",
        "Monitor body temperature every 4 hours and log changes",
        "Take over-the-counter antipyretic/analgesic if prescribed and tolerated"
      ],
      warning_signs: [
        "Fever rising above 103°F (39.4°C) or lasting more than 3 consecutive days",
        "Inability to keep liquids down for more than 12 hours",
        "New onset of shortness of breath or persistent chest discomfort"
      ],
      hospital_needed: true,
      ambulance_needed: false,
      clarifying_questions: [
        "How long have these symptoms been present?",
        "Are you able to keep fluids down without vomiting?",
        "Are you experiencing any shortness of breath or chest pain?"
      ]
    };
  }

  // 4. LOW (DEFAULT)
  return {
    severity: "Low",
    triage_level: 4,
    likely_condition: "Minor Self-Limiting Condition / Mild Viral Syndrome",
    immediate_actions: [
      "Manage symptoms with rest, warm fluids, and supportive home care",
      "Keep a log of symptoms and note any progression over the next 24-48 hours",
      "Consult a local clinic or telehealth doctor if symptoms do not improve in 3-5 days"
    ],
    warning_signs: [
      "Sudden development of high fever, chills, or difficulty breathing",
      "Severe headache accompanied by visual disturbances or stiff neck",
      "Symptoms persisting beyond 7 days without improvement"
    ],
    hospital_needed: false,
    ambulance_needed: false,
    clarifying_questions: [
      "Have you noticed any fever or body chills?",
      "Are your symptoms interfering with sleeping or eating?",
      "Do you have any chronic medical conditions like asthma or diabetes?"
    ]
  };
}
