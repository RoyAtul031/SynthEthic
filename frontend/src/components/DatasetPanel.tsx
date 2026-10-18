import React, { useRef } from 'react';
import { Database, Upload, HeartPulse, CreditCard, Cloud, AlertTriangle, Play, Sparkles, CheckCircle2 } from 'lucide-react';
import { DatasetItem, DatasetPreview } from '../types';

interface DatasetPanelProps {
  datasets: DatasetItem[];
  selectedDatasetId: string;
  onSelectDataset: (id: string) => void;
  datasetPreview?: DatasetPreview | null;
  onUploadFile: (file: File) => void;
  onStartSynthesis: () => void;
  isTraining: boolean;
  targetEpsilon: number;
}

export const DatasetPanel: React.FC<DatasetPanelProps> = ({
  datasets,
  selectedDatasetId,
  onSelectDataset,
  datasetPreview,
  onUploadFile,
  onStartSynthesis,
  isTraining,
  targetEpsilon,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = (id: string) => {
    if (id.includes('healthcare')) return <HeartPulse className="w-5 h-5 text-rose-400" />;
    if (id.includes('fintech')) return <CreditCard className="w-5 h-5 text-amber-400" />;
    if (id.includes('saas')) return <Cloud className="w-5 h-5 text-cyan-400" />;
    return <Database className="w-5 h-5 text-brand-400" />;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadFile(e.target.files[0]);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-800/80 gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Database className="w-5 h-5 text-brand-400" />
            <span>Select Source Ingestion Dataset</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Choose a pre-screened compliance benchmark or upload your organization's schema.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-medium rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload Custom CSV</span>
          </button>

          <button
            onClick={onStartSynthesis}
            disabled={isTraining}
            className={`flex items-center space-x-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all shadow-lg ${
              isTraining
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 shadow-brand-500/25 cursor-pointer transform hover:-translate-y-0.5'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{isTraining ? 'Training in Progress...' : 'Synthesize Twin with DP'}</span>
          </button>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {datasets.map((d) => {
          const isSelected = d.id === selectedDatasetId;
          return (
            <div
              key={d.id}
              onClick={() => onSelectDataset(d.id)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900/90 border-brand-500 shadow-md shadow-brand-500/10'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" />
                </div>
              )}
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-800/80 border border-slate-700/50">
                  {getIcon(d.id)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    {d.name}
                  </h3>
                  <span className="text-[11px] text-brand-400 font-medium">
                    {d.compliance}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-2.5 line-clamp-2">
                {d.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{d.row_count} records</span>
                <span>{d.column_count} columns</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schema & PII Preview Table */}
      {datasetPreview && (
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <span>Ingestion Schema & Zero-PII Pre-Check</span>
              <span className="text-[10px] lowercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                {datasetPreview.total_columns} columns • {datasetPreview.total_rows} rows
              </span>
            </h4>
            <span className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Direct Identifiers Salt-Hashed at Ingestion</span>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Column</th>
                  <th className="py-2.5 px-3">Data Type</th>
                  <th className="py-2.5 px-3">Unique Values</th>
                  <th className="py-2.5 px-3">Sample Value</th>
                  <th className="py-2.5 px-3">Privacy Guard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {datasetPreview.schema.map((col) => {
                  const isId = col.name.toLowerCase().includes('id') || col.name.toLowerCase().includes('mrn') || col.name.toLowerCase().includes('cust');
                  return (
                    <tr key={col.name} className="hover:bg-slate-900/40">
                      <td className="py-2 px-3 font-semibold text-slate-200">
                        {col.name}
                      </td>
                      <td className="py-2 px-3 text-slate-400">{col.dtype}</td>
                      <td className="py-2 px-3">{col.unique_values}</td>
                      <td className="py-2 px-3 text-slate-400 truncate max-w-[140px]">
                        {col.sample_value ?? '—'}
                      </td>
                      <td className="py-2 px-3">
                        {isId ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/50">
                            PII: Auto-Masked
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
                            DP-WGAN Modulated
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
