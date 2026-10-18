import React from 'react';
import { Cpu, Activity, Lock, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { TrainingMetricEntry } from '../types';

interface TrainingMonitorProps {
  isTraining: boolean;
  history: TrainingMetricEntry[];
  totalEpochs: number;
  targetEpsilon: number;
}

export const TrainingMonitor: React.FC<TrainingMonitorProps> = ({
  isTraining,
  history,
  totalEpochs,
  targetEpsilon,
}) => {
  const latest = history[history.length - 1];
  const progressPercent = latest ? latest.progress_percent : 0;
  const currentEpoch = latest ? latest.epoch : 0;
  const currentEps = latest ? latest.epsilon_spent : 0;

  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-xl ${isTraining ? 'bg-brand-500/20 text-brand-400 animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>DP-WGAN Training Engine Telemetry</span>
              {isTraining ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-950 border border-brand-500/40 text-brand-300 animate-pulse">
                  Active DP-SGD
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Converged</span>
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Wasserstein loss optimization with Rényi Differential Privacy moments accountant.
            </p>
          </div>
        </div>

        {/* Live metric chips */}
        <div className="flex items-center space-x-4 text-xs font-mono">
          <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Epoch: </span>
            <span className="text-brand-400 font-bold">{currentEpoch}</span>
            <span className="text-slate-500"> / {totalEpochs}</span>
          </div>

          <div className="bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Epsilon (ε): </span>
            <span className="text-purple-400 font-bold">{currentEps.toFixed(2)}</span>
            <span className="text-slate-500"> (cap: {targetEpsilon.toFixed(2)})</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-mono mb-1.5">
          <span className="text-slate-400">Generative Synthesis Progress</span>
          <span className="text-brand-400 font-bold">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-brand-500 via-cyan-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Loss Curves Chart */}
      <div className="mt-6">
        <div className="h-64 w-full">
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="epoch"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  label={{ value: 'Epoch', position: 'insideBottomRight', offset: -5, fill: '#64748b', fontSize: 10 }}
                />
                <YAxis
                  yAxisId="loss"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
                <YAxis
                  yAxisId="eps"
                  orientation="right"
                  stroke="#a855f7"
                  fontSize={11}
                  tickLine={false}
                  domain={[0, targetEpsilon * 1.2]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  yAxisId="loss"
                  type="monotone"
                  dataKey="d_loss"
                  name="Discriminator (Wasserstein Loss)"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="loss"
                  type="monotone"
                  dataKey="g_loss"
                  name="Generator Loss"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="eps"
                  type="monotone"
                  dataKey="epsilon_spent"
                  name="Accumulated ε (RDP)"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 font-mono text-xs">
              Waiting for training initialization...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
