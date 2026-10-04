import React, { useState } from 'react';
import {
  ShieldCheck,
  Scale,
  Activity,
  AlertTriangle,
  UserCheck,
  CheckCircle2,
  Sliders,
  TrendingUp,
  FileCheck,
  Clock,
  ArrowUpRight,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Search,
  Flame,
  Info,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  MetricSummary,
  HarmEvaluationMetrics,
  OverrideMetrics,
  PerformanceGapItem,
  NavigationTab,
  BankingModelTask,
} from '../types';

interface OverviewTabProps {
  onNavigateTab: (tab: NavigationTab) => void;
  dataset: SyntheticBankingRecord[];
  baselineMetrics: MetricSummary;
  prototypeMetrics: MetricSummary;
  fairnessBaseline: any;
  fairnessPrototype: any;
  harmMetrics: HarmEvaluationMetrics;
  overrideMetrics: OverrideMetrics;
  performanceGaps: PerformanceGapItem[];
  selectedTask: BankingModelTask;
  onChangeTask: (task: BankingModelTask) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  onNavigateTab,
  dataset,
  baselineMetrics,
  prototypeMetrics,
  fairnessBaseline,
  fairnessPrototype,
  harmMetrics,
  overrideMetrics,
  performanceGaps,
  selectedTask,
  onChangeTask,
}) => {
  const [dataSearchTerm, setDataSearchTerm] = useState('');
  const [dataFilterGroup, setDataFilterGroup] = useState<string>('All');
  const [previewPage, setPreviewPage] = useState(1);
  const itemsPerPage = 6;

  // Filter preview records
  const filteredRecords = dataset.filter((r) => {
    const matchesSearch =
      r.customer_id.toLowerCase().includes(dataSearchTerm.toLowerCase()) ||
      r.proxy_group.toLowerCase().includes(dataSearchTerm.toLowerCase()) ||
      r.group_label.toLowerCase().includes(dataSearchTerm.toLowerCase());
    const matchesGroup =
      dataFilterGroup === 'All' ||
      (dataFilterGroup === 'Group A' && r.protected_group.includes('Group A')) ||
      (dataFilterGroup === 'Group B' && r.protected_group.includes('Group B')) ||
      (dataFilterGroup === 'False Positive' && r.false_positive) ||
      (dataFilterGroup === 'Override' && r.override_decision !== 'None');

    return matchesSearch && matchesGroup;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (previewPage - 1) * itemsPerPage,
    previewPage * itemsPerPage,
  );

  const workflowSteps = [
    { num: '1', title: 'Dataset', desc: 'Synthetic representative bank records', tab: 'overview' as NavigationTab },
    { num: '2', title: 'Predictions', desc: 'Baseline & prototype model scoring', tab: 'performance' as NavigationTab },
    { num: '3', title: 'Outcome Analysis', desc: 'Confusion matrix & error distributions', tab: 'performance' as NavigationTab },
    { num: '4', title: 'Fairness Analysis', desc: 'Disparate impact & parity gaps', tab: 'fairness' as NavigationTab },
    { num: '5', title: 'Harm Analysis', desc: 'Freezes, wait time & financial friction', tab: 'harm-analysis' as NavigationTab },
    { num: '6', title: 'Mitigation', desc: 'Debiasing & equalized odds tuning', tab: 'mitigation-lab' as NavigationTab },
    { num: '7', title: 'Validation', desc: 'Canary testing & gated release', tab: 'deployment-rollback' as NavigationTab },
  ];

  return (
    <div className="space-y-6">
      {/* Executive Hero Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                {selectedTask === 'fraud_detection'
                  ? 'Task: Fraud Detection & Freezing Model'
                  : 'Task: Customer Service Prioritisation Model'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Synthetic Benchmark: N = {dataset.length} Records
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono text-slate-500 bg-slate-100 border border-slate-200">
                Zero PII Architecture
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              FairBank AI – Fairness & Harm Evaluation Workbench
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Real-time algorithmic audit comparing model accuracy against protected-group disparity and operational harms.
              Evaluated under the Federal Reserve SR 11-7 Supervisory Guidance, CFPB ECOA / Reg B, and EU AI Act.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => onNavigateTab('fairness')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200 flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-slate-600" />
              <span>Fairness Metrics</span>
            </button>
            <button
              onClick={() => onNavigateTab('harm-analysis')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200 flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Harm Analysis</span>
            </button>
            <button
              onClick={() => onNavigateTab('mitigation-lab')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-100" />
              <span>Mitigation Lab</span>
            </button>
          </div>
        </div>

        {/* Clear End-to-End Governance Workflow Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Evaluation & Governance Pipeline Workflow
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Step 1 of 7: Dataset → Validation
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {workflowSteps.map((step, idx) => (
              <button
                key={step.title}
                onClick={() => onNavigateTab(step.tab)}
                className="group p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 text-left transition-all"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-mono font-bold text-slate-400 group-hover:text-blue-600">
                    0{step.num}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                </div>
                <div className="font-bold text-xs text-slate-800 group-hover:text-blue-900 mt-1">
                  {step.title}
                </div>
                <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {step.desc}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid (7 Cards calculated from live dataset) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3.5">
        {/* KPI 1: Overall Accuracy */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Accuracy</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {(prototypeMetrics.accuracy * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {prototypeMetrics.accuracy >= baselineMetrics.accuracy ? '+Calibrated' : 'Trade-off'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Baseline: <strong className="text-slate-700">{(baselineMetrics.accuracy * 100).toFixed(1)}%</strong>
          </p>
        </div>

        {/* KPI 2: Disparate Impact Ratio */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Disparate Impact</span>
            <Scale className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {fairnessPrototype.disparate_impact_ratio.toFixed(3)}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                fairnessPrototype.disparate_impact_ratio >= 0.8
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {fairnessPrototype.disparate_impact_ratio >= 0.8 ? 'PASS' : 'WARN'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Four-Fifths Rule Floor: <strong>0.800</strong>
          </p>
        </div>

        {/* KPI 3: Equal Opportunity Gap */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Equal Opp. Gap</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {(fairnessPrototype.equal_opportunity_gap * 100).toFixed(1)}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600">TPR Parity</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Tolerance: <strong>&lt; 5.0%</strong>
          </p>
        </div>

        {/* KPI 4: False Positive Rate Gap */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">FPR Gap</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {(fairnessPrototype.fpr_gap * 100).toFixed(1)}%
            </span>
            <span
              className={`text-[10px] font-bold ${
                fairnessPrototype.fpr_gap <= 0.05 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {fairnessPrototype.fpr_gap <= 0.05 ? 'Passed' : 'Elevated'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Direct driver of false freeze harm
          </p>
        </div>

        {/* KPI 5: Unjustified Freeze Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Harm: Freeze Gap</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-rose-700 font-mono">
              {harmMetrics.unjustified_freeze_gap}%
            </span>
            <span className="text-[10px] font-bold text-rose-600">Disparity</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Group B: {harmMetrics.unjustified_freeze_rate_group_b}% vs A: {harmMetrics.unjustified_freeze_rate_group_a}%
          </p>
        </div>

        {/* KPI 6: Officer Overrides */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Override Rate</span>
            <UserCheck className="w-4 h-4 text-slate-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {overrideMetrics.override_rate}%
            </span>
            <span className="text-[10px] font-bold text-emerald-600">
              {overrideMetrics.impact_verdict === 'Reduced Disparity' ? 'Bias Corrected' : 'Active'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            {overrideMetrics.total_overrides} / {overrideMetrics.total_evaluations} cases reviewed
          </p>
        </div>

        {/* KPI 7: Operational Friction Index */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Friction Index</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {harmMetrics.operational_friction_index}
            </span>
            <span className="text-[10px] text-slate-400">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-500">
            {harmMetrics.severe_impact_count} severe harm cases flagged
          </p>
        </div>
      </div>

      {/* Main Comparison Section: Baseline vs Evaluated Prototype */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Baseline vs Prototype Comparison Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Baseline Model vs Evaluated Prototype (Live Calculated)
              </h3>
              <p className="text-xs text-slate-500">
                Direct benchmark comparison across discrimination and fairness metrics from current synthetic cohort.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
              100% Calculated
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Metric</th>
                  <th className="py-2.5 px-3">Baseline (Fixed)</th>
                  <th className="py-2.5 px-3">Evaluated Prototype</th>
                  <th className="py-2.5 px-3">Net Variance</th>
                  <th className="py-2.5 px-3">Regulatory Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Overall Accuracy</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{(baselineMetrics.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(prototypeMetrics.accuracy * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    {((prototypeMetrics.accuracy - baselineMetrics.accuracy) * 100) >= 0 ? '+' : ''}
                    {((prototypeMetrics.accuracy - baselineMetrics.accuracy) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">Standard Tier-1 Performance</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Precision (PPV)</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{(baselineMetrics.precision * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(prototypeMetrics.precision * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">
                    {((prototypeMetrics.precision - baselineMetrics.precision) * 100) >= 0 ? '+' : ''}
                    {((prototypeMetrics.precision - baselineMetrics.precision) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">Flag purity</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Recall / Equal Opportunity (TPR)</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{(baselineMetrics.recall * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(prototypeMetrics.recall * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">
                    {((prototypeMetrics.recall - baselineMetrics.recall) * 100) >= 0 ? '+' : ''}
                    {((prototypeMetrics.recall - baselineMetrics.recall) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">Fraud prevention rate</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">False Positive Rate (FPR)</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{(baselineMetrics.false_positive_rate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(prototypeMetrics.false_positive_rate * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    {((prototypeMetrics.false_positive_rate - baselineMetrics.false_positive_rate) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Reduced customer friction</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Disparate Impact Ratio</td>
                  <td className="py-2.5 px-3 font-mono text-amber-700 font-bold">{fairnessBaseline.disparate_impact_ratio.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{fairnessPrototype.disparate_impact_ratio.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">
                    +{(fairnessPrototype.disparate_impact_ratio - fairnessBaseline.disparate_impact_ratio).toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">
                    {fairnessPrototype.disparate_impact_ratio >= 0.8 ? 'Complies with 4/5ths Rule' : 'Close to Threshold'}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">False Positive Rate Gap</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{(fairnessBaseline.fpr_gap * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(fairnessPrototype.fpr_gap * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">
                    -{((fairnessBaseline.fpr_gap - fairnessPrototype.fpr_gap) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">Disparity reduction</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Key Finding:</strong> The evaluated prototype achieves equalized odds with an improved Disparate Impact ratio of {fairnessPrototype.disparate_impact_ratio.toFixed(3)} without degrading the overall commercial accuracy.
            </p>
          </div>
        </div>

        {/* High-Risk Findings & Performance Gaps */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>High-Risk Findings & Disparity Gaps</span>
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {performanceGaps.length} Action Items
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Statistically significant performance disparities dynamically detected across proxy cohorts.
            </p>
          </div>

          <div className="space-y-2.5 pt-1 overflow-y-auto max-h-80 custom-scrollbar">
            {performanceGaps.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{item.metric}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.severity === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : item.severity === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.severity} Severity
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-[11px] py-1 border-y border-slate-200/70">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Group A</span>
                    <span className="text-slate-700 font-semibold">{item.baseline}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Group B</span>
                    <span className="text-rose-700 font-bold">{item.measured_result}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Disparity Gap</span>
                    <span className="text-slate-900 font-bold">{item.gap}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Root Cause:</strong> {item.possible_cause}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => onNavigateTab('fairness')}
            className="w-full py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200 flex items-center justify-center gap-1.5"
          >
            <span>Review Full Performance Gaps Table</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Banking Domain Fit: "How can banks introduce fairness monitoring without immediately replacing legacy workflows?" */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0A1629] to-[#0E1E38] text-white rounded-2xl p-6 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/20 text-sky-400 border border-blue-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Architectural Integration Strategy for Tier 1 Banks
              </h3>
              <p className="text-xs text-slate-400">
                How banks introduce continuous fairness & harm monitoring without disrupting core core legacy engines.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 self-start md:self-auto">
            Zero-Disruption Shadow Pattern
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-1.5">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <span>1. Sidecar Shadow-Mode Telemetry</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              The legacy scoring engine processes live transactions as usual, while FairBank AI evaluates decisions asynchronously via an event stream, logging demographic parity metrics without latency impact.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-1.5">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <span>2. Advisory Human-in-the-Loop Routing</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              High-disparity boundary cases (e.g. scores between 0.45 - 0.55 on protected cohorts) are flagged for human review before punitive adverse actions (e.g., account freeze) are executed.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/70 space-y-1.5">
            <span className="font-semibold text-sky-300 flex items-center gap-1.5">
              <span>3. Automated Circuit Breakers</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              If real-time False Positive Rate disparities or population drift exceed regulatory limits, automated guards fallback safely to conservative rules while triggering risk alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Representative Synthetic Banking Data Table Preview */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Representative Synthetic Banking Records (Live Data Explorer)
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                {filteredRecords.length} records matching
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Tabular data with intentionally modeled subgroup disparities. Zero PII collected.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={dataSearchTerm}
                onChange={(e) => {
                  setDataSearchTerm(e.target.value);
                  setPreviewPage(1);
                }}
                placeholder="Search ID, proxy group..."
                className="pl-8 pr-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={dataFilterGroup}
              onChange={(e) => {
                setDataFilterGroup(e.target.value);
                setPreviewPage(1);
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 text-slate-700 font-medium focus:outline-none"
            >
              <option value="All">All Records</option>
              <option value="Group A">Group A (Reference)</option>
              <option value="Group B">Group B (Protected)</option>
              <option value="False Positive">False Positives (Harm)</option>
              <option value="Override">Human Overrides</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Protected Group</th>
                <th className="py-2.5 px-3">Proxy Category</th>
                <th className="py-2.5 px-3">Fraud Prob</th>
                <th className="py-2.5 px-3">Baseline Pred</th>
                <th className="py-2.5 px-3">Actual Truth</th>
                <th className="py-2.5 px-3">Account Action</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">Human Override</th>
                <th className="py-2.5 px-3">Harm Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedRecords.map((row) => (
                <tr key={row.customer_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{row.customer_id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        row.protected_group.includes('Group B')
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {row.protected_group.includes('Group B') ? 'Group B (Protected)' : 'Group A (Ref)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 truncate max-w-[140px]" title={row.proxy_group}>
                    {row.proxy_group}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-800">
                    <span
                      className={`font-bold ${
                        row.fraud_probability > 0.5 ? 'text-rose-700' : 'text-slate-700'
                      }`}
                    >
                      {row.fraud_probability.toFixed(3)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        row.prediction_baseline === 1
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {row.prediction_baseline === 1 ? 'FLAGGED' : 'CLEARED'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">
                    {row.actual_outcome === 1 ? (
                      <span className="text-rose-600 font-bold">1 (Fraud)</span>
                    ) : (
                      <span className="text-slate-500">0 (Clean)</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-medium ${
                        row.account_action === 'Temporary Account Freeze'
                          ? 'text-rose-700 font-bold'
                          : row.account_action === 'Transaction Block'
                          ? 'text-amber-700 font-semibold'
                          : 'text-slate-600'
                      }`}
                    >
                      {row.account_action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{row.queue_wait_time} min</td>
                  <td className="py-2.5 px-3">
                    {row.override_decision !== 'None' ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {row.override_decision}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">None</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {row.false_positive ? (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                        False Positive
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-[10px] font-semibold">Nominal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {(previewPage - 1) * itemsPerPage + 1} to{' '}
            {Math.min(previewPage * itemsPerPage, filteredRecords.length)} of {filteredRecords.length} records
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPreviewPage((p) => Math.max(1, p - 1))}
              disabled={previewPage === 1}
              className="px-2.5 py-1 rounded bg-slate-100 disabled:opacity-40 text-slate-700 hover:bg-slate-200"
            >
              Prev
            </button>
            <span className="px-2 font-mono text-slate-700 font-bold">
              {previewPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => setPreviewPage((p) => Math.min(totalPages, p + 1))}
              disabled={previewPage >= totalPages}
              className="px-2.5 py-1 rounded bg-slate-100 disabled:opacity-40 text-slate-700 hover:bg-slate-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
