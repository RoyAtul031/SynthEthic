import React from 'react';
import { ShieldCheck, Database, Cpu, FileText, Download, Sliders, Lock, Sparkles, LogOut, ArrowLeft, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onOpenConfig: () => void;
  onOpenCompliance: () => void;
  onOpenExport: () => void;
  hasTrainedTwin: boolean;
  isTraining: boolean;
  datasetName?: string;
  epsilonBudget?: number;
  user?: User | null;
  onSignOut?: () => void;
  onReturnLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConfig,
  onOpenCompliance,
  onOpenExport,
  hasTrainedTwin,
  isTraining,
  datasetName,
  epsilonBudget = 1.0,
  user,
  onSignOut,
  onReturnLanding,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-500 text-slate-950 font-black shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 text-slate-950" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white font-mono">
                Synth<span className="text-brand-400">Ethic</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded-full bg-brand-950 border border-brand-500/40 text-brand-300">
                DP-SDG v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Decentralized Privacy-Preserving Synthetic Data Generator
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center space-x-3 text-xs">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-brand-400" />
            <span>Differential Privacy:</span>
            <span className="font-mono text-brand-300 font-semibold">ε = {epsilonBudget.toFixed(2)}</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-medium">Zero-PII Storage</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenConfig}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 transition-all shadow-sm"
            title="Configure Differential Privacy & GAN Hyperparameters"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">DP & Model Tuning</span>
          </button>

          <button
            onClick={onOpenCompliance}
            disabled={!hasTrainedTwin}
            className={`flex items-center space-x-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
              hasTrainedTwin
                ? 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-800/60 shadow-cyan-950/30'
                : 'bg-slate-900/40 text-slate-500 border-slate-800 cursor-not-allowed'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audit Certificate</span>
          </button>

          <button
            onClick={onOpenExport}
            disabled={!hasTrainedTwin || isTraining}
            className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg shadow-md transition-all ${
              hasTrainedTwin && !isTraining
                ? 'bg-gradient-to-r from-brand-500 to-emerald-600 hover:from-brand-400 hover:to-emerald-500 text-slate-950 font-bold shadow-brand-500/20 cursor-pointer'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Twin</span>
          </button>

          {/* User Profile & Navigation */}
          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {user && (
            <div className="hidden lg:flex items-center space-x-2 pl-1 font-mono">
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 text-xs font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="text-[11px] leading-tight">
                <div className="text-white font-semibold truncate max-w-[120px]">{user.name}</div>
                <div className="text-[9px] text-slate-400 truncate max-w-[120px]">{user.organization}</div>
              </div>
            </div>
          )}

          {onReturnLanding && (
            <button
              onClick={onReturnLanding}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all font-mono"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Landing</span>
            </button>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-800 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
