import React from 'react';
import { PhoneCall, AlertOctagon } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-red-700 text-white px-4 sm:px-5 py-3 rounded-xl shadow-sm border border-red-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
      <div className="flex items-center gap-2.5">
        <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold tracking-wider uppercase text-xs sm:text-sm text-red-50">
            Emergency Crisis Hotline
          </span>
          <span className="hidden md:inline text-red-100 font-normal">
            For acute life-threatening emergencies, bypass triage and dial directly:
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap ml-auto">
        <a
          href="tel:112"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-700 font-bold rounded-lg hover:bg-red-50 transition-colors shadow-xs text-xs whitespace-nowrap"
        >
          <PhoneCall className="w-3.5 h-3.5 text-red-600" />
          <span>Dial 112 (National)</span>
        </a>
        <a
          href="tel:102"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-900/60 hover:bg-red-900 text-white font-semibold rounded-lg transition-colors border border-red-500/50 text-xs whitespace-nowrap"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>102 (Ambulance)</span>
        </a>
      </div>
    </div>
  );
};
