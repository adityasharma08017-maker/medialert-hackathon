import React, { useState } from 'react';
import {
  UPLOADED_HOSPITALS_DATA,
  Hospital,
  DelhiZone,
  HospitalType,
} from '../data/hospitalsData.ts';
import {
  Building2,
  PhoneCall,
  Ambulance,
  MapPin,
  Search,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

export const HospitalDirectory: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | HospitalType>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const regions = Object.keys(UPLOADED_HOSPITALS_DATA).filter(
    (k) => k !== 'default'
  );

  // Gather all unique hospitals across all zones
  const seenHospitalNames = new Set<string>();
  const allHospitals: Hospital[] = [];

  for (const reg of regions) {
    for (const h of UPLOADED_HOSPITALS_DATA[reg].hospitals) {
      if (!seenHospitalNames.has(h.name)) {
        seenHospitalNames.add(h.name);
        allHospitals.push(h);
      }
    }
  }

  const zones: { id: string; label: string }[] = [
    { id: 'all', label: 'All Zones' },
    { id: 'Central', label: 'Central Delhi' },
    { id: 'South', label: 'South Delhi' },
    { id: 'North', label: 'North Delhi' },
    { id: 'West', label: 'West Delhi' },
    { id: 'East', label: 'East Delhi' },
    { id: 'Dwarka', label: 'Dwarka' },
  ];

  const filteredHospitals = allHospitals.filter((hospital) => {
    const matchesZone = selectedZone === 'all' || hospital.zone === selectedZone;
    const matchesType = selectedType === 'all' || hospital.type === selectedType;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchLower) ||
      hospital.address.toLowerCase().includes(searchLower) ||
      hospital.zone.toLowerCase().includes(searchLower) ||
      (hospital.type && hospital.type.toLowerCase().includes(searchLower)) ||
      hospital.specialization.some((s) => s.toLowerCase().includes(searchLower));

    return matchesZone && matchesType && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-7 shadow-sm space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sky-700 font-bold text-sm">
            <Building2 className="w-4 h-4 text-sky-600" />
            <span>Delhi NCR Emergency Hospitals & Trauma Registry</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official directory of premier government apex institutions and accredited tertiary private emergency centers across all 6 Delhi zones
          </p>
        </div>

        {/* Total Hospital Count Badges */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200">
            {allHospitals.length} Verified Facilities
          </span>
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Dispatch Ready</span>
          </span>
        </div>
      </div>

      {/* Zone Selector and Type Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        {/* Zone Segmented Tabs */}
        <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
          {zones.map((z) => {
            const count =
              z.id === 'all'
                ? allHospitals.length
                : allHospitals.filter((h) => h.zone === z.id).length;
            const isSelected = selectedZone === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setSelectedZone(z.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{z.label}</span>
                <span
                  className={`ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono ${
                    isSelected ? 'bg-sky-800 text-sky-100' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Hospital Type Filter (All, Government, Private) */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Types
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('Government')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedType === 'Government'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Government ({allHospitals.filter((h) => h.type === 'Government').length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('Private')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              selectedType === 'Private'
                ? 'bg-sky-700 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Private ({allHospitals.filter((h) => h.type === 'Private').length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter hospitals by facility name, zone, address, or medical specialization (e.g., AIIMS, Safdarjung, Burns, Cath Lab)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 shadow-xs"
        />
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-300">
        {filteredHospitals.map((hospital, index) => {
          const isGovt = hospital.type === 'Government';
          return (
            <div
              key={index}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-sky-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Title & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-sm text-slate-900 leading-snug">
                    {hospital.name}
                  </h4>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-700 whitespace-nowrap">
                      {hospital.zone} Zone
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${
                        isGovt
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-sky-100 text-sky-800 border border-sky-200'
                      }`}
                    >
                      {hospital.type}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-1.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-400" />
                  <span className="line-clamp-2">{hospital.address}</span>
                </p>

                {/* Mock Live Ambulance Status & Standby Counter */}
                <div className="mt-2.5 p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                    <Ambulance className="w-3.5 h-3.5 text-emerald-600" />
                    <span>~{hospital.ambulance_response_min}m ETA</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-900">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>
                      {hospital.available_ambulances} {hospital.available_ambulances === 1 ? 'Unit' : 'Units'} (
                      {hospital.ambulance_status})
                    </span>
                  </div>
                </div>

                {/* Specialization tags */}
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {hospital.specialization.slice(0, 3).map((spec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-white text-slate-700 font-medium border border-slate-200/90 shadow-2xs"
                    >
                      {spec}
                    </span>
                  ))}
                  {hospital.specialization.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-500 font-medium">
                      +{hospital.specialization.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Emergency Desk
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                    {hospital.emergency_phone}
                  </span>
                </div>
                <a
                  href={`tel:${hospital.emergency_phone.replace(/[^0-9+]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shadow-2xs"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call Desk</span>
                </a>
              </div>
            </div>
          );
        })}

        {filteredHospitals.length === 0 && (
          <div className="col-span-full py-12 text-center text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700">No medical facilities found matching criteria.</p>
            <p>Try resetting the zone filter or searching for another hospital name or specialization.</p>
          </div>
        )}
      </div>
    </div>
  );
};
