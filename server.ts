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
} from './hospitalsData.ts';
import {
  evaluateRuleBasedTriage,
  TriageResult,
} from './triageRules.ts';

type SeverityLevel = 'Critical' | 'Severe' | 'Moderate' | 'Low';

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

    // 1. Calculate nearest hospitals
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
    const ruleFallback = evaluateRuleBasedTriage(symptoms, patientAge, additional_info);
    let triageAssessment = ruleFallback;

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
   - "Critical": Life-threatening emergencies.
   - "Severe": Urgent high-risk emergencies.
   - "Moderate": Urgent care conditions needing evaluation within hours.
   - "Low": Minor, self-limiting issues.`;

        const response = await geminiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, enum: ['Critical', 'Severe', 'Moderate', 'Low'] },
                likely_condition: { type: Type.STRING },
                immediate_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                warning_signs: { type: Type.ARRAY, items: { type: Type.STRING } },
                hospital_needed: { type: Type.BOOLEAN },
                ambulance_needed: { type: Type.BOOLEAN },
                clarifying_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['severity', 'likely_condition', 'immediate_actions', 'warning_signs', 'hospital_needed', 'ambulance_needed']
            }
          }
        });

        const textOutput = response.text;
        if (textOutput) {
          const parsed = JSON.parse(textOutput);
          let severityNorm: SeverityLevel = 'Moderate';
          const sevLower = (parsed.severity || '').toLowerCase();
          if (sevLower.includes('crit')) severityNorm = 'Critical';
          else if (sevLower.includes('sev') || sevLower.includes('high')) severityNorm = 'Severe';
          else if (sevLower.includes('mod')) severityNorm = 'Moderate';
          else if (sevLower.includes('low')) severityNorm = 'Low';

          triageAssessment = {
            severity: severityNorm,
            triage_level: severityNorm === 'Critical' ? 1 : severityNorm === 'Severe' ? 2 : severityNorm === 'Moderate' ? 3 : 4,
            likely_condition: parsed.likely_condition || ruleFallback.likely_condition,
            immediate_actions: parsed.immediate_actions || ruleFallback.immediate_actions,
            warning_signs: parsed.warning_signs || ruleFallback.warning_signs,
            hospital_needed: typeof parsed.hospital_needed === 'boolean' ? parsed.hospital_needed : severityNorm !== 'Low',
            ambulance_needed: typeof parsed.ambulance_needed === 'boolean' ? parsed.ambulance_needed : severityNorm === 'Critical',
            clarifying_questions: parsed.clarifying_questions || ruleFallback.clarifying_questions,
          };
        }
      } catch (geminiError) {
        console.warn('Gemini triage generation fallback to rule engine:', geminiError);
      }
    }

    // 3. Assemble Ambulance Status and Details
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
      nearest_hospital: topHospital ? {
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
      } : null,
      alternate_hospitals: alternateHospitals,
      clarifying_questions: triageAssessment.clarifying_questions,
      patient_summary: {
        reported_symptoms: symptoms,
        reported_location: user_location_name || location,
        patient_age: patientAge,
        additional_notes: additional_info || undefined,
        coordinates: lat !== null && lon !== null ? { latitude: lat, longitude: lon, is_gps_precise: true } : null,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(finalResult);
  } catch (error: any) {
    console.error('Triage endpoint internal error:', error);
    return res.status(500).json({ error: 'Internal server error during medical triage.' });
  }
});

// Serve frontend assets cleanly from root
app.use(express.static(__dirname));

app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚑 MediAlert Server active on http://0.0.0:${PORT}`);
});
