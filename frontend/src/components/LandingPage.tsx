import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Database, 
  ArrowRight, 
  Activity, 
  Layers, 
  Award, 
  CheckCircle2, 
  FileText, 
  Cpu, 
  EyeOff, 
  ExternalLink,
  ChevronRight,
  Sliders,
  HeartPulse,
  CreditCard,
  Cloud,
  Terminal,
  Code
} from 'lucide-react';
import { AuthModal } from './AuthModal';
import { User } from '../types';

interface LandingPageProps {
  onEnterStudio: (user?: User) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterStudio }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  
  // Interactive Epsilon Simulator in Hero
  const [simulatedEps, setSimulatedEps] = useState(1.0);

  // Dynamic values based on simulated epsilon
  const simPrivacy = Math.min(99.6, Math.max(82.0, 100 - (simulatedEps * 3.8))).toFixed(1);
  const simUtility = Math.min(98.5, Math.max(68.0, 75 + (simulatedEps * 4.6))).toFixed(1);
  const simDCR = Math.max(0.15, (0.55 - simulatedEps * 0.06)).toFixed(3);
  const simWasserstein = Math.max(0.04, (0.16 - simulatedEps * 0.024)).toFixed(3);

  const handleOpenAuth = (mode: 'signin' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: User) => {
    setIsAuthModalOpen(false);
    onEnterStudio(user);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white font-sans">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080c14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            </div>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-8 text-xs font-mono text-slate-400">
            <a href="#features" className="hover:text-brand-400 transition-colors">Features</a>
            <a href="#architecture" className="hover:text-cyan-400 transition-colors">Architecture</a>
            <a href="#benchmarks" className="hover:text-purple-400 transition-colors">Benchmarks</a>
            <a href="#research" className="hover:text-emerald-400 transition-colors">Research & Math</a>
            <a href="http://localhost:8000/docs" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-white transition-colors">
              <span>Swagger API</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleOpenAuth('signin')}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all cursor-pointer font-mono"
            >
              Sign In
            </button>
            <button
              onClick={() => onEnterStudio()}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-brand-500 to-emerald-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-brand-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer font-mono"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Studio</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-500/15 via-cyan-500/10 to-purple-500/15 rounded-full blur-[110px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-brand-500/30 text-brand-300 text-xs font-mono shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
              <span>Decentralized Data-as-a-Service • Rényi Differential Privacy</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-mono">
              Train AI on Real Data <br />
              <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Without the Real Data.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              GDPR Article 25 and HIPAA laws strictly prohibit testing and training on real user PII.
              SynthEthic uses <strong>DP-WGAN-GP</strong> and cryptographic noise-encoding to generate an exact <strong>Synthetic Database Twin</strong> with identical statistical properties and <strong>0% real user records</strong>.
            </p>

            {/* Hero CTAs */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onEnterStudio()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer font-mono"
              >
                <span>Launch Interactive Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenAuth('signin')}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all cursor-pointer font-mono flex items-center justify-center space-x-2"
              >
                <Lock className="w-4 h-4 text-brand-400" />
                <span>Enterprise Sign In</span>
              </button>

              <a
                href="http://localhost:8000/docs"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/80 text-cyan-300 border border-cyan-800/40 font-mono text-sm transition-all flex items-center justify-center space-x-1.5"
              >
                <Terminal className="w-4 h-4" />
                <span>REST API Docs</span>
              </a>
            </div>

            {/* Compliance Micro-Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                <span>GDPR Art. 25 & Recital 26</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>HIPAA Safe Harbor (18 Identifiers)</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Rényi DP Moments Accountant</span>
              </span>
            </div>
          </div>

          {/* Live Interactive DP Epsilon Simulator Card */}
          <div className="mt-14 max-w-4xl mx-auto">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-purple-950 text-purple-300 border border-purple-800/60 uppercase">
                      Interactive Live Simulator
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Differential Privacy Trade-off Curve
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    Calibrate the Privacy Budget Epsilon (ε)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Drag the slider to dynamically simulate mathematical confidentiality vs statistical utility.
                  </p>
                </div>

                <div className="bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800 text-right">
                  <div className="text-[10px] font-mono uppercase text-slate-400">Privacy Loss Budget</div>
                  <div className="text-xl font-bold font-mono text-purple-400">ε = {simulatedEps.toFixed(2)}</div>
                  <div className="text-[10px] font-mono text-slate-500">δ = 10⁻⁵ Bound</div>
                </div>
              </div>

              {/* Slider Input */}
              <div className="mt-6 space-y-2">
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={simulatedEps}
                  onChange={(e) => setSimulatedEps(parseFloat(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0.1 (Strict Confidentiality • Defense Against State Adversaries)</span>
                  <span>1.0 (Enterprise Benchmark)</span>
                  <span>5.0 (High Precision Testing)</span>
                </div>
              </div>

              {/* Dynamic Live Metric Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Privacy Score</span>
                  <span className="text-2xl font-extrabold text-brand-400 font-mono">{simPrivacy}%</span>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">GDPR Compliant</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Utility Score</span>
                  <span className="text-2xl font-extrabold text-cyan-400 font-mono">{simUtility}%</span>
                  <span className="text-[10px] text-cyan-400 block mt-0.5">Correlation Match</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">DCR Margin</span>
                  <span className="text-2xl font-extrabold text-purple-400 font-mono">{simDCR}</span>
                  <span className="text-[10px] text-purple-300 block mt-0.5">0% Clones</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Wasserstein</span>
                  <span className="text-2xl font-extrabold text-white font-mono">{simWasserstein}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Earth Mover Dist</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem vs Solution Bento Grid */}
      <section id="features" className="py-16 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-2">
              The Fundamental Challenge
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
              Why Real Data in Dev/ML is a Legal Landmine
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Modern engineering teams are caught between strict compliance liabilities and the urgent need for realistic training data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* The Problem */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-rose-900/30 relative overflow-hidden">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <EyeOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">The Legacy Problem</h4>
                  <span className="text-xs text-rose-400 font-mono">Regulatory Fines & Slow Sprints</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-400 font-mono">
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>GDPR Penalties:</strong> Up to €20 Million or 4% of global annual turnover for staging/dev data leaks.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>HIPAA Criminal Liability:</strong> PHI exposure in testing environments carries severe federal penalties.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Naive Masking Fails:</strong> Simple anonymization is routinely re-identified via linkage attacks and auxiliary datasets.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span><strong>Dumb Mock Generators:</strong> Traditional Faker scripts fail to capture complex multivariate correlations.</span>
                </li>
              </ul>
            </div>

            {/* The Solution */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-brand-500/40 relative overflow-hidden shadow-lg shadow-brand-500/5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">The SynthEthic Solution</h4>
                  <span className="text-xs text-brand-400 font-mono">Mathematical Privacy + Statistical Twins</span>
                </div>
              </div>
              <ul className="space-y-3 text-xs text-slate-300 font-mono">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>Formal (ε, δ)-DP Guarantee:</strong> Mathematically bounds the maximum information gain an adversary can ever extract.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>DP-WGAN-GP Neural Engine:</strong> Preserves continuous distributions and multi-modal categorical relationships.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>DCR Memorization Defense:</strong> Proves synthetic rows maintain safe Euclidean distance from training records.</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <span><strong>Full Data-as-a-Service Pipeline:</strong> 1-click export to CSV, JSON, or SQL DDL database migration scripts.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of Privacy Engineering */}
      <section id="architecture" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2">
              System Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
              The 4 Pillars of SynthEthic
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Engineered from the ground up for high-throughput enterprise pipelines and verifiable compliance audits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-brand-500/40 transition-all">
              <div className="p-3 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 w-fit mb-3">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">1. Noise-Encoding Gateway</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                High-speed Go streamer that detects and salt-hashes direct identifiers (SSN, MRN, Email) before data ever touches neural weights.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 w-fit mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">2. DP-WGAN-GP Engine</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Wasserstein GAN with Gradient Penalty enforcing Lipschitz-1 continuity and DP-SGD per-sample gradient perturbation.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition-all">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 w-fit mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">3. Rényi DP Accountant</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Continuous moment tracking across subsampled batches, converting cumulative RDP into formal (ε, δ) bounds without loose naive composition.
              </p>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit mb-3">
                <Award className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-mono">4. Automated Audit Seals</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Generates exportable compliance certificates verifying Distance to Closest Record (DCR) and Membership Inference Attack (MIA) resistance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Loaded Benchmarks Section */}
      <section id="benchmarks" className="py-16 border-t border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-2">
              Ready Out of the Box
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
              Pre-Configured Compliance Schemas
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Test with real-world schemas or upload your own CSV data in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Healthcare EHR</h4>
                  <span className="text-[11px] text-rose-400 font-mono">HIPAA Safe Harbor</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Patient vitals, systolic blood pressure, ICD-10 diagnoses, and 30-day readmissions with masked MRNs.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">FinTech Transactions</h4>
                  <span className="text-[11px] text-amber-400 font-mono">PCI-DSS & AML</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-volume payment streams, merchant categories, international flags, and severe fraud imbalance.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">SaaS Analytics</h4>
                  <span className="text-[11px] text-cyan-400 font-mono">GDPR Art. 25</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customer subscription contracts, tenure, support tickets, cloud storage GB, and churn predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research References */}
      <section id="research" className="py-16 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-2">
              Scientific Rigor
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
              Research Keywords & References
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              SynthEthic implements peer-reviewed algorithms from top machine learning and privacy venues (ACM CCS, NeurIPS, ICLR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-bold text-brand-300">"Differential Privacy in Synthetic Data"</div>
              <p className="text-slate-400 text-[11px] mt-1.5">
                Dwork & Roth (2014) • Abadi et al. (CCS 2016): Bounding sensitivity through calibrated Gaussian mechanisms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-bold text-cyan-300">"GANs for Tabular Data"</div>
              <p className="text-slate-400 text-[11px] mt-1.5">
                Xu et al. (NeurIPS 2019, CTGAN) • Gulrajani et al. (WGAN-GP): Wasserstein loss preventing mode collapse.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="font-bold text-purple-300">"Privacy-Preserving Testing"</div>
              <p className="text-slate-400 text-[11px] mt-1.5">
                Jordon et al. (PATE-GAN) • IEEE Standard 7002-2022 for Data Privacy Process in Software Engineering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-[#080c14] border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
            Ready to Forge Your Synthetic Database Twin?
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            Experience zero PII retention, mathematical differential privacy, and full database SQL export.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onEnterStudio()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-brand-500/25 inline-flex items-center space-x-2 transition-all transform hover:-translate-y-0.5 cursor-pointer font-mono"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Interactive Studio Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">SynthEthic Platform</span>
            <span>•</span>
            <span>Decentralized Privacy-Preserving Synthetic Data Generator</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>(ε, δ)-Differential Privacy</span>
            <span>GDPR Art. 25 & HIPAA Compliant</span>
            <button
              onClick={() => handleOpenAuth('signin')}
              className="text-brand-400 hover:underline cursor-pointer"
            >
              Enterprise Sign In
            </button>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authMode}
      />
    </div>
  );
};
