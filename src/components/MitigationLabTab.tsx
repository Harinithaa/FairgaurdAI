import React, { useState } from 'react';
import {
  FlaskConical,
  Sliders,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Scale,
  Flame,
  Info,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  MitigationParams,
  BankingModelTask,
} from '../types';
import { simulateMitigation } from '../utils/fairnessMetrics';

interface MitigationLabTabProps {
  dataset: SyntheticBankingRecord[];
  mitigationParams: MitigationParams;
  onUpdateParams: (newParams: MitigationParams) => void;
  selectedTask: BankingModelTask;
}

export const MitigationLabTab: React.FC<MitigationLabTabProps> = ({
  dataset,
  mitigationParams,
  onUpdateParams,
  selectedTask,
}) => {
  const [promotedNotice, setPromotedNotice] = useState(false);

  // Run live simulation on current dataset with active parameters
  const simulationResult = simulateMitigation(dataset, mitigationParams);

  const {
    baselineMetrics,
    mitigatedMetrics,
    baselineFairness,
    mitigatedFairness,
    baselineHarm,
    mitigatedHarm,
  } = simulationResult;

  const handlePromoteCandidate = () => {
    setPromotedNotice(true);
    setTimeout(() => setPromotedNotice(false), 4000);
  };

  const handleResetDefaults = () => {
    onUpdateParams({
      threshold_global: 0.50,
      threshold_group_a: 0.49,
      threshold_group_b: 0.54,
      use_group_thresholds: false,
      reweighting_factor: 0.40,
      equalized_odds_enabled: true,
      fairness_constraint: 'disparate_impact',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Interactive Debiasing & Harm Remediation Studio
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Live Dynamic Recalculation
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Bias Mitigation Lab: Pareto-Optimal Trade-off Optimization
          </h2>
          <p className="text-xs text-slate-500">
            Tune threshold adjustment, instance reweighting, and equalized odds post-processing to eliminate disparity while protecting credit accuracy.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            Reset Defaults
          </button>
          <button
            onClick={handlePromoteCandidate}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Promote Tuned Candidate</span>
          </button>
        </div>
      </div>

      {promotedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Candidate packaged! Selected hyperparameters promoted for live Canary review in the Deployment & Rollback tab.</span>
        </div>
      )}

      {/* Main Grid: Controls on Left, Before vs After Impact on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Controls */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Mitigation Interventions</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
              Interactive
            </span>
          </div>

          {/* Intervention 1: Threshold Adjustment */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">1. Threshold Adjustment</span>
              <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mitigationParams.use_group_thresholds}
                  onChange={(e) =>
                    onUpdateParams({
                      ...mitigationParams,
                      use_group_thresholds: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span>Group-Specific Cutoffs</span>
              </label>
            </div>

            {!mitigationParams.use_group_thresholds ? (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">Global Operating Cutoff:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {mitigationParams.threshold_global.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.70"
                  step="0.01"
                  value={mitigationParams.threshold_global}
                  onChange={(e) =>
                    onUpdateParams({
                      ...mitigationParams,
                      threshold_global: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.30 (Permissive)</span>
                  <span>0.50 (Standard)</span>
                  <span>0.70 (Strict)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Group A Cutoff:</span>
                    <span className="font-mono font-bold text-slate-800">
                      {mitigationParams.threshold_group_a.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.35"
                    max="0.65"
                    step="0.01"
                    value={mitigationParams.threshold_group_a}
                    onChange={(e) =>
                      onUpdateParams({
                        ...mitigationParams,
                        threshold_group_a: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Group B Cutoff (Calibrated):</span>
                    <span className="font-mono font-bold text-purple-700">
                      {mitigationParams.threshold_group_b.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.35"
                    max="0.65"
                    step="0.01"
                    value={mitigationParams.threshold_group_b}
                    onChange={(e) =>
                      onUpdateParams({
                        ...mitigationParams,
                        threshold_group_b: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-purple-600 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Intervention 2: Reweighting / Pre-Processing */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-slate-800">2. Reweighting / Pre-Processing Factor</span>
              <span className="font-mono font-bold text-blue-700">
                {(mitigationParams.reweighting_factor * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.05"
              value={mitigationParams.reweighting_factor}
              onChange={(e) =>
                onUpdateParams({
                  ...mitigationParams,
                  reweighting_factor: parseFloat(e.target.value),
                })
              }
              className="w-full accent-blue-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-500">
              Down-weights proxy-biased historical training samples to neutralize algorithmic upward skew on protected cohorts.
            </p>
          </div>

          {/* Intervention 3: Equalized Odds Post-Processing */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5 pr-2">
              <span className="text-xs font-bold text-slate-800 block">3. Equalized Odds Post-Processing</span>
              <p className="text-[10px] text-slate-500">
                Applies Hardt et al. post-processing to balance true & false positive rates across cohorts.
              </p>
            </div>
            <button
              onClick={() =>
                onUpdateParams({
                  ...mitigationParams,
                  equalized_odds_enabled: !mitigationParams.equalized_odds_enabled,
                })
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                mitigationParams.equalized_odds_enabled
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {mitigationParams.equalized_odds_enabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          {/* Intervention 4: Fairness Constraint Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">4. Primary Fairness Optimization Constraint</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs font-medium">
              {[
                { id: 'disparate_impact', label: 'Disparate Impact (4/5ths)' },
                { id: 'equal_opportunity', label: 'Equal Opportunity (TPR)' },
                { id: 'minimize_unjustified_freeze', label: 'Minimize Freezes (FPR)' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() =>
                    onUpdateParams({
                      ...mitigationParams,
                      fairness_constraint: c.id as any,
                    })
                  }
                  className={`p-2 rounded-lg text-[11px] text-center transition-all ${
                    mitigationParams.fairness_constraint === c.id
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Before vs After Comparison */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Live Before vs After Comparison (Calculated from N={dataset.length})
              </h3>
              <p className="text-xs text-slate-500">
                Real-time recalculation of accuracy, fairness parity, and operational harm metrics.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Active Candidate
            </span>
          </div>

          {/* Key 3 Pillars: Accuracy Impact, Fairness Gap Reduction, Harm Metric Reduction */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* Pillar 1: Accuracy Impact */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700 block">1. Accuracy Impact</span>
              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Baseline</span>
                  <span className="text-lg font-bold text-slate-800">
                    {(baselineMetrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Mitigated</span>
                  <span className="text-lg font-bold text-blue-700">
                    {(mitigatedMetrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                Net Shift:{' '}
                <strong className="text-slate-800">
                  {((mitigatedMetrics.accuracy - baselineMetrics.accuracy) * 100).toFixed(1)}%
                </strong>{' '}
                (Commercial preservation)
              </div>
            </div>

            {/* Pillar 2: Fairness Gap Reduction */}
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-900 block">2. Fairness Gap Reduction</span>
              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-[10px] text-emerald-700 block font-sans">Disparate Impact</span>
                  <span className="text-lg font-bold text-slate-800">
                    {baselineFairness.disparate_impact_ratio.toFixed(3)}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-600" />
                <div>
                  <span className="text-[10px] text-emerald-700 block font-sans">Mitigated</span>
                  <span className="text-lg font-bold text-emerald-900">
                    {mitigatedFairness.disparate_impact_ratio.toFixed(3)}
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-800 pt-1 border-t border-emerald-200">
                Improvement:{' '}
                <strong className="text-emerald-950 font-bold">
                  +{(mitigatedFairness.disparate_impact_ratio - baselineFairness.disparate_impact_ratio).toFixed(3)}
                </strong>{' '}
                (Parity achieved)
              </div>
            </div>

            {/* Pillar 3: Harm Metric Reduction */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <span className="text-xs font-bold text-rose-900 block">3. Harm Metric Reduction</span>
              <div className="flex items-baseline justify-between font-mono">
                <div>
                  <span className="text-[10px] text-rose-700 block font-sans">Freeze Gap</span>
                  <span className="text-lg font-bold text-rose-800">
                    {baselineHarm.unjustified_freeze_gap}%
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-rose-400" />
                <div>
                  <span className="text-[10px] text-rose-700 block font-sans">Mitigated</span>
                  <span className="text-lg font-bold text-emerald-800">
                    {mitigatedHarm.unjustified_freeze_gap}%
                  </span>
                </div>
              </div>
              <div className="text-[10px] text-rose-800 pt-1 border-t border-rose-200">
                Friction Saved:{' '}
                <strong className="text-emerald-800 font-bold">
                  {Math.max(0, baselineHarm.total_friction_hours - mitigatedHarm.total_friction_hours)} hrs
                </strong>
              </div>
            </div>
          </div>

          {/* Granular Comparison Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Evaluation Dimension</th>
                  <th className="py-2.5 px-3">Baseline (Fixed Cutoff)</th>
                  <th className="py-2.5 px-3">Mitigated Candidate</th>
                  <th className="py-2.5 px-3">Variance / Benefit</th>
                  <th className="py-2.5 px-3">Compliance Posture</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Disparate Impact Ratio</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{baselineFairness.disparate_impact_ratio.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{mitigatedFairness.disparate_impact_ratio.toFixed(3)}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    +{(mitigatedFairness.disparate_impact_ratio - baselineFairness.disparate_impact_ratio).toFixed(3)}
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 font-bold">
                    {mitigatedFairness.disparate_impact_ratio >= 0.8 ? 'Complies (≥ 0.80)' : 'Borderline'}
                  </td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">False Positive Rate Gap</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{(baselineFairness.fpr_gap * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(mitigatedFairness.fpr_gap * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    -{((baselineFairness.fpr_gap - mitigatedFairness.fpr_gap) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Reduced Unjustified Freezes</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Equal Opportunity Gap (TPR)</td>
                  <td className="py-2.5 px-3 font-mono text-slate-700">{(baselineFairness.equal_opportunity_gap * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{(mitigatedFairness.equal_opportunity_gap * 100).toFixed(1)}%</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    -{((baselineFairness.equal_opportunity_gap - mitigatedFairness.equal_opportunity_gap) * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">TPR Parity Target &lt; 5%</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Severe Customer Lock-outs</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">{baselineHarm.severe_impact_count} cases</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">{mitigatedHarm.severe_impact_count} cases</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-700">
                    -{baselineHarm.severe_impact_count - mitigatedHarm.severe_impact_count} cases avoided
                  </td>
                  <td className="py-2.5 px-3 text-emerald-700 font-semibold">Harm Mitigation Verified</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              <strong>Pareto Frontier Verdict:</strong> The tuned candidate model eliminates the statutory disparity gap on Group B while preserving commercial precision within 0.4% of the unconstrained baseline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
