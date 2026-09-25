import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Ambulance,
  PhoneCall,
  MapPin,
  Clock,
  ShieldAlert,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { TriageResult, SeverityLevel } from '../data/triageRules.ts';

interface TriageCardProps {
  result: TriageResult;
}

export const TriageCard: React.FC<TriageCardProps> = ({ result }) => {
  const {
    severity,
    triage_level,
    likely_condition,
    immediate_actions,
    warning_signs,
    hospital_needed,
    ambulance_needed,
    ambulance_availability,
    nearest_hospital,
    alternate_hospitals,
    clarifying_questions,
    patient_summary,
    timestamp,
  } = result;

  const getSeverityTheme = (sev: SeverityLevel) => {
    switch (sev) {
      case 'Critical':
        return {
          container:
            'bg-red-50/90 border-red-300 text-red-950 border-l-8 border-l-red-600 shadow-sm animate-critical-glow',
          badge: 'bg-red-600 text-white shadow-xs animate-badge-pulse',
          iconBg: 'bg-red-100 text-red-600',
          title: 'Critical Emergency (Triage Level 1)',
          icon: <AlertOctagon className="w-6 h-6 animate-pulse" />,
          desc: 'Immediate life threat detected. Emergency department reception and ALS ambulance dispatch urgently required.',
        };
      case 'Severe':
        return {
          container:
            'bg-orange-50/90 border-orange-300 text-orange-950 border-l-8 border-l-orange-500 shadow-sm',
          badge: 'bg-orange-600 text-white shadow-xs',
          iconBg: 'bg-orange-100 text-orange-600',
          title: 'Severe Priority (Triage Level 2)',
          icon: <AlertTriangle className="w-6 h-6" />,
          desc: 'High-risk acute clinical condition. Rapid emergency evaluation and intervention required without delay.',
        };
      case 'Moderate':
        return {
          container:
            'bg-amber-50/90 border-amber-300 text-amber-950 border-l-8 border-l-amber-500 shadow-sm',
          badge: 'bg-amber-600 text-white shadow-xs',
          iconBg: 'bg-amber-100 text-amber-700',
          title: 'Moderate Urgency (Triage Level 3)',
          icon: <Activity className="w-6 h-6" />,
          desc: 'Urgent medical care recommended within 2 to 4 hours. Patient is stable for private transport or urgent care clinic.',
        };
      case 'Low':
      default:
        return {
          container:
            'bg-emerald-50/90 border-emerald-300 text-emerald-950 border-l-8 border-l-emerald-600 shadow-sm',
          badge: 'bg-emerald-600 text-white shadow-xs',
          iconBg: 'bg-emerald-100 text-emerald-700',
          title: 'Low Urgency (Triage Level 4)',
          icon: <CheckCircle2 className="w-6 h-6" />,
          desc: 'Non-acute or self-limiting condition. Suitable for home recovery, telemedicine consult, or regular outpatient visit.',
        };
    }
  };

  const theme = getSeverityTheme(severity);

  return (
    <div className="space-y-6">
      {/* Primary Severity Banner with Distinct Alertness Styling */}
      <div className={`p-6 sm:p-7 rounded-2xl border ${theme.container} transition-all`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className={`p-3 rounded-xl ${theme.iconBg} shadow-xs flex-shrink-0`}>
              {theme.icon}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${theme.badge}`}
                >
                  {severity} · Level {triage_level}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Assessed {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {theme.title}
              </h2>
            </div>
          </div>

          {/* Emergency Call Button if Critical/Severe */}
          {(severity === 'Critical' || severity === 'Severe' || ambulance_needed) && (
            <div className="flex items-center gap-2 self-start sm:self-center">
              <a
                href="tel:112"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors whitespace-nowrap"
              >
                <PhoneCall className="w-4 h-4 animate-bounce" />
                <span>Call 112 (National Emergency)</span>
              </a>
            </div>
          )}
        </div>

        <p className="mt-3 text-sm text-slate-700 font-medium leading-relaxed">
          {theme.desc}
        </p>

        {/* Triage Decision Matrix Indicators */}
        <div className="mt-4 pt-3.5 border-t border-slate-200/80 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2 font-semibold">
            <span className="text-slate-600">Hospital Facility Needed:</span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                hospital_needed
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {hospital_needed ? 'YES · Required' : 'NO · Outpatient / Home'}
            </span>
          </div>

          <div className="flex items-center gap-2 font-semibold">
            <span className="text-slate-600">Ambulance Dispatch:</span>
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                ambulance_needed
                  ? 'bg-red-100 text-red-800 border border-red-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {ambulance_needed ? 'YES · Urgent Dispatch' : 'Not Required'}
            </span>
          </div>
        </div>
      </div>

      {/* Likely Condition Assessment */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5 text-sky-700 font-semibold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Diagnostic Impression & Assessment</span>
        </div>
        <p className="text-xl font-extrabold text-slate-900">
          {likely_condition}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Symptoms analyzed: "{patient_summary.reported_symptoms}"
          {patient_summary.patient_age ? ` · Patient Age: ${patient_summary.patient_age} yrs` : ''}
          {patient_summary.reported_location ? ` · Sector: ${patient_summary.reported_location}` : ''}
        </p>
      </div>

      {/* Immediate Actions List */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-2 mb-3.5 text-slate-900 font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base">Immediate Clinical & First Aid Directives</h3>
        </div>
        <ol className="space-y-2.5">
          {immediate_actions.map((action, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="pt-0.5 leading-snug">{action}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Warning Signs (Red Flags) */}
      {warning_signs.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/90 shadow-xs">
          <div className="flex items-center gap-2 mb-2.5 text-amber-900 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <h3 className="text-base">Critical Red Flags & Deterioration Warnings</h3>
          </div>
          <ul className="space-y-2">
            {warning_signs.map((sign, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-amber-950 font-medium"
              >
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Nearest Hospital Card (Calculated from Verified Data) */}
      {nearest_hospital && (
        <div className="p-6 sm:p-7 rounded-2xl bg-white border-2 border-sky-500/40 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3.5 py-1 bg-sky-700 text-white font-bold text-[11px] rounded-bl-lg uppercase tracking-wider">
            Nearest Emergency Facility
          </div>

          <div className="flex items-center gap-2 text-sky-700 font-semibold text-xs uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Optimal Hospital Routing via Haversine Distance</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {nearest_hospital.name}
                </h3>
                {nearest_hospital.zone && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">
                    {nearest_hospital.zone} Zone
                  </span>
                )}
                {nearest_hospital.type && (
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      nearest_hospital.type === 'Government'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-sky-100 text-sky-800 border border-sky-200'
                    }`}
                  >
                    {nearest_hospital.type}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-1.5">
                <span>{nearest_hospital.address}</span>
              </p>
            </div>

            {/* Distance badge */}
            <div className="flex items-center gap-3">
              <div className="px-4 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-center">
                <div className="text-[11px] text-sky-700 font-bold uppercase tracking-wider">
                  GPS Distance
                </div>
                <div className="text-2xl font-black text-sky-950 tabular-nums">
                  {nearest_hospital.distance_km} <span className="text-sm font-semibold">km</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Phone & Ambulance Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-5 pt-4 border-t border-slate-100">
            {/* Direct Phone */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-sky-100 text-sky-700">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    Emergency Trauma Desk
                  </div>
                  <div className="font-bold text-sm text-slate-900 font-mono tabular-nums">
                    {nearest_hospital.phone_number}
                  </div>
                </div>
              </div>
              <a
                href={`tel:${nearest_hospital.phone_number.replace(/[^0-9+]/g, '')}`}
                className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors whitespace-nowrap"
              >
                Call Desk
              </a>
            </div>

            {/* Ambulance Availability */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                  <Ambulance className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                    Ambulance Dispatch
                  </div>
                  <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5 flex-wrap">
                    {nearest_hospital.ambulance_available ? (
                      <span className="text-emerald-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>
                          {nearest_hospital.available_ambulances || 4} Units ({nearest_hospital.ambulance_status || 'Active Standby'}) · ~{nearest_hospital.ambulance_response_min}m ETA
                        </span>
                      </span>
                    ) : (
                      <span className="text-slate-600">Dial 102 for Central Dispatch</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Specializations */}
          {nearest_hospital.specialization && nearest_hospital.specialization.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-semibold mr-1">Specialized Units:</span>
              {nearest_hospital.specialization.map((spec, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                >
                  {spec}
                </span>
              ))}
            </div>
          )}

          {/* Alternate Hospitals List */}
          {alternate_hospitals && alternate_hospitals.length > 0 && (
            <div className="mt-4 pt-3.5 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 mb-2">
                Secondary Nearby Verified Emergency Hospitals:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {alternate_hospitals.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-semibold text-slate-900">{alt.name}</span>
                        {alt.zone && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {alt.zone}
                          </span>
                        )}
                        {alt.type && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              alt.type === 'Government'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}
                          >
                            {alt.type}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 font-mono tabular-nums text-[11px] mt-0.5">
                        {alt.distance_km} km away · ETA ~{alt.ambulance_response_min}m
                        {alt.available_ambulances ? ` · ${alt.available_ambulances} ambulances` : ''}
                      </div>
                    </div>
                    <a
                      href={`tel:${alt.phone_number.replace(/[^0-9+]/g, '')}`}
                      className="text-sky-700 hover:text-sky-800 font-bold font-mono tabular-nums"
                    >
                      {alt.phone_number}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clarifying Questions */}
      {clarifying_questions.length > 0 && (
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-sky-600" />
            <span>Recommended Clarifying Inquiries for Attending Triage Officer:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1 leading-relaxed">
            {clarifying_questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
