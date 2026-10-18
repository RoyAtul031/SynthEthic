import React, { useState } from 'react';
import { Database, Search, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';
import { TwinDataPayload } from '../types';

interface TwinDataExplorerProps {
  twinData?: TwinDataPayload | null;
  onPageChange: (newPage: number) => void;
  isLoading: boolean;
}

export const TwinDataExplorer: React.FC<TwinDataExplorerProps> = ({
  twinData,
  onPageChange,
  isLoading,
}) => {
  const [activeView, setActiveView] = useState<'side-by-side' | 'synthetic-only'>('side-by-side');
  const [searchTerm, setSearchTerm] = useState('');

  if (!twinData) {
    return (
      <div className="glass-panel p-10 rounded-2xl border border-slate-800 text-center">
        <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <h4 className="text-sm font-semibold text-slate-300">No Synthetic Twin Generated Yet</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Select a dataset above and click "Synthesize Twin with DP" to generate your privacy-preserving database twin.
        </p>
      </div>
    );
  }

  const columns = twinData.columns || [];
  const realRows = twinData.real_sample || [];
  const synthRows = twinData.synthetic_sample || [];

  const filterRows = (rows: Record<string, any>[]) => {
    if (!searchTerm) return rows;
    return rows.filter((r) =>
      Object.values(r).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const filteredSynth = filterRows(synthRows);
  const filteredReal = filterRows(realRows);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      {/* Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-brand-400" />
            <span>Database Twin Interactive Explorer</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Side-by-side inspection: Noise-Encoded Source Data vs Generated Synthetic Twin (0% Real PII).
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveView('side-by-side')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeView === 'side-by-side'
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Side-by-Side Twin
            </button>
            <button
              onClick={() => setActiveView('synthetic-only')}
              className={`px-3 py-1 rounded-md transition-all ${
                activeView === 'synthetic-only'
                  ? 'bg-brand-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Synthetic Twin Only
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter columns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 w-36 sm:w-44 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Tables View */}
      {activeView === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-5">
          {/* Real Baseline (Noise-Encoded) */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 font-mono flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Real Source (Noise-Encoded Identifiers)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Page {twinData.page}</span>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    {columns.slice(0, 5).map((c) => (
                      <th key={c} className="py-2 px-3 whitespace-nowrap">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-300">
                  {filteredReal.map((row, i) => (
                    <tr key={i} className="hover:bg-slate-900/40">
                      {columns.slice(0, 5).map((c) => (
                        <td key={c} className="py-1.5 px-3 whitespace-nowrap">{String(row[c] ?? '—')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Synthetic Twin */}
          <div className="rounded-xl border border-brand-500/30 bg-slate-950/70 overflow-hidden shadow-lg shadow-brand-500/5">
            <div className="px-4 py-2.5 bg-brand-950/40 border-b border-brand-500/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-300 font-mono flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                <span>Synthetic Database Twin (DP-WGAN)</span>
              </span>
              <span className="text-[10px] text-brand-400 font-mono font-bold">0% Real Data</span>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-left text-[11px] font-mono">
                <thead className="bg-slate-900/90 text-slate-400 sticky top-0 border-b border-slate-800">
                  <tr>
                    {columns.slice(0, 5).map((c) => (
                      <th key={c} className="py-2 px-3 whitespace-nowrap text-brand-300">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50 text-slate-200">
                  {filteredSynth.map((row, i) => (
                    <tr key={i} className="hover:bg-brand-950/20">
                      {columns.slice(0, 5).map((c) => (
                        <td key={c} className="py-1.5 px-3 whitespace-nowrap">{String(row[c] ?? '—')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Full width Synthetic Table */
        <div className="mt-5 rounded-xl border border-brand-500/30 bg-slate-950/70 overflow-hidden shadow-md">
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800">
                <tr>
                  {columns.map((c) => (
                    <th key={c} className="py-2.5 px-3 whitespace-nowrap text-brand-300">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-200">
                {filteredSynth.map((row, i) => (
                  <tr key={i} className="hover:bg-brand-950/20">
                    {columns.map((c) => (
                      <td key={c} className="py-2 px-3 whitespace-nowrap">{String(row[c] ?? '—')}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400 font-mono">
          Showing page {twinData.page} of {Math.ceil(twinData.total_records / twinData.page_size)} ({twinData.total_records} total synthetic records)
        </span>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(twinData.page - 1)}
            disabled={twinData.page <= 1 || isLoading}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg font-mono text-brand-400 font-bold">
            {twinData.page}
          </span>
          <button
            onClick={() => onPageChange(twinData.page + 1)}
            disabled={twinData.page * twinData.page_size >= twinData.total_records || isLoading}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
