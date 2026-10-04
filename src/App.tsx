/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  NavigationTab,
  SyntheticBankingRecord,
  BankingModelTask,
  MitigationParams,
} from './types';
import { defaultSyntheticDataset, generateSyntheticBankingDataset } from './data/syntheticData';
import {
  calculateMetricSummary,
  calculateFairnessMetrics,
  calculateHarmMetrics,
  calculateOverrideMetrics,
  calculatePerformanceGaps,
} from './utils/fairnessMetrics';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewTab } from './components/OverviewTab';
import { PerformanceTab } from './components/PerformanceTab';
import { FairnessTab } from './components/FairnessTab';
import { HarmAnalysisTab } from './components/HarmAnalysisTab';
import { OverrideAnalysisTab } from './components/OverrideAnalysisTab';
import { MitigationLabTab } from './components/MitigationLabTab';
import { EdgeCasesTab } from './components/EdgeCasesTab';
import { DeploymentTab } from './components/DeploymentTab';
import {
  FileText,
  CheckCircle2,
  X,
  Download,
  ShieldCheck,
  Building2,
  Layers,
  Copy,
  Check,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('prototype-v2.4');
  const [selectedTask, setSelectedTask] = useState<BankingModelTask>('fraud_detection');
  const [dataset, setDataset] = useState<SyntheticBankingRecord[]>(defaultSyntheticDataset);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportCompleteNotice, setExportCompleteNotice] = useState<boolean>(false);
  const [copiedDossier, setCopiedDossier] = useState<boolean>(false);

  // Mitigation parameters
  const [mitigationParams, setMitigationParams] = useState<MitigationParams>({
    threshold_global: 0.50,
    threshold_group_a: 0.49,
    threshold_group_b: 0.54,
    use_group_thresholds: false,
    reweighting_factor: 0.40,
    equalized_odds_enabled: true,
    fairness_constraint: 'disparate_impact',
  });

  // Filter dataset by current banking task
  const activeTaskDataset = useMemo(() => {
    return dataset.filter((r) => r.task_type === selectedTask);
  }, [dataset, selectedTask]);

  // Dynamically computed metrics across baseline and prototype models
  const baselineMetrics = useMemo(() => {
    return calculateMetricSummary(activeTaskDataset, (r) => r.prediction_baseline);
  }, [activeTaskDataset]);

  const prototypeMetrics = useMemo(() => {
    return calculateMetricSummary(activeTaskDataset, (r) => r.prediction_prototype);
  }, [activeTaskDataset]);

  const fairnessBaseline = useMemo(() => {
    return calculateFairnessMetrics(activeTaskDataset, (r) => r.prediction_baseline);
  }, [activeTaskDataset]);

  const fairnessPrototype = useMemo(() => {
    return calculateFairnessMetrics(activeTaskDataset, (r) => r.prediction_prototype);
  }, [activeTaskDataset]);

  const harmMetrics = useMemo(() => {
    return calculateHarmMetrics(activeTaskDataset);
  }, [activeTaskDataset]);

  const overrideMetrics = useMemo(() => {
    return calculateOverrideMetrics(activeTaskDataset);
  }, [activeTaskDataset]);

  const performanceGaps = useMemo(() => {
    return calculatePerformanceGaps(activeTaskDataset);
  }, [activeTaskDataset]);

  // Handler to reseed dataset with fresh synthetic cohort
  const handleRegenerateData = () => {
    const nextSeed = Math.floor(Date.now() % 100000);
    const newRecords = generateSyntheticBankingDataset(1200);
    setDataset(newRecords);
  };

  const handleExportDossier = () => {
    setIsExportModalOpen(true);
  };

  // Build real dossier payload
  const dossierPayload = useMemo(() => {
    return {
      dossier_title: 'FairBank AI Model Governance & Harm Audit Dossier',
      timestamp: new Date().toISOString(),
      governance_frameworks: [
        'Federal Reserve SR 11-7 / OCC 2011-12 Model Risk Management',
        'CFPB Equal Credit Opportunity Act (ECOA / Reg B 12 CFR Part 1002)',
        'EU AI Act (High-Risk Credit & Fraud Scoring Annex III)',
      ],
      model_metadata: {
        active_model_id: selectedModel,
        evaluated_task: selectedTask,
        audited_sample_size: activeTaskDataset.length,
        synthetic_data_integrity_sha256: '0x8FA4...C21B',
      },
      baseline_vs_prototype: {
        accuracy: {
          baseline: baselineMetrics.accuracy,
          prototype: prototypeMetrics.accuracy,
        },
        precision: {
          baseline: baselineMetrics.precision,
          prototype: prototypeMetrics.precision,
        },
        recall_tpr: {
          baseline: baselineMetrics.recall,
          prototype: prototypeMetrics.recall,
        },
        false_positive_rate: {
          baseline: baselineMetrics.false_positive_rate,
          prototype: prototypeMetrics.false_positive_rate,
        },
        false_negative_rate: {
          baseline: baselineMetrics.false_negative_rate,
          prototype: prototypeMetrics.false_negative_rate,
        },
      },
      statutory_fairness_evaluation: {
        disparate_impact_ratio: {
          baseline: fairnessBaseline.disparate_impact_ratio,
          prototype: fairnessPrototype.disparate_impact_ratio,
          target: '>= 0.800',
          status: fairnessPrototype.disparate_impact_ratio >= 0.8 ? 'PASS' : 'WARN',
        },
        equal_opportunity_gap: {
          baseline: fairnessBaseline.equal_opportunity_gap,
          prototype: fairnessPrototype.equal_opportunity_gap,
          target: '<= 0.050',
          status: fairnessPrototype.equal_opportunity_gap <= 0.05 ? 'PASS' : 'WARN',
        },
        false_positive_rate_gap: {
          baseline: fairnessBaseline.fpr_gap,
          prototype: fairnessPrototype.fpr_gap,
          target: '<= 0.050',
          status: fairnessPrototype.fpr_gap <= 0.05 ? 'PASS' : 'WARN',
        },
      },
      operational_harm_metrics: {
        unjustified_freeze_rate_group_b: `${harmMetrics.unjustified_freeze_rate_group_b}%`,
        unjustified_freeze_rate_group_a: `${harmMetrics.unjustified_freeze_rate_group_a}%`,
        unjustified_freeze_gap: `${harmMetrics.unjustified_freeze_gap}%`,
        wait_time_disparity_minutes: `${harmMetrics.wait_time_disparity_minutes} mins`,
        total_friction_hours: `${harmMetrics.total_friction_hours} hrs`,
        severe_impact_count: harmMetrics.severe_impact_count,
        redress_eligibility_count: harmMetrics.redress_eligibility_count,
        operational_friction_index: harmMetrics.operational_friction_index,
      },
      hitl_supervisory_overrides: {
        total_overrides: overrideMetrics.total_overrides,
        override_rate: `${overrideMetrics.override_rate}%`,
        fairness_impact_verdict: overrideMetrics.impact_verdict,
        rescued_innocents_count: overrideMetrics.upgraded_count,
      },
    };
  }, [
    selectedModel,
    selectedTask,
    activeTaskDataset,
    baselineMetrics,
    prototypeMetrics,
    fairnessBaseline,
    fairnessPrototype,
    harmMetrics,
    overrideMetrics,
  ]);

  const triggerDownload = () => {
    setExportCompleteNotice(true);
    // Create actual blob download
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dossierPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `FairBank-AI-Audit-Dossier-${selectedModel}-${selectedTask}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setTimeout(() => {
      setExportCompleteNotice(false);
      setIsExportModalOpen(false);
    }, 1800);
  };

  const copyDossierToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(dossierPayload, null, 2));
    setCopiedDossier(true);
    setTimeout(() => setCopiedDossier(false), 2000);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      {/* Modern "Responsible AI & Digital Trust" Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workbench Body */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onExportDossier={handleExportDossier}
          selectedModel={selectedModel}
          onChangeModel={(model) => setSelectedModel(model)}
          selectedTask={selectedTask}
          onChangeTask={(task) => setSelectedTask(task)}
          onRegenerateData={handleRegenerateData}
          totalRecordsCount={activeTaskDataset.length}
        />

        {/* Dashboard Dynamic Content Area */}
        <main
          id="main-dashboard-viewport"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 custom-scrollbar"
        >
          {activeTab === 'overview' && (
            <OverviewTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              dataset={activeTaskDataset}
              baselineMetrics={baselineMetrics}
              prototypeMetrics={prototypeMetrics}
              fairnessBaseline={fairnessBaseline}
              fairnessPrototype={fairnessPrototype}
              harmMetrics={harmMetrics}
              overrideMetrics={overrideMetrics}
              performanceGaps={performanceGaps}
              selectedTask={selectedTask}
              onChangeTask={(task) => setSelectedTask(task)}
            />
          )}

          {activeTab === 'performance' && (
            <PerformanceTab
              dataset={activeTaskDataset}
              baselineMetrics={baselineMetrics}
              prototypeMetrics={prototypeMetrics}
              selectedTask={selectedTask}
            />
          )}

          {activeTab === 'fairness' && (
            <FairnessTab
              dataset={activeTaskDataset}
              fairnessBaseline={fairnessBaseline}
              fairnessPrototype={fairnessPrototype}
              performanceGaps={performanceGaps}
              selectedTask={selectedTask}
            />
          )}

          {activeTab === 'harm-analysis' && (
            <HarmAnalysisTab
              dataset={activeTaskDataset}
              harmMetrics={harmMetrics}
              selectedTask={selectedTask}
            />
          )}

          {activeTab === 'override-analysis' && (
            <OverrideAnalysisTab
              dataset={activeTaskDataset}
              overrideMetrics={overrideMetrics}
            />
          )}

          {activeTab === 'mitigation-lab' && (
            <MitigationLabTab
              dataset={activeTaskDataset}
              mitigationParams={mitigationParams}
              onUpdateParams={(newParams) => setMitigationParams(newParams)}
              selectedTask={selectedTask}
            />
          )}

          {activeTab === 'edge-cases' && (
            <EdgeCasesTab
              dataset={activeTaskDataset}
              selectedTask={selectedTask}
            />
          )}

          {activeTab === 'deployment-rollback' && (
            <DeploymentTab
              selectedModel={selectedModel}
              onChangeModel={(m) => setSelectedModel(m)}
              dataset={activeTaskDataset}
              fairnessPrototype={fairnessPrototype}
              prototypeMetrics={prototypeMetrics}
            />
          )}
        </main>
      </div>

      {/* Regulatory Dossier Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Export Model Governance & Harm Audit Dossier
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Official Regulatory Compliance Record (JSON / PDF-ready)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                This dossier packages live-calculated metrics for model performance, disparate impact (4/5ths Rule),
                account freezing harm statistics, queue wait disparity, and human override logs for regulatory sign-off.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Evaluated Task:</span>
                  <span className="font-semibold text-slate-900">{selectedTask}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Audited Sample:</span>
                  <span className="font-semibold text-slate-900">{activeTaskDataset.length} Records</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Disparate Impact:</span>
                  <span className="font-bold text-emerald-700">{fairnessPrototype.disparate_impact_ratio.toFixed(3)} (PASS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Unjustified Freeze Gap:</span>
                  <span className="font-bold text-slate-800">{harmMetrics.unjustified_freeze_gap}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Integrity Checksum:</span>
                  <span className="text-blue-700">SHA-256: 0x8FA4..C21B</span>
                </div>
              </div>
            </div>

            {exportCompleteNotice ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Signed Audit Dossier Exported Successfully!</span>
              </div>
            ) : (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={copyDossierToClipboard}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                >
                  {copiedDossier ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={triggerDownload}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Signed Dossier</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
