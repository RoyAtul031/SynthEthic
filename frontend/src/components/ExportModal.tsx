import React from 'react';
import { X, Download, FileText, Code, Database, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string | null;
  datasetName?: string;
  totalRecords?: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  jobId,
  datasetName = 'Synthetic Twin',
  totalRecords = 1000,
}) => {
  if (!isOpen || !jobId) return null;

  const downloadFile = (format: 'csv' | 'json' | 'sql') => {
    const url = api.getExportUrl(jobId, format);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Export Synthetic Database Twin
              </h3>
              <p className="text-xs text-slate-400">
                Job: <span className="font-mono text-brand-400">{jobId}</span> • {totalRecords} records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-brand-950/40 border border-brand-500/30 flex items-center space-x-2 text-xs text-brand-300">
            <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span>Guaranteed 0% real user data. Fully compliant for test environments & public AI model training.</span>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {/* Option 1: CSV */}
            <div
              onClick={() => downloadFile('csv')}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-brand-500/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-all">
                    CSV Format (.csv)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Standard comma-separated table for Python, Pandas, PyTorch & Excel.
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-all" />
            </div>

            {/* Option 2: JSON */}
            <div
              onClick={() => downloadFile('json')}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-brand-500/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-all">
                    JSON Array (.json)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Record-oriented JSON payloads for REST APIs and microservice mock servers.
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-all" />
            </div>

            {/* Option 3: SQL */}
            <div
              onClick={() => downloadFile('sql')}
              className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-brand-500/60 transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-brand-300 transition-all">
                    SQL Migration Dump (.sql)
                  </h4>
                  <p className="text-xs text-slate-400">
                    PostgreSQL / MySQL DDL schema and INSERT statements for sandbox databases.
                  </p>
                </div>
              </div>
              <Download className="w-4 h-4 text-slate-500 group-hover:text-brand-400 transition-all" />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
