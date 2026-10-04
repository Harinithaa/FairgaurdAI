import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Info,
  HelpCircle,
  FileCheck,
  TrendingDown,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  PerformanceGapItem,
  BankingModelTask,
} from '../types';
import { calculateFairnessMetrics } from '../utils/fairnessMetrics';

interface FairnessTabProps {
  dataset: SyntheticBankingRecord[];
  fairnessBaseline: ReturnType<typeof calculateFairnessMetrics>;
  fairnessPrototype: ReturnType<typeof calculateFairnessMetrics>;
  performanceGaps: PerformanceGapItem[];
  selectedTask: BankingModelTask;
}

export const FairnessTab: React.FC<FairnessTabProps> = ({
  dataset,
  fairnessBaseline,
  fairnessPrototype,
  performanceGaps,
  selectedTask,
}) => {
  const [modelMode, setModelMode] = useState<'prototype' | 'baseline'>('prototype');
  const [selectedSubgroupFilter, setSelectedSubgroupFilter] = useState<string>('All');

  // Filter dataset by subgroup if selected
  const activeSubgroupDataset =
    selectedSubgroupFilter === 'All'
      ? dataset
      : dataset.filter(
          (r) =>
            r.protected_group.includes('Group A') ||
            r.proxy_group.toLowerCase().includes(selectedSubgroupFilter.toLowerCase()) ||
            r.group_label.toLowerCase().includes(selectedSubgroupFilter.toLowerCase()),
        );

  const activeFairness =
    selectedSubgroupFilter === 'All'
      ? modelMode === 'prototype'
        ? fairnessPrototype
        : fairnessBaseline
      : calculateFairnessMetrics(
          activeSubgroupDataset,
          modelMode === 'prototype'
            ? (r) => r.prediction_prototype
            : (r) => r.prediction_baseline,
        );

  const subgroupOptions = [
    'All',
    'Young Adults',
    'Minority Proxy Zip',
    'Remittance Corridor',
    'Thin Bureau Credit File',
    'Mobile-Only Digital',
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Regulatory Standards: CFPB Reg B (ECOA) & EU AI Act (Annex III)
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                activeFairness.disparate_impact_ratio >= 0.8
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              Overall Posture: {activeFairness.disparate_impact_ratio >= 0.8 ? 'Compliant' : 'Warning'}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Algorithmic Fairness & Protected Group Disparity Evaluation
          </h2>
          <p className="text-xs text-slate-500">
            Systematic statistical testing for disparate impact, equal opportunity, and false positive disparity across demographic proxy lines.
          </p>
        </div>

        {/* Model Selector Toggle */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold flex items-center">
            <button
              onClick={() => setModelMode('prototype')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                modelMode === 'prototype'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prototype v2.4 (Debiased)
            </button>
            <button
              onClick={() => setModelMode('baseline')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                modelMode === 'baseline'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Baseline v1.0 (Fixed Cutoff)
            </button>
          </div>
        </div>
      </div>

      {/* Subgroup Filter Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Protected Subgroup Slice:</span>
          <div className="flex flex-wrap gap-1">
            {subgroupOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setSelectedSubgroupFilter(opt)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedSubgroupFilter === opt
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          Evaluated Sample: Group A (N={activeFairness.groupA.sample_size}) vs Group B (N={activeFairness.groupB.sample_size})
        </div>
      </div>

      {/* Metric Concept Tooltip Cards (Explain each metric simply) */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">1. Demographic Parity</span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {(activeFairness.demographic_parity_gap * 100).toFixed(1)}% gap
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Difference in positive flag rates between demographic groups, irrespective of ground truth.
          </p>
          <div className="text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            Formula: |P(&Ycirc;=1|A) - P(&Ycirc;=1|B)|
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">2. Equal Opportunity</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {(activeFairness.equal_opportunity_gap * 100).toFixed(1)}% gap
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Difference in True Positive Rates (Recall). True fraudsters are detected with equal probability.
          </p>
          <div className="text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            Formula: |TPR(A) - TPR(B)|
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">3. Disparate Impact</span>
            <span className="text-xs font-mono font-bold text-emerald-700">
              {activeFairness.disparate_impact_ratio.toFixed(3)}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Ratio of favorable clearance rates between protected cohort and reference standard (4/5ths Rule).
          </p>
          <div className="text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            Target: Ratio &ge; 0.800 (CFPB)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">4. FPR Gap (Freeze Harm)</span>
            <span className="text-xs font-mono font-bold text-rose-700">
              {(activeFairness.fpr_gap * 100).toFixed(1)}% gap
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Difference in False Positive Rates; measures unjustified account freeze disparity on clean accounts.
          </p>
          <div className="text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            Formula: |FPR(A) - FPR(B)|
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">5. FNR Gap</span>
            <span className="text-xs font-mono font-bold text-blue-700">
              {(activeFairness.fnr_gap * 100).toFixed(1)}% gap
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Difference in False Negative Rates; measures undetected fraud leakage slipping through defenses.
          </p>
          <div className="text-[10px] font-semibold text-slate-600 pt-1 border-t border-slate-100">
            Formula: |FNR(A) - FNR(B)|
          </div>
        </div>
      </div>

      {/* Main Statutory Fairness Comparison Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Fairness Metric Comparison Table: Group A (Reference) vs Group B (Protected)
            </h3>
            <p className="text-xs text-slate-500">
              Real-time calculation from {activeSubgroupDataset.length} synthetic customer records evaluated under {modelMode === 'prototype' ? 'Prototype Model v2.4' : 'Baseline Model v1.0'}.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
            Regulatory Standard: 4/5ths (80% Disparity Floor)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Metric</th>
                <th className="py-3 px-3">Group A (Majority)</th>
                <th className="py-3 px-3">Group B (Protected)</th>
                <th className="py-3 px-3">Disparity Gap</th>
                <th className="py-3 px-3">Threshold</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Definition & Operational Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeFairness.table.map((row) => (
                <tr key={row.metric} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{row.metric}</td>
                  <td className="py-3 px-3 font-mono font-semibold text-slate-700">{row.groupAVal}</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{row.groupBVal}</td>
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">{row.gapVal}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{row.threshold}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        row.status === 'PASS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : row.status === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {row.status === 'PASS' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                      {row.status === 'WARNING' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
                      {row.status === 'FAIL' && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] leading-relaxed max-w-sm">
                    {row.definition}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dedicated Performance Gaps Section as explicitly required */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Dedicated Performance Gaps Analysis</span>
            </h3>
            <p className="text-xs text-slate-500">
              For every identified issue: Metric, Affected Group, Baseline, Target, Measured Result, Gap, Severity, and Possible Cause.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            {performanceGaps.length} Disparities Documented
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {performanceGaps.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 space-y-3 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Disparity Finding #{idx + 1}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">{item.metric}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    item.severity === 'High'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {item.severity} Severity
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-white rounded-lg border border-slate-200/80 font-mono text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Baseline (A)</span>
                  <span className="text-slate-800 font-semibold">{item.baseline}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Target Standard</span>
                  <span className="text-emerald-700 font-semibold">{item.target}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Measured Result</span>
                  <span className="text-rose-700 font-bold">{item.measured_result}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase font-sans">Measured Gap</span>
                  <span className="text-slate-900 font-bold">{item.gap}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <span>Affected Group:</span>
                  <span className="text-purple-700 font-bold">{item.affected_group}</span>
                </div>
                <div className="text-slate-600 leading-relaxed">
                  <strong className="text-slate-800">Possible Cause:</strong> {item.possible_cause}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
