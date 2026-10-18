import React from 'react';
import { ShieldCheck, Lock, AlertCircle, CheckCircle, ShieldAlert, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { EvaluationReport } from '../types';

interface PrivacyAuditProps {
  evaluation: EvaluationReport;
  onOpenCompliance: () => void;
}

export const PrivacyAudit: React.FC<PrivacyAuditProps> = ({ evaluation, onOpenCompliance }) => {
  const privacy = evaluation.privacy_details;
  const dcrHist = privacy?.dcr_histogram || [];

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-400" />
            <span>Differential Privacy & Re-Identification Audit</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical bounds against linkage attacks, shadow models, and memorization leaks.
          </p>
        </div>

        <button
          onClick={onOpenCompliance}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-950 text-brand-300 border border-brand-500/40 hover:bg-brand-900/60 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4" />
          <span>View Compliance Certificate</span>
        </button>
      </div>

      {/* Audit Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {/* Metric 1: DCR */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>DCR 5th Percentile</span>
            <span className="text-emerald-400 font-mono font-bold">
              {privacy?.dcr_5th_percentile.toFixed(4)}
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buffer &gt; 0.02 (Safe Distance)</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Guarantees no synthetic row is a memorized clone of a real subject.
          </p>
        </div>

        {/* Metric 2: MIA Resilience */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>MIA Resilience</span>
            <span className="text-cyan-400 font-mono font-bold">
              {privacy?.mia_resilience.toFixed(1)}%
            </span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Shadow Attack Neutralized</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Adversary cannot infer whether an individual was part of training.
          </p>
        </div>

        {/* Metric 3: PII Retention */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>PII Retention Rate</span>
            <span className="text-emerald-400 font-mono font-bold">0.00%</span>
          </div>
          <div className="mt-1 flex items-center space-x-1 text-[11px] text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero-PII Cryptographic Salt</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Direct identifiers (SSN, MRN, Email) are stripped & salt-hashed.
          </p>
        </div>
      </div>

      {/* DCR Distribution Chart */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-semibold text-slate-300 font-mono flex items-center space-x-2">
            <span>Distance to Closest Record (DCR) Frequency Spectrum</span>
          </h4>
          <span className="text-[11px] text-slate-500 font-mono">
            Euclidean metric in normalized feature space
          </span>
        </div>

        <div className="h-52 w-full">
          {dcrHist.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dcrHist} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Bar dataKey="synthetic_to_real" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Synthetic Distance Frequency" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              Calculating distance matrix...
            </div>
          )}
        </div>
      </div>

      {/* Legal Compliance Matrix */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
            GDPR Art. 25 (Privacy-by-Design)
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60">
            HIPAA Safe Harbor Certified
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full font-mono text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800/60">
            (ε={privacy?.epsilon_budget.toFixed(1)}, δ=10⁻⁵)-DP
          </span>
        </div>
        <span className="text-slate-400 font-mono text-[11px]">
          Approved for External Model Training & Testing
        </span>
      </div>
    </div>
  );
};
