import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import {
  UPLOADED_HOSPITALS_DATA,
  PRESET_LOCATIONS,
  findNearestHospitals,
  calculateHaversineDistance,
} from './src/data/hospitalsData.ts';
import {
  evaluateRuleBasedTriage,
  TriageResult,
  SeverityLevel,
} from './src/data/triageRules.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client
let geminiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('✓ Gemini API client initialized successfully');
  } catch (err) {
    console.warn('Failed to initialize Gemini API client:', err);
  }
} else {
  console.log('ℹ GEMINI_API_KEY not found in env, using clinical rule engine as primary analyzer');
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'MediAlert Emergency Triage Assistant',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Get hospital registry and presets
app.get('/api/hospitals', (_req: Request, res: Response) => {
  res.json({
    regions: Object.keys(UPLOADED_HOSPITALS_DATA).filter((k) => k !== 'default'),
    database: UPLOADED_HOSPITALS_DATA,
    presets: PRESET_LOCATIONS,
  });
});

// Main Medical Triage Endpoint
app.post('/api/triage', async (req: Request, res: Response) => {
  try {
    const {
      symptoms,
      location = 'Dwarka, Delhi',
      latitude = null,
      longitude = null,
      age = 30,
      additional_info = '',
      user_location_name = '',
    } = req.body;

    if (!symptoms || typeof symptoms !== 'string' || symptoms.trim() === '') {
      return res.status(400).json({
        error: 'Missing required field: symptoms description is required.',
      });
    }

    const lat = latitude !== null && latitude !== undefined ? parseFloat(latitude) : null;
    const lon = longitude !== null && longitude !== undefined ? parseFloat(longitude) : null;
    const patientAge = age ? parseInt(age, 10) : 30;

    // 1. Calculate nearest hospitals from uploaded dataset using exact Haversine calculation
    const nearestHospitals = findNearestHospitals(lat, lon, location, 3);
    const topHospital = nearestHospitals[0] || null;
    const alternateHospitals = nearestHospitals.slice(1).map((h) => ({
      name: h.name,
      distance_km: h.distance_km,
      phone_number: h.emergency_phone,
      ambulance_response_min: h.ambulance_response_min,
      zone: h.zone,
      type: h.type,
      available_ambulances: h.available_ambulances,
      ambulance_status: h.ambulance_status,
    }));

    // 2. Perform Medical Triage Assessment
    // First, run deterministic clinical evaluation
    const ruleFallback = evaluateRuleBasedTriage(symptoms, patientAge, additional_info);

    let triageAssessment = ruleFallback;

    // If Gemini client is active, use Gemini 3.8 Flash for advanced natural language clinical analysis
    if (geminiClient) {
      try {
        const hospitalContext = nearestHospitals
          .map(
            (h) =>
              `- ${h.name} (${h.distance_km} km away, Phone: ${h.emergency_phone}, Ambulance: ${h.has_ambulance ? 'Available (' + h.ambulance_response_min + ' mins response)' : 'Not available'})`
          )
          .join('\n');

        const prompt = `You are an emergency medical triage assistant. Analyze the patient's symptoms and determine the triage priority according to emergency medicine protocols.

Patient Info:
- Age: ${patientAge}
- Symptoms: "${symptoms}"
- Location: "${user_location_name || location}"
- Additional History / Context: "${additional_info}"

Nearest available hospitals from our verified uploaded registry:
${hospitalContext}

Strict Requirements:
1. Categorize the severity strictly into one of these 4 conditions:
   - "Critical": Life-threatening emergencies (e.g., suspected acute coronary syndrome/chest pain, stroke signs FAST, severe respiratory distress, massive hemorrhage, anaphylaxis, unconsciousness).
   - "Severe": Urgent high-risk emergencies (e.g., deep/extensive burns, compound fractures, acute abdomen, suspected poisoning, severe allergic reactions).
   - "Moderate": Urgent care conditions needing prompt medical evaluation within hours (e.g., high persistent fever, moderate lacerations needing sutures, acute dehydration, severe sprains).
   - "Low": Minor, self-limiting issues suitable for primary clinic or home management (e.g., mild cold, minor abrasion, uncomplicated mild headache).
2. Provide immediate first-aid actions (specific and evidence-based).
3. Provide critical red-flag warning signs that indicate urgent deterioration.
4. Specify clarifying clinical questions.
5. Determine whether hospital visit and ambulance dispatch are required.`;

        const response = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction:
              'You are an authoritative, clinical-grade medical emergency triage specialist. You must always categorize condition strictly into one of: "Critical", "Severe", "Moderate", "Low". Output only clean, valid JSON matching the schema.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                severity: {
                  type: Type.STRING,
                  enum: ['Critical', 'Severe', 'Moderate', 'Low'],
                  description: 'The strict triage severity category',
                },
                triage_level: {
                  type: Type.INTEGER,
                  description: '1 for Critical, 2 for Severe, 3 for Moderate, 4 for Low',
                },
                likely_condition: {
                  type: Type.STRING,
                  description: 'Short medical assessment of the likely condition',
                },
                immediate_actions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Step-by-step immediate first aid actions',
                },
                warning_signs: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Red flag warning signs requiring immediate escalation',
                },
                hospital_needed: {
                  type: Type.BOOLEAN,
                  description: 'True if immediate or urgent hospital evaluation is required',
                },
                ambulance_needed: {
                  type: Type.BOOLEAN,
                  description: 'True if ambulance dispatch is recommended (e.g., Critical or Severe immobilization)',
                },
                clarifying_questions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Clinical clarifying questions for further triage refinement',
                },
              },
              required: [
                'severity',
                'triage_level',
                'likely_condition',
                'immediate_actions',
                'warning_signs',
                'hospital_needed',
                'ambulance_needed',
              ],
            },
          },
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          // Normalize severity into strict 4 conditions
          let severityNorm: SeverityLevel = 'Moderate';
          const sevLower = (parsed.severity || '').toLowerCase();
          if (sevLower.includes('crit')) severityNorm = 'Critical';
          else if (sevLower.includes('sev') || sevLower.includes('high')) severityNorm = 'Severe';
          else if (sevLower.includes('mod')) severityNorm = 'Moderate';
          else if (sevLower.includes('low')) severityNorm = 'Low';

          triageAssessment = {
            severity: severityNorm,
            triage_level:
              severityNorm === 'Critical'
                ? 1
                : severityNorm === 'Severe'
                ? 2
                : severityNorm === 'Moderate'
                ? 3
                : 4,
            likely_condition: parsed.likely_condition || ruleFallback.likely_condition,
            immediate_actions: parsed.immediate_actions?.length
              ? parsed.immediate_actions
              : ruleFallback.immediate_actions,
            warning_signs: parsed.warning_signs?.length
              ? parsed.warning_signs
              : ruleFallback.warning_signs,
            hospital_needed:
              typeof parsed.hospital_needed === 'boolean'
                ? parsed.hospital_needed
                : severityNorm !== 'Low',
            ambulance_needed:
              typeof parsed.ambulance_needed === 'boolean'
                ? parsed.ambulance_needed
                : severityNorm === 'Critical',
            clarifying_questions: parsed.clarifying_questions || ruleFallback.clarifying_questions,
          };
        }
      } catch (geminiError) {
        console.warn('Gemini triage generation fallback to rule engine:', geminiError);
        // Fallback already assigned
      }
    }

    // 3. Assemble Ambulance Status and Hospital Details
    let ambulanceAvailabilityText = 'No ambulance required for this severity level';
    if (topHospital) {
      if (topHospital.has_ambulance && topHospital.emergency_available) {
        ambulanceAvailabilityText = `${topHospital.ambulance_status || 'Available'} at ${topHospital.name} (${topHospital.available_ambulances || 3} units on standby · ~${topHospital.ambulance_response_min} mins ETA)`;
      } else {
        ambulanceAvailabilityText = 'On-site ambulance currently unlisted; direct 112 dispatch recommended';
      }
    }

    const finalResult: TriageResult = {
      severity: triageAssessment.severity,
      triage_level: triageAssessment.triage_level,
      likely_condition: triageAssessment.likely_condition,
      immediate_actions: triageAssessment.immediate_actions,
      warning_signs: triageAssessment.warning_signs,
      hospital_needed: triageAssessment.hospital_needed,
      ambulance_needed: triageAssessment.ambulance_needed,
      ambulance_availability: ambulanceAvailabilityText,
      nearest_hospital: topHospital
        ? {
            name: topHospital.name,
            address: topHospital.address,
            distance_km: topHospital.distance_km,
            phone_number: topHospital.emergency_phone,
            ambulance_available: topHospital.has_ambulance && topHospital.emergency_available,
            ambulance_response_min: topHospital.ambulance_response_min,
            specialization: topHospital.specialization,
            zone: topHospital.zone,
            type: topHospital.type,
            available_ambulances: topHospital.available_ambulances,
            ambulance_status: topHospital.ambulance_status,
          }
        : null,
      alternate_hospitals: alternateHospitals,
      clarifying_questions: triageAssessment.clarifying_questions,
      patient_summary: {
        reported_symptoms: symptoms,
        reported_location: user_location_name || location,
        patient_age: patientAge,
        additional_notes: additional_info || undefined,
        coordinates:
          lat !== null && lon !== null
            ? {
                latitude: lat,
                longitude: lon,
                is_gps_precise: true,
              }
            : null,
      },
      timestamp: new Date().toISOString(),
    };

    // Clean JSON format response
    return res.status(200).json(finalResult);
  } catch (error: any) {
    console.error('Triage endpoint internal error:', error);
    return res.status(500).json({
      error: 'An unexpected internal error occurred during medical triage.',
      message: error?.message || String(error),
    });
  }
});

// -------------------------------------------------------------
// Vite middleware for Dev / Static files for Prod
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
   // Explicitly serve static visual elements from the compiled dist directory layout
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// CRUCIAL: Bind precisely to 0.0.0.0 to route cloud platform traffic safely
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚑 MediAlert Server active on port ${PORT}`);
});
