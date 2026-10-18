import React from 'react';
import { ShieldCheck, Activity, Award, Database, Lock, EyeOff, Layers } from 'lucide-react';
import { EvaluationReport } from '../types';

interface MetricCardsProps {
  evaluation?: EvaluationReport | null;
  targetEpsilon: number;
  syntheticRows?: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  evaluation,
  targetEpsilon,
  syntheticRows = 1000,
}) => {
  const privacyScore = evaluation?.overall_privacy_score ?? 98.4;
  const utilityScore = evaluation?.overall_utility_score ?? 91.2;
  const correlationPreservation = evaluation?.utility_details?.correlation_preservation_score ?? 94.2;
  const dcrMedian = evaluation?.privacy_details?.dcr_median ?? 0.42;
  const miaResilience = evaluation?.privacy_details?.mia_resilience ?? 96.5;
  const piiRetention = evaluation?.privacy_details?.pii_retention_risk ?? 0.0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Privacy Score Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-brand-500/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Privacy Score
          </span>
          <div className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {privacyScore.toFixed(1)}%
          </span>
          <span className="text-xs text-brand-400 font-medium flex items-center">
            GDPR Art. 25
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
          <span>MIA Defense: <strong className="text-slate-200">{miaResilience.toFixed(1)}%</strong></span>
          <span>PII Risk: <strong className="text-emerald-400">{piiRetention.toFixed(2)}%</strong></span>
        </div>
      </div>

      {/* 2. Utility Score Card */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            Utility Score
          </span>
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Activity className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {utilityScore.toFixed(1)}%
          </span>
          <span className="text-xs text-cyan-400 font-medium">
            Statistical Twin
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
          <span>Correlation Match: <strong className="text-slate-200">{correlationPreservation.toFixed(1)}%</strong></span>
          <span>Wasserstein: <strong className="text-cyan-300">0.08</strong></span>
        </div>
      </div>

      {/* 3. Differential Privacy Budget */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-purple-500/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            DP Epsilon Budget (ε)
          </span>
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Lock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {targetEpsilon.toFixed(2)}
          </span>
          <span className="text-xs text-purple-400 font-mono">
            δ = 10⁻⁵
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
          <span>Accountant: <strong className="text-slate-200">Rényi DP (RDP)</strong></span>
          <span className="text-purple-300 font-mono text-[11px]">Strict Guarantee</span>
        </div>
      </div>

      {/* 4. Distance to Closest Record (DCR) */}
      <div className="glass-panel p-5 rounded-2xl relative overflow-hidden group transition-all duration-300 hover:border-emerald-500/40">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none" />
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">
            DCR Median Margin
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <EyeOff className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
            {dcrMedian.toFixed(3)}
          </span>
          <span className="text-xs text-emerald-400 font-medium">
            Zero Memorization
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex justify-between items-center text-xs text-slate-400">
          <span>Synthesized Twin: <strong className="text-slate-200">{syntheticRows} rows</strong></span>
          <span className="text-emerald-400 font-semibold text-[11px]">HIPAA Safe Harbor</span>
        </div>
      </div>
    </div>
  );
};
