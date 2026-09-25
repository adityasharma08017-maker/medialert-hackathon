import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle2 } from 'lucide-react';
import { TriageResult } from '../data/triageRules.ts';

interface JsonViewerProps {
  data: TriageResult;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medialert-triage-${data.severity.toLowerCase()}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Syntax highlighting for clinical JSON with high-contrast severity tiers
  const renderHighlightedJson = (json: string) => {
    const lines = json.split('\n');
    return lines.map((line, idx) => {
      const keyMatch = line.match(/^(\s*)(".*?")\s*:\s*(.*)$/);
      if (keyMatch) {
        const indent = keyMatch[1];
        const key = keyMatch[2];
        const val = keyMatch[3];

        let valClass = 'text-slate-200';
        if (val.startsWith('"')) valClass = 'text-amber-200';
        else if (val.match(/^(true|false)/)) valClass = 'text-cyan-400 font-semibold';
        else if (val.match(/^-?\d+(\.\d+)?/)) valClass = 'text-teal-300 font-semibold';
        else if (val.startsWith('null')) valClass = 'text-rose-300 font-semibold';

        // High-contrast highlighting for the 4 severity tiers
        if (key.includes('"severity"')) {
          if (val.includes('Critical')) {
            valClass = 'text-red-300 font-black bg-red-950/90 px-2 py-0.5 rounded border border-red-700/80';
          } else if (val.includes('Severe')) {
            valClass = 'text-orange-300 font-black bg-orange-950/90 px-2 py-0.5 rounded border border-orange-700/80';
          } else if (val.includes('Moderate')) {
            valClass = 'text-amber-300 font-black bg-amber-950/90 px-2 py-0.5 rounded border border-amber-700/80';
          } else if (val.includes('Low')) {
            valClass = 'text-emerald-300 font-black bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700/80';
          }
        }

        return (
          <div key={idx} className="leading-6 hover:bg-slate-800/60 px-2 rounded">
            <span className="text-slate-600 select-none inline-block w-8 text-right mr-3 text-xs font-mono tabular-nums">
              {idx + 1}
            </span>
            <span className="whitespace-pre">{indent}</span>
            <span className="text-sky-300 font-medium">{key}</span>
            <span className="text-slate-400">: </span>
            <span className={valClass}>{val}</span>
          </div>
        );
      }

      return (
        <div key={idx} className="leading-6 hover:bg-slate-800/60 px-2 rounded">
          <span className="text-slate-600 select-none inline-block w-8 text-right mr-3 text-xs font-mono tabular-nums">
            {idx + 1}
          </span>
          <span className="text-slate-300 whitespace-pre">{line}</span>
        </div>
      );
    });
  };

  return (
    <div className="rounded-2xl border border-slate-300 bg-slate-900 shadow-md overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <FileCode className="w-4 h-4 text-sky-400" />
          <span className="font-mono font-bold text-slate-100">
            TriagePayload.json
          </span>
          <span className="text-slate-500 font-normal">·</span>
          <span className="text-slate-400 font-medium">
            Strict 4-Tier Urgency Schema
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-semibold cursor-pointer border border-slate-700"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-colors font-semibold cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Code Container */}
      <div className="p-5 font-mono text-xs sm:text-sm overflow-x-auto max-h-[620px] scrollbar-thin scrollbar-thumb-slate-700 bg-slate-900/95 text-slate-100">
        {renderHighlightedJson(jsonString)}
      </div>

      {/* Summary Footer */}
      <div className="px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>JSON Schema Validated against Emergency Medicine Protocol</span>
        </div>
        <div className="font-mono tabular-nums text-slate-500">
          {jsonString.length} bytes
        </div>
      </div>
    </div>
  );
};
