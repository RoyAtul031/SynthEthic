import React from 'react';
import { X, Sliders, Lock, Shield, Cpu, Info } from 'lucide-react';
import { SynthesisConfig } from '../types';

interface HyperparamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SynthesisConfig;
  onChangeConfig: (newConfig: SynthesisConfig) => void;
}

export const HyperparamsModal: React.FC<HyperparamsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
}) => {
  if (!isOpen) return null;

  const handleEpsChange = (val: number) => {
    onChangeConfig({ ...config, epsilon: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Differential Privacy & GAN Architecture Tuning
              </h3>
              <p className="text-xs text-slate-400">
                Calibrate formal mathematical privacy bounds and neural generator parameters.
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Epsilon Slider */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-200 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Differential Privacy Budget (ε)</span>
              </span>
              <span className="font-mono text-purple-400 font-bold text-sm">
                ε = {config.epsilon.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="5.0"
              step="0.1"
              value={config.epsilon}
              onChange={(e) => handleEpsChange(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.1 (Strict Confidentiality)</span>
              <span>1.0 (Enterprise Benchmark)</span>
              <span>5.0 (High Utility)</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Lower ε injects stronger mathematical perturbation, bounding any adversary's maximum information gain.
            </p>
          </div>

          {/* Grid Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* GAN Epochs */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                GAN Training Epochs
              </label>
              <select
                value={config.epochs}
                onChange={(e) => onChangeConfig({ ...config, epochs: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value={15}>15 Epochs (Rapid Demonstration)</option>
                <option value={30}>30 Epochs (Standard Balanced)</option>
                <option value={50}>50 Epochs (High Convergence)</option>
                <option value={80}>80 Epochs (Deep Tabular Polish)</option>
              </select>
            </div>

            {/* Batch Size */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Subsampling Batch Size
              </label>
              <select
                value={config.batch_size}
                onChange={(e) => onChangeConfig({ ...config, batch_size: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value={32}>32 samples / step</option>
                <option value={64}>64 samples / step (Recommended)</option>
                <option value={128}>128 samples / step</option>
              </select>
            </div>

            {/* Noise Mechanism */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Perturbation Mechanism
              </label>
              <select
                value={config.noise_mechanism}
                onChange={(e) => onChangeConfig({ ...config, noise_mechanism: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="gaussian">Gaussian (Rényi DP-SGD)</option>
                <option value="laplace">Laplace (Pure DP)</option>
              </select>
            </div>

            {/* Latent Noise Dimension */}
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Latent Vector Dimension (z)
              </label>
              <select
                value={config.latent_dim}
                onChange={(e) => onChangeConfig({ ...config, latent_dim: parseInt(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value={16}>16 dimensions</option>
                <option value={32}>32 dimensions (Standard)</option>
                <option value={64}>64 dimensions (High Entropy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 transition-all cursor-pointer shadow-md shadow-brand-500/20"
          >
            Apply Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
