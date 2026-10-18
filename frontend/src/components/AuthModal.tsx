import React, { useState } from 'react';
import { X, ShieldCheck, Lock, Mail, Building, UserCheck, Eye, EyeOff, Sparkles, CheckCircle, ArrowRight, Github } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  initialMode?: 'signin' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'signin',
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('AI Research Engineer');
  const [agreedToGdpr, setAgreedToGdpr] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      name: name || (email ? email.split('@')[0] : 'Research Specialist'),
      email: email || 'specialist@synthethic.ai',
      role: role,
      organization: organization || 'Enterprise AI Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      token: `synth_jwt_${Date.now()}`
    };
    onLoginSuccess(newUser);
  };

  const handleQuickLogin = (demoRole: 'ai_engineer' | 'dpo' | 'guest') => {
    let demoUser: User;
    if (demoRole === 'ai_engineer') {
      demoUser = {
        name: 'Dr. Sarah Lin',
        email: 'sarah.lin@healthnova-ai.org',
        role: 'Lead ML Research Engineer',
        organization: 'HealthNova Genomics',
        token: `synth_jwt_${Date.now()}`
      };
    } else if (demoRole === 'dpo') {
      demoUser = {
        name: 'Marcus Vance',
        email: 'm.vance@finflow-compliance.eu',
        role: 'Chief Data Privacy Officer (DPO)',
        organization: 'FinFlow European Trust',
        token: `synth_jwt_${Date.now()}`
      };
    } else {
      demoUser = {
        name: 'Guest Researcher',
        email: 'guest@synthethic.io',
        role: 'Evaluation Specialist',
        organization: 'Public Sandbox Environment',
        token: `synth_jwt_${Date.now()}`
      };
    }
    onLoginSuccess(demoUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0b0f19] border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Glow backdrop decoration */}
        <div className="absolute -top-20 -left-20 w-44 h-44 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-800/80 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-400 to-cyan-500 text-slate-950 font-black shadow-md shadow-brand-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center space-x-1.5">
                <span>Synth</span>
                <span className="text-brand-400">Ethic</span>
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-brand-950 text-brand-300 border border-brand-500/40">
                  Auth Gateway
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'signin' ? 'Sign in to access your synthetic database twins' : 'Create an enterprise compliance workspace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Fast Passes (High Conversion Demo Options) */}
        <div className="px-6 pt-4 pb-2 relative z-10">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider mb-2 block">
            Instant 1-Click Demo Profiles:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('ai_engineer')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-brand-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-brand-300 group-hover:text-brand-400">AI Engineer</div>
              <div className="text-[9px] text-slate-500 truncate">Healthcare EHR</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('dpo')}
              className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-cyan-300 group-hover:text-cyan-400">Privacy Officer</div>
              <div className="text-[9px] text-slate-500 truncate">GDPR & HIPAA</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('guest')}
              className="p-2.5 rounded-xl bg-gradient-to-br from-brand-950/60 to-slate-900 border border-brand-500/40 hover:border-brand-400 text-left transition-all cursor-pointer group shadow-sm"
            >
              <div className="text-[11px] font-bold text-white flex items-center space-x-1">
                <Sparkles className="w-2.5 h-2.5 text-brand-400" />
                <span>Guest Pass</span>
              </div>
              <div className="text-[9px] text-brand-400 truncate">Instant Studio</div>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="px-6 py-2 flex items-center space-x-3 text-slate-600 text-xs font-mono">
          <div className="flex-1 h-px bg-slate-800" />
          <span>or credentials</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Tab switch between Sign In and Register */}
        <div className="px-6 pt-1">
          <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setMode('signin')}
              className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                mode === 'register'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-3.5 relative z-10">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="Dr. Jordan Hayes"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Organization
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="MedTech Labs"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-2.5 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Primary Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-brand-500 transition-all"
                  >
                    <option value="AI Research Engineer">AI / ML Engineer</option>
                    <option value="Data Privacy Officer">Privacy Officer (DPO)</option>
                    <option value="Security Architect">Security Lead</option>
                    <option value="Data Scientist">Data Scientist</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="developer@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-slate-300">
                Password
              </label>
              {mode === 'signin' && (
                <a href="#reset" onClick={(e) => { e.preventDefault(); alert("Use the 1-Click Demo Profiles above to sign in instantly!"); }} className="text-[10px] text-brand-400 hover:underline">
                  Forgot?
                </a>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-all"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="flex items-start space-x-2 pt-1">
              <input
                type="checkbox"
                id="gdpr"
                checked={agreedToGdpr}
                onChange={(e) => setAgreedToGdpr(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 cursor-pointer"
              />
              <label htmlFor="gdpr" className="text-[10px] text-slate-400 leading-tight">
                I agree to Privacy-by-Design processing under GDPR Art. 25 & HIPAA Safe Harbor guidelines.
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-500 via-emerald-500 to-teal-500 hover:from-brand-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center justify-center space-x-1.5 transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
          >
            <span>{mode === 'signin' ? 'Access Synth Studio' : 'Create Secure Workspace'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* SSO Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Enterprise SSO:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleQuickLogin('guest')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px] flex items-center space-x-1"
            >
              <Github className="w-3 h-3" />
              <span>GitHub</span>
            </button>
            <button
              onClick={() => handleQuickLogin('guest')}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[10px]"
            >
              Okta / SAML
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
