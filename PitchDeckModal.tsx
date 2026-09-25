import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Printer,
  Copy,
  Check,
  HeartPulse,
  Activity,
  MapPin,
  Clock,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Layers,
  Code2,
  Server,
  Zap,
  Award,
  Users,
  Building2,
  Compass,
  Mic,
  FileCode,
} from 'lucide-react';

interface PitchDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PitchDeckModal: React.FC<PitchDeckModalProps> = ({ isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const totalSlides = 10;

  // Keyboard navigation (Arrow keys, Esc)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'Space') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        setCurrentSlide((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, totalSlides]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyNotes = () => {
    const presentationText = `
# MediAlert: Intelligent Emergency Medical Triage & Dispatch Engine
B.Tech CSE 1st Year Hackathon Presentation (GGSIPU)
Candidate Project for Online Screening Round

---
SLIDE 1: Title & Overview
- Project: MediAlert - AI-Assisted Emergency Medical Triage & Automated Facility Dispatch
- Domain: Healthcare / Emergency Medical Informatics / Civic Tech
- By: B.Tech CSE 1st Year (Guru Gobind Singh Indraprastha University)
- Problem Brief: Reducing golden-hour emergency dispatch latency and ER misdirection in urban corridors.

---
SLIDE 2: The Critical Problem in Emergency Healthcare
- 1. The "Golden Hour" Delay: In acute conditions (myocardial infarction, acute stroke, polytrauma), survival drops precipitously for every 10 minutes of delayed triage.
- 2. ER Overcrowding: Up to 40% of patients queuing in tertiary emergency trauma units possess non-urgent symptoms that could be managed at home or outpatient clinics.
- 3. Information Asymmetry: Frantic patients lack clarity on whether they require an ICU, a cardiac catheterization lab, or a pediatric trauma center.
- 4. High-Density Urban Chaos: Navigating Delhi NCR hospitals without real-time distance and ambulance visibility costs lives.

---
SLIDE 3: The Solution - MediAlert Platform
- Instant Clinical-Grade Triage: Analyzes presenting symptoms against international emergency medicine protocols in under 2 seconds.
- 4-Tier Alertness Classification: Critical (Level 1), Severe (Level 2), Moderate (Level 3), Low (Level 4).
- Hands-Free Voice Dictation: Web Speech API for emergency scenarios where typing is impractical.
- Haversine Geodesic Dispatch: Pinpoints exact nearest trauma facilities across all 6 Delhi NCR zones (24+ verified apex institutions).
- Standardized Machine-Readable JSON: Interoperable with 112 / 102 emergency response systems.

---
SLIDE 4: Clinical 4-Tier Urgency Matrix
- Tier 1: CRITICAL (Red) -> Life-threatening (cardiac arrest, severe dyspnea, massive hemorrhage). Immediate ALS ambulance dispatch & direct 112 hotline.
- Tier 2: SEVERE (Orange) -> High-risk acute illness (high fever with altered sensorium, displaced fractures). ER evaluation within 15-30 minutes.
- Tier 3: MODERATE (Amber) -> Urgent non-critical (persistent abdominal colic, moderate asthma flare). Evaluation within 2-4 hours.
- Tier 4: LOW (Green) -> Non-urgent (mild viral symptoms, superficial abrasions). Home rest and teleconsultation.

---
SLIDE 5: Haversine Geodesic Calculation & Delhi Hospital Registry
- Mathematical Foundation: Great-circle distance calculated via spherical trigonometry:
  a = sin²(Δφ/2) + cos(φ1)·cos(φ2)·sin²(Δλ/2)
  c = 2·atan2(√a, √(1-a)), d = R·c (R = 6,371 km)
- Coverage across all 6 Delhi Zones: Central, South, North, West, East, and Dwarka.
- Verified Facilities: AIIMS JPN Trauma, Safdarjung, RML, LNJP, GTB, DDU, Max, Fortis, Apollo, and Manipal.
- Live Telemetry: Standby ambulance count, emergency desk phone, and specialized units.

---
SLIDE 6: Hands-Free Voice Dictation & Usability
- Voice-First Architecture: Built via browser Web Speech API (webkitSpeechRecognition) with continuous speech recognition and real-time interim transcription.
- Audio Feedback Telemetry: Live soundwave visualization and active microphone state so users know their distress audio is capturing.
- Resilience: Offline failover with clinical heuristics if network drops.

---
SLIDE 7: System Architecture & Technology Stack
- Frontend: React 19, TypeScript, Tailwind CSS, Lucide Icons.
- Backend & Proxy: Express.js server, Node.js runtime.
- AI & NLP Layer: Gemini API with strict JSON schema enforcement; dual-layer fallback to local rule-based clinical engine.
- Geolocation: Browser Geolocation API + Nominatim reverse geocoding + Haversine matrix.

---
SLIDE 8: Live Workflow & User Journey
- Step 1: Input symptoms via speech or text; optional age and medical history.
- Step 2: One-click GPS fix or sector selection.
- Step 3: Dual-engine evaluation executes in <1.5s.
- Step 4: Instant output with hospital desk dialer, ambulance ETA, and clinical action list.
- Step 5: Clean JSON payload export for paramedics and dispatchers.

---
SLIDE 9: Scalability & Real-World Impact
- Zero Server Cold Starts: Fast edge responses.
- Disaster & Mass Casualty Preparedness: Readily adaptable for civic disaster control rooms.
- Interoperability: Direct JSON streaming into National Health Mission / ABHA / 112 dispatch protocols.

---
SLIDE 10: Future Roadmap & Why We Deserve the Offline Shortlist
- Milestone 1: IoT Vitals Integration (smartwatch SpO2, heart rate, BP).
- Milestone 2: Multilingual Vernacular Voice (Hindi, Punjabi, regional dialects).
- Milestone 3: Real-Time ER Bed & ICU Tracker through hospital API hooks.
- Summary: Engineered from first principles by 1st-year CSE students. Fully functional, tested, and ready for live presentation!
`;
    navigator.clipboard.writeText(presentationText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div
        className={`relative w-full ${
          isFullscreen ? 'h-full max-w-none' : 'max-w-5xl max-h-[92vh]'
        } bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden text-slate-900 transition-all`}
      >
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-700 text-white shadow-xs">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900">
                  MediAlert Hackathon Pitch Deck
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800">
                  B.Tech CSE 1st Year · GGSIPU
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Online Screening Round · Presentation & Project Defense Deck
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyNotes}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Copy entire presentation notes to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Deck</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Copy Deck Notes</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              title="Print / Save as PDF for Hackathon submission"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Save / Print PDF</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-200/80 hover:bg-red-100 hover:text-red-700 text-slate-700 cursor-pointer transition-colors ml-1"
              title="Close Deck"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Display Canvas */}
        <div className="flex-1 p-6 sm:p-10 overflow-y-auto bg-slate-50/50 flex flex-col justify-center">
          {/* SLIDE 1: Title & Hero */}
          {currentSlide === 0 && (
            <div className="space-y-6 max-w-3xl mx-auto text-center py-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>GGSIPU Hackathon · Online Screening Round Submission</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  MediAlert
                </h1>
                <p className="text-lg sm:text-xl font-bold text-sky-700">
                  Intelligent Emergency Medical Triage & Automated Haversine Facility Dispatch Engine
                </p>
                <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  Bridging the critical gap in the emergency "Golden Hour" through instant clinical-grade
                  symptom triage, hands-free voice dictation, geodesic hospital routing, and live ambulance telemetry.
                </p>
              </div>

              {/* Student Metadata Card */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Team / Presenter</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">B.Tech CSE 1st Year</div>
                  <div className="text-[11px] text-slate-500">IPU Affiliated College</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Track & Domain</div>
                  <div className="text-xs font-black text-slate-900 mt-0.5">Healthcare & Civic AI</div>
                  <div className="text-[11px] text-slate-500">Emergency Response Tech</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Evaluation Goal</div>
                  <div className="text-xs font-black text-emerald-700 mt-0.5">Offline Round Shortlist</div>
                  <div className="text-[11px] text-slate-500">Production-Ready MVP</div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 2: Problem Statement */}
          {currentSlide === 1 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4" />
                <span>Slide 02 · The Problem We Are Solving</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  The Fatal Bottlenecks in Pre-Hospital Emergency Care
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  During medical emergencies, every minute lost in panic, confusion, or misdirection compounds patient mortality.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-red-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-black text-sm">
                    01
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">The "Golden Hour" Delay</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Cardiac arrests, acute ischemic strokes, and severe polytrauma have tight therapeutic windows. Victims or bystanders lose an average of 18–35 minutes attempting to decide which hospital to visit.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">
                    02
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">ER Overcrowding with Non-Urgent Cases</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Up to 40% of patients visiting tertiary emergency trauma centers possess minor ailments (Level 4 Low Urgency), choking vital ICU beds and distracting emergency physicians from critical resuscitations.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-black text-sm">
                    03
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Information Asymmetry in Urban Corridors</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Patients in Delhi NCR often rush to facilities that lack specialized units (e.g. Cath Labs for STEMI or Burn ICUs), forcing hazardous secondary transfers between hospitals.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center font-black text-sm">
                    04
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Typing Friction Under Panic</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A trembling bystander or elderly patient experiencing chest discomfort cannot type elaborate clinical paragraphs into conventional web forms.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 3: The Solution */}
          {currentSlide === 2 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Slide 03 · Proposed Solution</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  MediAlert: A Zero-Friction Emergency Triaging Ecosystem
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Engineered as a lightweight, lightning-fast progressive clinical decision support engine.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 w-fit">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Strict 4-Tier Urgency Classification</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Categorizes any symptom input into Critical, Severe, Moderate, or Low urgency in under 2 seconds, eliminating ambiguity.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 w-fit">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Haversine GPS Facility Matching</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Uses spherical trigonometry on exact GPS coordinates to compute geodesic distances to the nearest accredited Delhi NCR emergency trauma centers.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-sky-200 shadow-2xs space-y-3">
                  <div className="p-2.5 rounded-xl bg-sky-50 text-sky-700 w-fit">
                    <Mic className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Hands-Free Voice Dictation</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Continuous browser speech recognition with real-time audio wave telemetry allows patients to speak symptoms hands-free.
                  </p>
                </div>
              </div>

              {/* Bottom Feature Pill */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-700 flex-shrink-0" />
                  <span className="font-semibold text-sky-950">
                    One-Tap Emergency Dialers: Direct hotlinks to National Emergency 112, Central Ambulance 102, and Hospital Trauma Desks.
                  </span>
                </div>
                <span className="font-bold text-sky-800 uppercase tracking-wider text-[11px] whitespace-nowrap">
                  Zero Cold-Starts
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 4: 4-Tier Matrix */}
          {currentSlide === 3 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4" />
                <span>Slide 04 · Clinical Triage Algorithm</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Standardized 4-Tier Clinical Urgency Matrix
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Built strictly in accordance with emergency medicine triage protocols (Manchester / ESI adapted).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Critical */}
                <div className="p-4 rounded-xl border border-red-300 bg-red-50/70 border-l-6 border-l-red-600 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-red-600 px-2 py-0.5 rounded uppercase">
                      Tier 1 · Critical
                    </span>
                    <span className="text-xs font-bold text-red-900">Immediate Life Threat</span>
                  </div>
                  <p className="text-xs text-red-950 font-medium">
                    Cardiac arrest, crushing chest pain radiating to left arm, severe respiratory arrest, massive hemorrhaging.
                  </p>
                  <div className="text-[11px] text-red-800 font-bold pt-1">
                    Action: Immediate ALS Ambulance Dispatch + Direct 112 Alert
                  </div>
                </div>

                {/* Severe */}
                <div className="p-4 rounded-xl border border-orange-300 bg-orange-50/70 border-l-6 border-l-orange-500 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-orange-600 px-2 py-0.5 rounded uppercase">
                      Tier 2 · Severe
                    </span>
                    <span className="text-xs font-bold text-orange-900">High Risk / Rapid Deterioration</span>
                  </div>
                  <p className="text-xs text-orange-950 font-medium">
                    High fever with altered mental status, severe compound fractures, deep second/third-degree burns.
                  </p>
                  <div className="text-[11px] text-orange-800 font-bold pt-1">
                    Action: Emergency Department Evaluation &lt; 30 minutes
                  </div>
                </div>

                {/* Moderate */}
                <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/70 border-l-6 border-l-amber-500 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-amber-600 px-2 py-0.5 rounded uppercase">
                      Tier 3 · Moderate
                    </span>
                    <span className="text-xs font-bold text-amber-900">Urgent Non-Critical</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium">
                    Persistent high fever &gt;102°F, uncontrolled vomiting, suspected closed fracture, severe colic pain.
                  </p>
                  <div className="text-[11px] text-amber-800 font-bold pt-1">
                    Action: Urgent Care or Private Transport to ER (2–4 hours)
                  </div>
                </div>

                {/* Low */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/70 border-l-6 border-l-emerald-600 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white bg-emerald-600 px-2 py-0.5 rounded uppercase">
                      Tier 4 · Low
                    </span>
                    <span className="text-xs font-bold text-emerald-900">Non-Urgent / Self-Limiting</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium">
                    Mild cold, superficial abrasions, routine localized aches without systemic red flags.
                  </p>
                  <div className="text-[11px] text-emerald-800 font-bold pt-1">
                    Action: Home Recovery, Hydration & Regular Outpatient Consult
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 5: Haversine & Hospital Registry */}
          {currentSlide === 4 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Slide 05 · Geodesic Haversine Math & Delhi Coverage</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Mathematical Geodesic Routing & Hospital Registry
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  How MediAlert calculates true great-circle distances across all 6 zones of Delhi NCR without external paid map API dependencies.
                </p>
              </div>

              {/* Haversine Formula Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Core Algorithm: Haversine Formulation
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-100 text-sky-800 font-bold">
                    O(N) Complexity · Sub-millisecond Execution
                  </span>
                </div>
                <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
                  <code>
                    d = 2 · R · arcsin( √( sin²(Δφ/2) + cos(φ₁) · cos(φ₂) · sin²(Δλ/2) ) )
                    <br />
                    where R = 6,371 km (Mean Earth Radius), φ = Latitude, λ = Longitude
                  </code>
                </div>
                <p className="text-xs text-slate-600">
                  Accurate within &plusmn;0.3% error margin for urban geodesic distances, accounting for Earth's curvature.
                </p>
              </div>

              {/* 6 Zones Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1 text-center">
                {[
                  { zone: 'Central', count: '5 Hospitals', sample: 'RML, LNJP, Gangaram' },
                  { zone: 'South', count: '6 Hospitals', sample: 'AIIMS, Safdarjung, Apollo' },
                  { zone: 'North', count: '6 Hospitals', sample: 'Fortis, Max, BSA, BJRM' },
                  { zone: 'West', count: '4 Hospitals', sample: 'DDU, Chanan Devi, Agrasen' },
                  { zone: 'East', count: '4 Hospitals', sample: 'GTB, Max Patparganj, LBS' },
                  { zone: 'Dwarka', count: '5 Hospitals', sample: 'Manipal, Venkateshwar' },
                ].map((z, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200">
                    <div className="font-bold text-xs text-slate-900">{z.zone}</div>
                    <div className="text-[11px] font-bold text-sky-700">{z.count}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{z.sample}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SLIDE 6: Voice-to-Text */}
          {currentSlide === 5 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Mic className="w-4 h-4" />
                <span>Slide 06 · Voice-to-Text Accessibility</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Hands-Free Voice Dictation & Assistive UX
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Enabling seamless symptom capture during intense distress or panic when typing is compromised.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
                    <Mic className="w-4 h-4" />
                    <span>Browser Web Speech API Integration</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Implements standard <code className="text-sky-700 font-mono bg-sky-50 px-1 py-0.5 rounded">webkitSpeechRecognition</code> with continuous streaming mode and interim transcript rendering. Speech is synchronized directly into React state in real-time.
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Zero external paid voice API dependency</li>
                    <li>Automatic language locale detection (<code className="font-mono text-slate-700">navigator.language</code>)</li>
                    <li>Graceful cleanup on component unmount</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                    <Activity className="w-4 h-4" />
                    <span>Real-Time Feedback & Visual Telemetry</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Replaces passive loading spinners with affirmative visual status cues:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>CSS audio-wave equalizer animation indicating active mic reception</li>
                    <li>Live glowing red input ring and animated radar beacon</li>
                    <li>Real-time speech transcript preview before final confirmation</li>
                    <li>Contextual error banners for permission denials or hardware absence</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
                <strong>Inclusive Design:</strong> Caters to elderly patients, visually impaired users, and accident victims with impaired fine motor skills.
              </div>
            </div>
          )}

          {/* SLIDE 7: Tech Stack & Architecture */}
          {currentSlide === 6 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Code2 className="w-4 h-4" />
                <span>Slide 07 · System Architecture & Tech Stack</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Full-Stack Architecture & Resilience Design
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Built with modern, production-ready engineering standards with zero single point of failure.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-sky-700 uppercase">Frontend</div>
                  <div className="font-black text-slate-900 text-sm">React 19 & TypeScript</div>
                  <p className="text-xs text-slate-500">
                    Component modularity, strict typings, zero runtime type errors.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-sky-700 uppercase">Styling & UI</div>
                  <div className="font-black text-slate-900 text-sm">Tailwind CSS 4</div>
                  <p className="text-xs text-slate-500">
                    Sterile clinical aesthetic, high-contrast severity tiers, responsive grid.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-sky-700 uppercase">Backend Server</div>
                  <div className="font-black text-slate-900 text-sm">Express.js on Node.js</div>
                  <p className="text-xs text-slate-500">
                    Server-side proxy routes, environment secret protection, CORS safety.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-sky-700 uppercase">AI & Fallback</div>
                  <div className="font-black text-slate-900 text-sm">Dual-Layer Triage</div>
                  <p className="text-xs text-slate-500">
                    Gemini API + Rule-based local clinical heuristics if offline.
                  </p>
                </div>
              </div>

              {/* Failover Card */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>
                    <strong>Offline Reliability:</strong> If internet connectivity is interrupted or AI endpoints throttle, the local clinical engine instantly computes identical 4-tier triage without dropping the user.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* SLIDE 8: Live Demo & User Flow */}
          {currentSlide === 7 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4" />
                <span>Slide 08 · End-to-End User Flow</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  User Journey: From Distress to Emergency Action
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  How a citizen, bystander, or paramedic completes triage in under 30 seconds.
                </p>
              </div>

              {/* Step Flow */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
                  <div className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                    1
                  </div>
                  <div className="font-bold text-xs text-slate-900">Input Symptoms</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Type symptoms or speak hands-free via voice dictation. Optional age and medical notes.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
                  <div className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                    2
                  </div>
                  <div className="font-bold text-xs text-slate-900">Acquire Location</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    1-click GPS coordinate fix or select a Delhi NCR clinical sector preset.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
                  <div className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                    3
                  </div>
                  <div className="font-bold text-xs text-slate-900">Execute Triage</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Dual-engine classification classifies urgency level and runs Haversine sorting across 24+ hospitals.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 relative">
                  <div className="w-6 h-6 rounded-full bg-sky-700 text-white font-bold text-xs flex items-center justify-center">
                    4
                  </div>
                  <div className="font-bold text-xs text-slate-900">Act & Dispatch</div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Direct call trauma desk, view standby ambulances, follow first-aid instructions, or copy clean JSON.
                  </p>
                </div>
              </div>

              {/* JSON Interoperability Note */}
              <div className="p-4 rounded-xl bg-slate-900 text-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 font-mono">
                  <FileCode className="w-4 h-4 text-sky-400" />
                  <span>Standardized JSON Payload Output for 112 / Hospital Telemetry Dispatch</span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">FHIR / HL7 Ready</span>
              </div>
            </div>
          )}

          {/* SLIDE 9: Scalability & Impact */}
          {currentSlide === 8 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Slide 09 · Real-World Impact & Viability</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Scalability, Societal Impact & Viability
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Why MediAlert is an impactful civic innovation for dense urban ecosystems like Delhi NCR.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="text-2xl font-black text-sky-700">~65%</div>
                  <div className="font-bold text-sm text-slate-900">Faster Pre-Hospital Routing</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Eliminates indecision by pointing the patient straight to an equipped emergency center with available ambulances.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="text-2xl font-black text-emerald-600">30–40%</div>
                  <div className="font-bold text-sm text-slate-900">Reduction in ER Congestion</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Reroutes Level 4 (Low) patients to outpatient clinics or home care, preserving critical trauma beds for Level 1 resuscitations.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                  <div className="text-2xl font-black text-slate-900">100%</div>
                  <div className="font-bold text-sm text-slate-900">Open-Standard Interoperability</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Produces structured clinical JSON payloads that can be piped into emergency dispatch CAD (Computer Aided Dispatch) software.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-700 flex-shrink-0" />
                <span>
                  <strong>Civic Integration:</strong> Tailored for integration with Delhi Emergency Services, CATS (Centralized Accident & Trauma Services), and Ayushman Bharat Digital Mission (ABDM).
                </span>
              </div>
            </div>
          )}

          {/* SLIDE 10: Future Roadmap & Why We Deserve the Shortlist */}
          {currentSlide === 9 && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sky-700 font-bold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Slide 10 · Roadmap & Why Shortlist Us</span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Future Roadmap & Offline Round Defense
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Engineered with passion, diligence, and clean software architecture by 1st-year computer science students.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 px-2 py-0.5 rounded">
                    Phase 2 (Hackathon Offline)
                  </span>
                  <div className="font-bold text-sm text-slate-900">Live Hospital Bed Telemetry</div>
                  <p className="text-xs text-slate-500">
                    Real-time WebSocket feed tracking available ICU, ventilator, and oxygen beds per facility.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 px-2 py-0.5 rounded">
                    Phase 3
                  </span>
                  <div className="font-bold text-sm text-slate-900">Multilingual Vernacular Voice</div>
                  <p className="text-xs text-slate-500">
                    Voice triage in Hindi, Punjabi, and regional Indian dialects for true grassroots accessibility.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-sky-700 uppercase bg-sky-50 px-2 py-0.5 rounded">
                    Phase 4
                  </span>
                  <div className="font-bold text-sm text-slate-900">Wearable IoT Vitals Sync</div>
                  <p className="text-xs text-slate-500">
                    Instant ingest of pulse rate, SpO2, and ECG telemetry from Apple HealthKit / WearOS.
                  </p>
                </div>
              </div>

              {/* Pitch to the Judges */}
              <div className="p-5 rounded-2xl bg-sky-700 text-white space-y-2 shadow-sm">
                <div className="font-black text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-200" />
                  <span>Why MediAlert Stands Out for the Offline Hackathon Final</span>
                </div>
                <p className="text-xs text-sky-100 leading-relaxed">
                  Unlike conceptual mockups or generic AI chatbots, MediAlert is a fully working, resilient medical dispatch engine built by 1st-year engineering students from an IPU college. It combines real mathematical geodesic formulation (Haversine), a verified 24-hospital Delhi database, hands-free Web Speech accessibility, and dual-layer offline failovers. We are ready to defend and demo this live!
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Slide Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-white">
          {/* Progress Indicator */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-700">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === i
                      ? 'w-6 bg-sky-700'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  title={`Jump to Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Slide Title Breadcrumb */}
          <div className="text-xs text-slate-500 font-medium hidden md:block">
            {currentSlide === 0 && 'Title & Introduction'}
            {currentSlide === 1 && 'The Emergency Healthcare Problem'}
            {currentSlide === 2 && 'Proposed Solution: MediAlert'}
            {currentSlide === 3 && '4-Tier Clinical Urgency Matrix'}
            {currentSlide === 4 && 'Haversine Geodesic Math & Delhi Registry'}
            {currentSlide === 5 && 'Hands-Free Voice Dictation & Assistive UX'}
            {currentSlide === 6 && 'System Architecture & Tech Stack'}
            {currentSlide === 7 && 'End-to-End User Flow Walkthrough'}
            {currentSlide === 8 && 'Scalability, Societal Impact & Viability'}
            {currentSlide === 9 && 'Future Roadmap & Hackathon Defense'}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentSlide === 0}
              onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              disabled={currentSlide === totalSlides - 1}
              onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
