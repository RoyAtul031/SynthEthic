import React, { useState } from 'react';
import { Activity, BarChart2, CheckCircle2, TrendingUp, HelpCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { EvaluationReport } from '../types';

interface UtilityReportProps {
  evaluation: EvaluationReport;
}

export const UtilityReport: React.FC<UtilityReportProps> = ({ evaluation }) => {
  const [selectedColIdx, setSelectedColIdx] = useState(0);

  const distributions = evaluation.feature_distributions || [];
  const currentDist = distributions[selectedColIdx] || distributions[0];
  const columnsMeta = evaluation.utility_details?.columns || {};

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            <span>Statistical Utility & Distribution Fidelity</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical validation of marginal and joint distributions: Real Data vs Synthetic Twin.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Mean Wasserstein: </span>
            <span className="text-cyan-400 font-bold">
              {evaluation.utility_details?.mean_wasserstein_distance.toFixed(4)}
            </span>
          </div>

          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Correlation Fidelity: </span>
            <span className="text-brand-400 font-bold">
              {evaluation.utility_details?.correlation_preservation_score.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Feature Selector Tabs */}
      {distributions.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {distributions.map((dist, idx) => (
            <button
              key={dist.column}
              onClick={() => setSelectedColIdx(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedColIdx === idx
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {dist.column} ({dist.type})
            </button>
          ))}
        </div>
      )}

      {/* Distribution Comparison Chart */}
      <div className="mt-4 h-64 w-full">
        {currentDist && currentDist.data ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={currentDist.data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
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
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Bar dataKey="Real" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Real Baseline" />
              <Bar dataKey="Synthetic" fill="#10b981" radius={[4, 4, 0, 0]} name="Synthetic Twin (DP-WGAN)" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
            No distribution data available
          </div>
        )}
      </div>

      {/* Column-by-Column Evaluation Table */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
          Column Fidelity Scorecard
        </h4>
        <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-slate-950/60 max-h-56">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800 sticky top-0">
              <tr>
                <th className="py-2.5 px-3">Column Name</th>
                <th className="py-2.5 px-3">Distribution Type</th>
                <th className="py-2.5 px-3">Primary Metric</th>
                <th className="py-2.5 px-3">Distance / Divergence</th>
                <th className="py-2.5 px-3">Preservation Fidelity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {Object.entries(columnsMeta).map(([colName, meta]) => (
                <tr key={colName} className="hover:bg-slate-900/40">
                  <td className="py-2 px-3 font-semibold text-slate-200">{colName}</td>
                  <td className="py-2 px-3 capitalize text-slate-400">{meta.type}</td>
                  <td className="py-2 px-3 text-slate-400">{meta.metric_name}</td>
                  <td className="py-2 px-3 text-cyan-400">{meta.raw_distance}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-brand-500 h-full rounded-full"
                          style={{ width: `${meta.fidelity_score}%` }}
                        />
                      </div>
                      <span className="text-brand-300 font-bold">{meta.fidelity_score}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
