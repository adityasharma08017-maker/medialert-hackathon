import React, { useState, useRef, useEffect } from 'react';
import {
  MapPin,
  Crosshair,
  Mic,
  MicOff,
  AlertOctagon,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Loader2,
  User,
  Activity,
  Stethoscope,
  AlertCircle,
  X,
  Square,
} from 'lucide-react';
import { PRESET_LOCATIONS } from '../data/hospitalsData.ts';
import { SAMPLE_TRIAGE_CASES, SampleTestCase } from '../data/triageRules.ts';

interface TriageFormProps {
  onSubmit: (formData: {
    symptoms: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    user_location_name: string;
    age: number;
    additional_info: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const TriageForm: React.FC<TriageFormProps> = ({ onSubmit, isLoading }) => {
  const [symptoms, setSymptoms] = useState('');
  const [location, setLocation] = useState('Dwarka, Delhi');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [userLocationName, setUserLocationName] = useState<string>('');
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [age, setAge] = useState<number>(30);
  const [additionalInfo, setAdditionalInfo] = useState('');

  // Voice recognition state & refs
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const startingSymptomsRef = useRef<string>('');
  const finalSegmentsRef = useRef<string[]>([]);

  // Safely stop speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleStopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition:', e);
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  };

  const handleStartListening = () => {
    setVoiceError(null);
    setInterimTranscript('');

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        'Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or type symptoms manually.'
      );
      return;
    }

    try {
      // Clean up previous instance if running
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      // Enable continuous speech and live interim feedback
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-US';
      recognition.maxAlternatives = 1;

      // Save baseline text so dictation appends seamlessly
      const baseText = symptoms.trim();
      startingSymptomsRef.current = baseText;
      finalSegmentsRef.current = [];

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        const currentFinals: string[] = [];

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            const transcript = result[0]?.transcript?.trim();
            if (transcript) {
              currentFinals.push(transcript);
            }
          } else {
            const transcript = result[0]?.transcript?.trim();
            if (transcript) {
              interim += (interim ? ' ' : '') + transcript;
            }
          }
        }

        finalSegmentsRef.current = currentFinals;
        setInterimTranscript(interim);

        // Synchronize full text in real-time
        const base = startingSymptomsRef.current;
        const finalJoined = currentFinals.join(' ');

        let fullText = base;
        if (finalJoined) {
          fullText = fullText ? `${fullText} ${finalJoined}` : finalJoined;
        }
        if (interim) {
          fullText = fullText ? `${fullText} ${interim}` : interim;
        }

