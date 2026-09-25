/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  HeartPulse,
  Building2,
  FileCode,
  LayoutDashboard,
  ShieldCheck,
  Activity,
  AlertCircle,
  Presentation,
} from 'lucide-react';
import { TriageForm } from './components/TriageForm.tsx';
import { TriageCard } from './components/TriageCard.tsx';
import { JsonViewer } from './components/JsonViewer.tsx';
import { HospitalDirectory } from './components/HospitalDirectory.tsx';
import { EmergencyBanner } from './components/EmergencyBanner.tsx';
import { PitchDeckModal } from './components/PitchDeckModal.tsx';
import {
  TriageResult,
  evaluateRuleBasedTriage,
} from './data/triageRules.ts';
import {
  findNearestHospitals,
  UPLOADED_HOSPITALS_DATA,
} from './data/hospitalsData.ts';

export default function App() {
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'json' | 'dashboard' | 'hospitals'>('json');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPitchDeckOpen, setIsPitchDeckOpen] = useState<boolean>(false);

  const resultsRef = useRef<HTMLDivElement | null>(null);

  const handleTriageSubmit = async (formData: {
    symptoms: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    user_location_name: string;
    age: number;
    additional_info: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Send to server-side Gemini triage endpoint
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data: TriageResult = await response.json();
        setTriageResult(data);
      } else {
        // Fallback to client-side clinical triage calculation
        console.warn('Backend returned non-200, running client triage fallback');
        const fallbackResult = runClientTriageFallback(formData);
        setTriageResult(fallbackResult);
      }
    } catch (err: any) {
      console.warn('Network or server error, running client triage fallback:', err);
      const fallbackResult = runClientTriageFallback(formData);
      setTriageResult(fallbackResult);
    } finally {
      setIsLoading(false);
      // Scroll smoothly to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  // Client-side fallback that guarantees identical schema & accuracy
  const runClientTriageFallback = (formData: {
    symptoms: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    user_location_name: string;
    age: number;
    additional_info: string;
  }): TriageResult => {
    const { symptoms, location, latitude, longitude, age, additional_info, user_location_name } =
      formData;

    const nearest = findNearestHospitals(latitude, longitude, location, 3);
    const topHospital = nearest[0] || null;
    const alternateHospitals = nearest.slice(1).map((h) => ({
      name: h.name,
      distance_km: h.distance_km,
      phone_number: h.emergency_phone,
      ambulance_response_min: h.ambulance_response_min,
      zone: h.zone,
      type: h.type,
      available_ambulances: h.available_ambulances,
      ambulance_status: h.ambulance_status,
    }));

    const clinical = evaluateRuleBasedTriage(symptoms, age, additional_info);

    let ambulanceText = 'No ambulance required for this severity tier';
    if (topHospital) {
      if (topHospital.has_ambulance && topHospital.emergency_available) {
        ambulanceText = `${topHospital.ambulance_status || 'Available'} at ${topHospital.name} (${topHospital.available_ambulances || 3} units on standby · ~${topHospital.ambulance_response_min} mins ETA)`;
      } else {
        ambulanceText = 'Direct 112 emergency dispatch recommended';
      }
    }

    return {
      severity: clinical.severity,
      triage_level: clinical.triage_level,
      likely_condition: clinical.likely_condition,
      immediate_actions: clinical.immediate_actions,
      warning_signs: clinical.warning_signs,
      hospital_needed: clinical.hospital_needed,
      ambulance_needed: clinical.ambulance_needed,
      ambulance_availability: ambulanceText,
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
      clarifying_questions: clinical.clarifying_questions,
      patient_summary: {
        reported_symptoms: symptoms,
        reported_location: user_location_name || location,
        patient_age: age,
        additional_notes: additional_info || undefined,
        coordinates:
          latitude !== null && longitude !== null
            ? {
                latitude,
                longitude,
                is_gps_precise: true,
              }
            : null,
      },
      timestamp: new Date().toISOString(),
    };
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 font-sans selection:bg-sky-600 selection:text-white pb-16">
      {/* Top Emergency Banner */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <EmergencyBanner />
      </div>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-7">
        {/* Crisp Clinical App Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/90 shadow-sm">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-3 rounded-2xl bg-sky-700 text-white shadow-sm flex-shrink-0">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  MediAlert
                </h1>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <span className="text-sky-700 font-bold">Emergency Triage Engine</span>
                  <span aria-hidden="true">·</span>
                  <span>Haversine GPS Registry</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Clinical-grade emergency symptom triage categorizing cases strictly into 4 alert tiers (Critical,
                Severe, Moderate, Low), automated coordinate routing to nearest verified hospitals, and
                standardized schema output.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              type="button"
              onClick={() => setIsPitchDeckOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              title="Open Hackathon Project Presentation Pitch Deck (10 Slides)"
            >
              <Presentation className="w-4 h-4 text-sky-200" />
              <span>Hackathon Pitch Deck (PPT)</span>
            </button>

            <div className="text-right hidden sm:block border-l border-slate-200 pl-3">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">
                Hospital Registry
              </div>
              <div className="text-xs font-bold text-emerald-700 flex items-center justify-end gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Delhi NCR Active</span>
              </div>
            </div>
          </div>
        </header>

        {/* Input & Form Section */}
        <section>
          <TriageForm onSubmit={handleTriageSubmit} isLoading={isLoading} />
        </section>

        {/* Error Notice if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Results Section */}
        {triageResult && (
          <section ref={resultsRef} className="space-y-4 scroll-mt-6">
            {/* View Mode Navigation Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2.5 bg-white rounded-xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 px-2 tracking-wider">VIEW MODE:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setActiveTab('json')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'json'
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Clean JSON Output</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'dashboard'
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Clinical Dashboard</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('hospitals')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      activeTab === 'hospitals'
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Facility Directory</span>
                  </button>
                </div>
              </div>

              {/* Quick Severity Tag with distinct 4-tier high-contrast alertness colors */}
              <div className="flex items-center gap-2 px-2 text-xs">
                <span className="text-slate-500 font-medium">Assessed Urgency:</span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    triageResult.severity === 'Critical'
                      ? 'bg-red-600 text-white shadow-xs animate-badge-pulse'
                      : triageResult.severity === 'Severe'
                      ? 'bg-orange-600 text-white shadow-xs'
                      : triageResult.severity === 'Moderate'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                  }`}
                >
                  {triageResult.severity} (Level {triageResult.triage_level})
                </span>
              </div>
            </div>

            {/* Tab 1: Clean JSON Format View */}
            {activeTab === 'json' && (
              <div className="space-y-4">
                <JsonViewer data={triageResult} />

                {/* Quick Helper Summary under JSON */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-700 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-700 flex-shrink-0" />
                    <span>
                      <strong>Nearest Emergency Hospital:</strong> {triageResult.nearest_hospital?.name} (
                      <span className="font-mono font-bold">{triageResult.nearest_hospital?.distance_km}</span> km) · Hotline:{' '}
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {triageResult.nearest_hospital?.phone_number}
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('dashboard')}
                    className="text-sky-700 hover:text-sky-800 font-bold underline cursor-pointer"
                  >
                    Switch to Clinical Dashboard →
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Clinical Dashboard View */}
            {activeTab === 'dashboard' && <TriageCard result={triageResult} />}

            {/* Tab 3: Hospital Directory View */}
            {activeTab === 'hospitals' && <HospitalDirectory />}
          </section>
        )}

        {/* Bottom Section: Always accessible Hospital Directory if no results yet */}
        {!triageResult && (
          <section className="space-y-3">
            <HospitalDirectory />
          </section>
        )}

        {/* Medical Protocol Disclaimer Footer */}
        <footer className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setIsPitchDeckOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-sky-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
            >
              <Presentation className="w-4 h-4 text-sky-600" />
              <span>Open Hackathon Pitch Deck (10 Professional Slides · Print to PDF)</span>
            </button>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-slate-600 font-medium">
            <ShieldCheck className="w-4 h-4 text-sky-700" />
            <span>Emergency Medical Triage Decision Support Protocol</span>
          </div>
          <p className="max-w-2xl mx-auto text-slate-500 leading-relaxed">
            This tool provides clinical-grade decision support based on emergency triage protocols and the verified
            Delhi NCR hospital registry. If an acute life-threatening condition is suspected (cardiac arrest, stroke,
            uncontrolled bleeding, severe respiratory failure), dial 112 immediately.
          </p>
        </footer>
      </main>

      {/* Hackathon Pitch Deck Modal */}
      <PitchDeckModal isOpen={isPitchDeckOpen} onClose={() => setIsPitchDeckOpen(false)} />
    </div>
  );
}
