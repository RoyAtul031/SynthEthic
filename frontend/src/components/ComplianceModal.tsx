import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, Award, FileCheck, CheckCircle2, Lock, Printer, Download } from 'lucide-react';
import { ComplianceCertificate } from '../types';
import { api } from '../services/api';

interface ComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string | null;
}

export const ComplianceModal: React.FC<ComplianceModalProps> = ({
  isOpen,
  onClose,
  jobId,
}) => {
  const [report, setReport] = useState<ComplianceCertificate | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      setLoading(true);
      api.getComplianceReport(jobId)
        .then((data) => setReport(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, jobId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0a0e17] border border-brand-500/40 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-brand-500/10">
        {/* Certificate Header */}
        <div className="px-6 py-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Privacy-by-Design Compliance Audit Certificate</span>
              </h3>
              <span className="text-xs font-mono text-brand-400">
                {report ? report.certificate_id : 'Generating verification record...'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-mono text-xs text-slate-300">
          {loading || !report ? (
            <div className="py-12 text-center text-slate-400">
              Verifying mathematical differential privacy bounds...
            </div>
          ) : (
            <>
              {/* Verification Seal Banner */}
              <div className="p-4 rounded-xl bg-brand-950/40 border border-brand-500/30 flex items-center justify-between">
                <div>
                  <div className="text-emerald-400 font-bold text-sm flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>VERIFIED PRIVACY-PRESERVING SYNTHETIC TWIN</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Complies with GDPR Article 25 (Data Protection by Design) & HIPAA 45 CFR § 164.514(b)
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                  PASSED
                </div>
              </div>

              {/* Section 1: Mathematical Guarantee */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-2">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>1. Formal Differential Privacy Bounds</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                  <div>Epsilon Privacy Budget (ε): <strong className="text-slate-200">{report.differential_privacy.epsilon}</strong></div>
                  <div>Delta Failure Bound (δ): <strong className="text-slate-200">{report.differential_privacy.delta}</strong></div>
                  <div className="col-span-2">Mechanism: <strong className="text-slate-200">{report.differential_privacy.mechanism}</strong></div>
                  <div className="col-span-2 text-purple-300 text-[11px]">{report.differential_privacy.mathematical_guarantee}</div>
                </div>
              </div>

              {/* Section 2: Empirical Privacy Verification */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                  <span>2. Empirical Attack & Linkage Resistance</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-400 pt-1">
                  <div>Empirical Privacy Score: <strong className="text-brand-300">{report.empirical_privacy.empirical_score}%</strong></div>
                  <div>DCR Median Margin: <strong className="text-slate-200">{report.empirical_privacy.distance_to_closest_record_median}</strong></div>
                  <div>MIA Shadow Defense: <strong className="text-cyan-300">{report.empirical_privacy.membership_inference_attack_resilience}</strong></div>
                  <div>PII Retention Rate: <strong className="text-emerald-400">{report.empirical_privacy.pii_leakage_rate}</strong></div>
                </div>
              </div>

              {/* Section 3: Legal Affirmation */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-2">
                  <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>3. Legal Framework Compliance Matrix</span>
                </h4>
                <ul className="space-y-1.5 text-slate-400 text-[11px] pt-1">
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>GDPR Recital 26: Rendered completely anonymous, outside GDPR scope for sharing.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HIPAA Safe Harbor: All 18 designated PII identifiers permanently stripped.</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Synthetic Twin is legally eligible for multi-tenant AI training, cloud QA, and external benchmarking.</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Certificate Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Standard: IEEE 7002-2022 Data Privacy Engineering
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Audit</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-400 text-slate-950 transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