        setSymptoms(fullText);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error, event);
        const errorCode = event.error;

        if (errorCode === 'not-allowed' || errorCode === 'permission-denied') {
          setVoiceError(
            'Microphone access denied. Please click the site settings / lock icon in your browser address bar to allow microphone permissions.'
          );
        } else if (errorCode === 'no-speech') {
          setVoiceError(
            'No speech detected. Please check your microphone and speak clearly into it.'
          );
        } else if (errorCode === 'audio-capture') {
          setVoiceError(
            'No microphone hardware detected. Please ensure a microphone is connected and enabled.'
          );
        } else if (errorCode === 'network') {
          setVoiceError(
            'Network issue occurred during speech recognition. Please check your internet connection.'
          );
        } else if (errorCode === 'aborted') {
          // Normal user abort or stop, do not display an error
        } else {
          setVoiceError(`Voice dictation issue: ${errorCode || 'Recognition error occurred'}.`);
        }

        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        // Clean up redundant whitespaces
        setSymptoms((prev) => prev.replace(/\s+/g, ' ').trim());
      };

      recognition.start();
    } catch (err: any) {
      console.error('Error starting speech recognition:', err);
      setVoiceError(
        'Could not initiate voice dictation: ' + (err?.message || 'Please check microphone permissions.')
      );
      setIsListening(false);
    }
  };

  const handleToggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  // GPS Geolocation Handler
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setIsDetectingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const acc = Math.round(position.coords.accuracy);

        setLatitude(lat);
        setLongitude(lon);
        setGpsAccuracy(acc);

        let placeName = `GPS: ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E`;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
          );
          if (res.ok) {
            const data = await res.json();
            const suburb =
              data.address?.suburb ||
              data.address?.neighbourhood ||
              data.address?.city_district ||
              data.address?.city ||
              'Delhi NCR';
            placeName = `${suburb} (Accuracy: ~${acc}m)`;
          }
        } catch {
          // Keep GPS coordinates string
        }

        setUserLocationName(placeName);
        setLocation(placeName);
        setIsDetectingLocation(false);
      },
      (error) => {
        setIsDetectingLocation(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location permission denied. Please select an area below.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('GPS signal unavailable. Please select an area below.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out. Please select an area below.');
            break;
          default:
            setLocationError('Unable to detect location. Please select an area.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Select Preset Location
  const handleSelectPreset = (key: string) => {
    const preset = PRESET_LOCATIONS[key];
    if (preset) {
      setLatitude(preset.lat);
      setLongitude(preset.lon);
      setLocation(preset.name);
      setUserLocationName(preset.name);
      setGpsAccuracy(null);
      setLocationError(null);
    }
  };

  // Load a sample test scenario
  const handleLoadSample = (testCase: SampleTestCase) => {
    setSymptoms(testCase.symptoms);
    setLocation(testCase.location);
    setAge(testCase.age);
    setAdditionalInfo(testCase.additional_info);

    const lowerLoc = testCase.location.toLowerCase();
    if (lowerLoc.includes('dwarka')) {
      handleSelectPreset('dwarka');
    } else if (lowerLoc.includes('central')) {
      handleSelectPreset('connaught_place');
    } else if (lowerLoc.includes('south')) {
      handleSelectPreset('hauz_khas');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      alert('Please describe patient symptoms to run triage.');
      return;
    }

    await onSubmit({
      symptoms: symptoms.trim(),
      location: location.trim() || 'Dwarka, Delhi',
      latitude,
      longitude,
      user_location_name: userLocationName || location,
      age,
      additional_info: additionalInfo.trim(),
    });
  };

  const handleReset = () => {
    handleStopListening();
    setVoiceError(null);
    setInterimTranscript('');
    setSymptoms('');
    setLocation('Dwarka, Delhi');
    setLatitude(null);
    setLongitude(null);
    setUserLocationName('');
    setGpsAccuracy(null);
    setLocationError(null);
    setAge(30);
    setAdditionalInfo('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6"
    >
      {/* Sample test cases for instant 1-click evaluation with 4 distinct high-contrast severity tiers */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-bold text-slate-800 tracking-tight">
              Clinical Scenario Presets (4-Tier Urgency Matrix):
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Click to populate</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {SAMPLE_TRIAGE_CASES.map((tc) => {
            const isCritical = tc.expectedSeverity === 'Critical';
            const isSevere = tc.expectedSeverity === 'Severe';
            const isModerate = tc.expectedSeverity === 'Moderate';
            const isLow = tc.expectedSeverity === 'Low';

            let tierClasses = '';
            let labelClasses = '';

            if (isCritical) {
              tierClasses =
                'bg-red-50/80 hover:bg-red-100/70 border-red-200 text-slate-900 hover:border-red-400';
              labelClasses = 'text-red-700 font-bold';
            } else if (isSevere) {
              tierClasses =
                'bg-orange-50/80 hover:bg-orange-100/70 border-orange-200 text-slate-900 hover:border-orange-400';
              labelClasses = 'text-orange-700 font-bold';
            } else if (isModerate) {
              tierClasses =
                'bg-amber-50/80 hover:bg-amber-100/70 border-amber-200 text-slate-900 hover:border-amber-400';
              labelClasses = 'text-amber-800 font-bold';
            } else {
              tierClasses =
                'bg-emerald-50/80 hover:bg-emerald-100/70 border-emerald-200 text-slate-900 hover:border-emerald-400';
              labelClasses = 'text-emerald-700 font-bold';
            }

            return (
              <button
                key={tc.id}
                type="button"
                onClick={() => handleLoadSample(tc)}
                className={`p-2.5 rounded-lg text-xs text-left transition-all cursor-pointer border ${tierClasses}`}
              >
                <div className={`text-xs ${labelClasses} flex items-center justify-between`}>
                  <span>{tc.expectedSeverity}</span>
                  <span className="text-[10px] opacity-75 font-mono">T{tc.id.replace('case-', '')}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5 truncate">
                  {tc.title.split(':')[1]?.trim() || tc.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Symptoms Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="symptoms"
            className="text-sm font-bold text-slate-900 flex items-center gap-1.5"
          >
            <span>Presenting Symptoms & Clinical Notes</span>
            <span className="text-red-600">*</span>
          </label>

          {/* Voice button */}
          <button
            type="button"
            onClick={handleToggleListening}
            className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-700 shadow-sm animate-badge-pulse'
                : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 hover:border-sky-300'
            }`}
            title={isListening ? 'Click to stop voice dictation' : 'Click to dictate symptoms with microphone'}
          >
            {isListening ? (
              <>
                <Square className="w-3.5 h-3.5 fill-white text-white" />
                <span>Stop Dictation</span>
              </>
            ) : (
              <>
                <Mic className="w-3.5 h-3.5 text-sky-600" />
                <span>Voice Dictation</span>
              </>
            )}
          </button>
        </div>

        {/* Live Recording Visual Banner Indicator */}
        {isListening && (
          <div className="p-3 rounded-xl bg-red-50/90 border border-red-200 text-red-950 flex flex-wrap items-center justify-between gap-2.5 shadow-xs transition-all animate-badge-pulse">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-red-900">
                  Microphone Active · Speak patient symptoms
                </span>
                {/* Audio soundwave equalizer bars */}
                <div className="flex items-center gap-0.5 h-4 px-1 py-0.5 bg-red-100 rounded-md">
                  <span className="w-1 bg-red-600 rounded-full animate-wave-1"></span>
                  <span className="w-1 bg-red-600 rounded-full animate-wave-2"></span>
                  <span className="w-1 bg-red-600 rounded-full animate-wave-3"></span>
                  <span className="w-1 bg-red-600 rounded-full animate-wave-4"></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {interimTranscript && (
                <span className="text-xs text-red-700 italic font-medium max-w-xs truncate hidden sm:inline">
                  "{interimTranscript}..."
                </span>
              )}
              <button
                type="button"
                onClick={handleStopListening}
                className="px-2.5 py-1 text-xs font-bold bg-white text-red-700 rounded-lg hover:bg-red-100 border border-red-200 shadow-2xs transition-colors cursor-pointer"
              >
                Finish Speaking
              </button>
            </div>
          </div>
        )}

        {/* Voice Error Notice */}
        {voiceError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start justify-between gap-2.5 shadow-xs">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="leading-snug">
                <span className="font-bold text-amber-950">Microphone / Speech Notice: </span>
                <span>{voiceError}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVoiceError(null)}
              className="text-amber-600 hover:text-amber-900 p-0.5 rounded cursor-pointer transition-colors"
              title="Dismiss error notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <textarea
          id="symptoms"
          rows={3}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Enter patient symptoms in detail (e.g., 'Acute crushing substernal chest pain radiating to jaw and left arm, diaphoresis, dyspnea for 30 minutes')"
          required
          className={`w-full px-3.5 py-2.5 rounded-xl text-sm shadow-xs transition-all ${
            isListening
              ? 'ring-2 ring-red-500/80 border-red-500 bg-red-50/20 text-slate-900 placeholder:text-red-300'
              : 'border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-600 focus:ring-3 focus:ring-sky-100'
          }`}
        />

        {/* Quick symptom tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-xs text-slate-500 font-medium mr-1">Quick additions:</span>
          {[
            'Sudden chest pain',
            'Severe shortness of breath',
            'High fever >102°F',
            'Deep burn injury',
            'Suspected limb fracture',
            'Dizziness & diaphoresis',
            'Mild cold symptoms',
          ].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setSymptoms((prev) => (prev ? `${prev}, ${tag.toLowerCase()}` : tag))
              }
              className="px-2.5 py-1 rounded-md text-xs bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-800 border border-slate-200 hover:border-sky-200 transition-colors cursor-pointer"
            >
              + {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Location & GPS Section */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              <span>Location & Coordinate Registry</span>
              <span className="text-red-600">*</span>
            </label>
            <p className="text-xs text-slate-500 mt-0.5">
              Used for exact Haversine distance calculations to nearest emergency trauma facilities.
            </p>
          </div>

          {/* Detect Location Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetectingLocation}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs disabled:opacity-60 whitespace-nowrap self-start sm:self-auto"
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Acquiring Fix...</span>
              </>
            ) : (
              <>
                <Crosshair className="w-3.5 h-3.5" />
                <span>Acquire GPS Fix</span>
              </>
            )}
          </button>
        </div>

        {/* Location Status Badge */}
        {latitude !== null && longitude !== null && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <span className="font-bold">GPS Coordinates:</span> {latitude.toFixed(4)}°N,{' '}
                {longitude.toFixed(4)}°E
                {gpsAccuracy && <span className="text-emerald-700 ml-1.5">· ±{gpsAccuracy}m precision</span>}
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded">
              Haversine Active
            </span>
          </div>
        )}

        {locationError && (
          <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800">
            Notice: {locationError}
          </div>
        )}

        {/* Location Text Input */}
        <div>
          <input
            type="text"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setUserLocationName(e.target.value);
            }}
            placeholder="e.g., Dwarka, Delhi or South Delhi"
            className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 shadow-xs"
          />
        </div>

        {/* Quick Area Presets */}
        <div>
          <div className="text-xs font-semibold text-slate-600 mb-2">
            Select a verified Delhi NCR clinical sector:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(PRESET_LOCATIONS).map((key) => {
              const p = PRESET_LOCATIONS[key];
              const isSelected = latitude === p.lat && longitude === p.lon;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPreset(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-sky-700 text-white border-sky-700 shadow-xs font-semibold'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300 hover:text-sky-700'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Patient Information & Additional History */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="patientAge"
            className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Patient Age (Years)</span>
          </label>
          <input
            id="patientAge"
            type="number"
            min={0}
            max={125}
            value={age}
            onChange={(e) => setAge(parseInt(e.target.value, 10) || 0)}
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 shadow-xs tabular-nums"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="additionalInfo"
            className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <span>Pre-existing Conditions / Medical History (Optional)</span>
          </label>
          <input
            id="additionalInfo"
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder="e.g., Hypertension, type 2 diabetes, cardiac stent 2022, pregnant"
            className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100 shadow-xs"
          />
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Symptoms & Nearest Facilities...</span>
            </>
          ) : (
            <>
              <AlertOctagon className="w-4 h-4" />
              <span>Execute Clinical Triage & Facility Dispatch</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="w-full sm:w-auto px-4 py-3.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
      </div>
    </form>
  );
};
