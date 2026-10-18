import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { DatasetPanel } from './components/DatasetPanel';
import { TrainingMonitor } from './components/TrainingMonitor';
import { UtilityReport } from './components/UtilityReport';
import { PrivacyAudit } from './components/PrivacyAudit';
import { TwinDataExplorer } from './components/TwinDataExplorer';
import { HyperparamsModal } from './components/HyperparamsModal';
import { ExportModal } from './components/ExportModal';
import { ComplianceModal } from './components/ComplianceModal';

import { LandingPage } from './components/LandingPage';

import { api } from './services/api';
import { DatasetItem, DatasetPreview, SynthesisConfig, EvaluationReport, TwinDataPayload, TrainingMetricEntry, User } from './types';
import { ShieldCheck, Sparkles, Database, BarChart3, Layers } from 'lucide-react';

export const App: React.FC = () => {
  // Routing view state: 'landing' or 'studio'
  const [currentView, setCurrentView] = useState<'landing' | 'studio'>('landing');
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('synthethic_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Navigation & Modal states
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'twin' | 'utility' | 'privacy'>('twin');

  // Datasets state
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>('healthcare_hipaa');
  const [datasetPreview, setDatasetPreview] = useState<DatasetPreview | null>(null);

  // Training & Synthesis state
  const [config, setConfig] = useState<SynthesisConfig>({
    dataset_id: 'healthcare_hipaa',
    epsilon: 1.0,
    delta: 1e-5,
    epochs: 30,
    batch_size: 64,
    latent_dim: 32,
    learning_rate: 0.002,
    noise_mechanism: 'gaussian',
  });

  const [isTraining, setIsTraining] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [trainingHistory, setTrainingHistory] = useState<TrainingMetricEntry[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationReport | null>(null);
  const [twinData, setTwinData] = useState<TwinDataPayload | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isTableLoading, setIsTableLoading] = useState(false);

  // 1. Initial Load: Fetch available datasets and preview
  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const list = await api.getDatasets();
      setDatasets(list);
      if (list.length > 0) {
        const initialId = list[0].id;
        setSelectedDatasetId(initialId);
        loadPreview(initialId);
      }
    } catch (err) {
      console.error('Failed to load datasets:', err);
    }
  };

  const loadPreview = async (id: string) => {
    try {
      const prev = await api.getDatasetPreview(id);
      setDatasetPreview(prev);
    } catch (err) {
      console.error('Failed to load dataset preview:', err);
    }
  };

  const handleSelectDataset = (id: string) => {
    setSelectedDatasetId(id);
    setConfig((prev) => ({ ...prev, dataset_id: id }));
    loadPreview(id);
  };

  const handleUploadFile = async (file: File) => {
    try {
      const res = await api.uploadDataset(file);
      await loadDatasets();
      handleSelectDataset(res.dataset_id);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    }
  };

  // 2. Start DP-WGAN Synthesis Pipeline
  const handleStartSynthesis = async () => {
    setIsTraining(true);
    setTrainingHistory([]);
    try {
      // Optimistic simulated streaming telemetry for immediate visual responsiveness
      const stepInterval = setInterval(() => {
        setTrainingHistory((prev) => {
          if (prev.length >= config.epochs) {
            clearInterval(stepInterval);
            return prev;
          }
          const ep = prev.length + 1;
          const d_loss = (0.5 * Math.exp(-ep / 15) + (Math.random() * 0.08 - 0.04));
          const g_loss = (-0.4 * (1 - Math.exp(-ep / 12)) + (Math.random() * 0.06 - 0.03));
          const eps = Math.min(config.epsilon, (ep / config.epochs) * config.epsilon);
          return [
            ...prev,
            {
              epoch: ep,
              d_loss: parseFloat(d_loss.toFixed(4)),
              g_loss: parseFloat(g_loss.toFixed(4)),
              epsilon_spent: parseFloat(eps.toFixed(4)),
              progress_percent: parseFloat(((ep / config.epochs) * 100).toFixed(1)),
            },
          ];
        });
      }, 80);

      const result = await api.startSynthesis(config);
      clearInterval(stepInterval);

      setActiveJobId(result.job_id);

      // Load resulting evaluation and twin data
      const [evalRes, dataRes] = await Promise.all([
        api.getEvaluation(result.job_id),
        api.getTwinData(result.job_id, 1, 15),
      ]);

      setEvaluation(evalRes);
      setTwinData(dataRes);
      setCurrentPage(1);
    } catch (err: any) {
      alert(`Synthesis failed: ${err.message}`);
    } finally {
      setIsTraining(false);
    }
  };

  const handlePageChange = async (newPage: number) => {
    if (!activeJobId) return;
    setIsTableLoading(true);
    try {
      const data = await api.getTwinData(activeJobId, newPage, 15);
      setTwinData(data);
      setCurrentPage(newPage);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTableLoading(false);
    }
  };

  // Run a quick pre-warm synthesis on mount if no twin exists yet
  useEffect(() => {
    if (datasets.length > 0 && !activeJobId && !isTraining) {
      handleStartSynthesis();
    }
  }, [datasets.length]);

  // If on Landing Page, render the flagship Landing & Auth page
  if (currentView === 'landing') {
    return (
      <LandingPage
        onEnterStudio={(loggedUser) => {
          if (loggedUser) {
            setUser(loggedUser);
            localStorage.setItem('synthethic_user', JSON.stringify(loggedUser));
          }
          setCurrentView('studio');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Enterprise Top Navigation */}
      <Header
        onOpenConfig={() => setIsConfigOpen(true)}
        onOpenCompliance={() => setIsComplianceOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        hasTrainedTwin={!!twinData}
        isTraining={isTraining}
        epsilonBudget={config.epsilon}
        user={user}
        onReturnLanding={() => setCurrentView('landing')}
        onSignOut={() => {
          setUser(null);
          localStorage.removeItem('synthethic_user');
          setCurrentView('landing');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Title & Mission Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-500/30 text-brand-300 text-xs font-mono mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span>Decentralized Data-as-a-Service • 0% Real User PII</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
              Privacy-Preserving <span className="bg-gradient-to-r from-brand-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">Synthetic Twin</span> Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Eliminate GDPR & HIPAA regulatory exposure. Generate mathematically private tabular database twins with preserved joint distributions, correlation matrices, and verifiable Rényi Differential Privacy.
            </p>
          </div>
        </div>

        {/* Executive KPI Metric Cards */}
        <MetricCards
          evaluation={evaluation}
          targetEpsilon={config.epsilon}
          syntheticRows={twinData ? twinData.total_records : 1000}
        />

        {/* Ingestion & Dataset Selection Panel */}
        <DatasetPanel
          datasets={datasets}
          selectedDatasetId={selectedDatasetId}
          onSelectDataset={handleSelectDataset}
          datasetPreview={datasetPreview}
          onUploadFile={handleUploadFile}
          onStartSynthesis={handleStartSynthesis}
          isTraining={isTraining}
          targetEpsilon={config.epsilon}
        />

        {/* Live Training Telemetry Monitor */}
        <TrainingMonitor
          isTraining={isTraining}
          history={trainingHistory}
          totalEpochs={config.epochs}
          targetEpsilon={config.epsilon}
        />

        {/* Deep Analysis & Audit Section with Tabs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex space-x-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('twin')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'twin'
                    ? 'bg-brand-500/10 text-brand-300 border border-brand-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Database className="w-4 h-4" />
                <span>Database Twin Explorer</span>
              </button>

              <button
                onClick={() => setActiveTab('utility')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'utility'
                    ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Statistical Utility & Wasserstein Fidelity</span>
              </button>

              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                  activeTab === 'privacy'
                    ? 'bg-purple-500/10 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Differential Privacy & DCR Audit</span>
              </button>
            </div>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'twin' && (
            <TwinDataExplorer
              twinData={twinData}
              onPageChange={handlePageChange}
              isLoading={isTableLoading}
            />
          )}

          {activeTab === 'utility' && evaluation && (
            <UtilityReport evaluation={evaluation} />
          )}

          {activeTab === 'privacy' && evaluation && (
            <PrivacyAudit
              evaluation={evaluation}
              onOpenCompliance={() => setIsComplianceOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Enterprise Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/60 py-8 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">SynthEthic Platform</span>
            <span>•</span>
            <span>Privacy-by-Design Data Engineering</span>
          </div>
          <div className="flex items-center space-x-6">
            <span>Differential Privacy (RDP)</span>
            <span>GDPR Art. 25 & HIPAA Compliant</span>
            <span>WGAN-GP Tensor Engine</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <HyperparamsModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={config}
        onChangeConfig={setConfig}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        jobId={activeJobId}
        totalRecords={twinData?.total_records}
      />

      <ComplianceModal
        isOpen={isComplianceOpen}
        onClose={() => setIsComplianceOpen(false)}
        jobId={activeJobId}
      />
    </div>
  );
};
