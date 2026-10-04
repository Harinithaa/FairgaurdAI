import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  ArrowUpRight,
  TrendingUp,
  User,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Check,
  X,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  OverrideMetrics,
} from '../types';

interface OverrideAnalysisTabProps {
  dataset: SyntheticBankingRecord[];
  overrideMetrics: OverrideMetrics;
}

export const OverrideAnalysisTab: React.FC<OverrideAnalysisTabProps> = ({
  dataset,
  overrideMetrics,
}) => {
  const [filterImpact, setFilterImpact] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Filter overrides from dataset
  const overrideRecords = dataset.filter((r) => r.override_decision !== 'None');

  const filteredOverrides = overrideRecords.filter((r) => {
    const matchesImpact =
      filterImpact === 'All' ||
      (filterImpact === 'Approved' && r.override_decision.includes('Approved')) ||
      (filterImpact === 'Denied' && r.override_decision.includes('Denied'));

    const matchesRole =
      roleFilter === 'All' || (r.underwriter_role && r.underwriter_role.includes(roleFilter));

    return matchesImpact && matchesRole;
  });

  const rootCausesSummary = [
    {
      cause: 'Known Cross-Border Remittance Pattern Verified',
      count: 42,
      cohort: 'Group B (Remittance / Diaspora)',
      type: 'Equalizing (Rescued Innocent Customer)',
    },
    {
      cause: 'Alternative Payroll / Rent Payment History Confirmed',
      count: 36,
      cohort: 'Group B (Thin-File / Gig Earners)',
      type: 'Equalizing (Rescued Innocent Customer)',
    },
    {
      cause: 'Biometric Push Verification Completed in Mobile App',
      count: 31,
      cohort: 'Young Adults & Digital-First Accounts',
      type: 'Equalizing (Friction Mitigation)',
    },
    {
      cause: 'Longstanding Private Banking Customer Relationship',
      count: 28,
      cohort: 'Group A (Affluent / Established)',
      type: 'Disparity Risk (VIP Privilege Bias)',
    },
    {
      cause: 'Manual Check Detected Rapid-Fire POS Fraud Anomaly',
      count: 19,
      cohort: 'All Cohorts',
      type: 'Protection (Blocked Hidden Fraud)',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Human-in-the-Loop (HITL) Supervisory Governance
            </span>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                overrideMetrics.impact_verdict === 'Reduced Disparity'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              Fairness Impact: {overrideMetrics.impact_verdict}
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Human-in-the-Loop Override & Discretionary Impact Telemetry
          </h2>
          <p className="text-xs text-slate-500">
            Monitoring underwriter manual overrides to audit whether human intervention corrects algorithmic bias or introduces discretionary disparities.
          </p>
        </div>

        {/* Filter Pill Box */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
          {['All', 'Approved', 'Denied'].map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterImpact(filter)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterImpact === filter
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* HITL Executive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Overrides & Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Override Rate
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {overrideMetrics.override_rate}%
          </div>
          <span className="text-[10px] text-slate-500">
            {overrideMetrics.total_overrides} of {overrideMetrics.total_evaluations} decisions audited
          </span>
        </div>

        {/* Card 2: Group-Level Frequency */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Group Frequency Split
          </span>
          <div className="text-2xl font-bold text-blue-700 font-mono">
            {overrideMetrics.group_b_override_rate}% <span className="text-xs font-normal text-slate-500 font-sans">B vs</span> {overrideMetrics.group_a_override_rate}% <span className="text-xs font-normal text-slate-500 font-sans">(A)</span>
          </div>
          <span className="text-[10px] text-slate-500">
            Group B receives higher human review rate
          </span>
        </div>

        {/* Card 3: Upgraded (Denied -> Approved) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Rescued Innocents (Upgraded)
          </span>
          <div className="text-2xl font-bold text-emerald-700 font-mono">
            {overrideMetrics.upgraded_count}
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">
            Overruled AI freeze &rarr; Restored account access
          </span>
        </div>

        {/* Card 4: Downgraded (Approved -> Denied) */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Fraud Interceptions (Downgraded)
          </span>
          <div className="text-2xl font-bold text-amber-700 font-mono">
            {overrideMetrics.downgraded_count}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">
            Caught subtle fraud missed by baseline AI
          </span>
        </div>
      </div>

      {/* Critical Core Analysis: Did Human Overrides Reduce or Increase Fairness Disparity? */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Did Human Intervention REDUCE or INCREASE Fairness Disparity?</span>
            </h3>
            <p className="text-xs text-slate-500">
              Comparing disparity metrics on pure AI predictions vs final Human+AI combined portfolio decisions.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              overrideMetrics.impact_verdict === 'Reduced Disparity'
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Audit Finding: {overrideMetrics.impact_verdict}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* AI-Only Baseline */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700">Pure Algorithmic Decisions (Pre-Human)</span>
              <span className="font-mono text-slate-500">AI-Only Output</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Disparate Impact:</span>
                <span className="text-xl font-bold text-slate-800">
                  {overrideMetrics.disparate_impact_before.toFixed(3)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">FPR Gap:</span>
                <span className="text-xl font-bold text-rose-700">
                  {(overrideMetrics.fpr_gap_before * 100).toFixed(1)}%
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">
              The pure ML model over-flagged volatile gig income and cross-border remittance patterns.
            </p>
          </div>

          {/* Combined AI + Human Portfolio */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-emerald-900">Final Human + AI Portfolio (Post-Override)</span>
              <span className="font-mono font-bold text-emerald-700">Official Audited Result</span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
              <div>
                <span className="text-[10px] text-emerald-700 block font-sans">Disparate Impact:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-emerald-900">
                    {overrideMetrics.disparate_impact_after.toFixed(3)}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    (+{(overrideMetrics.disparate_impact_after - overrideMetrics.disparate_impact_before).toFixed(3)})
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 block font-sans">FPR Gap:</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-emerald-900">
                    {(overrideMetrics.fpr_gap_after * 100).toFixed(1)}%
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    ({((overrideMetrics.fpr_gap_after - overrideMetrics.fpr_gap_before) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-emerald-800">
              Manual reviews of verified payroll transcripts and biometric in-app challenges successfully equalized false positive disparities.
            </p>
          </div>
        </div>
      </div>

      {/* Root Causes for Overrides Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Root Causes for Human Underwriter Overrides
          </h3>
          <p className="text-xs text-slate-500">
            Categorized rationales documented by bank officers when overturning model predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {rootCausesSummary.map((rc, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-blue-700">#{idx + 1}</span>
                <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {rc.count} Overrides
                </span>
              </div>
              <h4 className="font-bold text-slate-800">{rc.cause}</h4>
              <div className="text-[11px] text-slate-500">
                Primary Cohort: <strong className="text-slate-700">{rc.cohort}</strong>
              </div>
              <div className="pt-1 border-t border-slate-200 text-[10px] font-semibold text-emerald-700">
                {rc.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audited Override Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Sample Audited Override Records ({filteredOverrides.length} items)
            </h3>
            <p className="text-xs text-slate-500">
              Immutable log with decision justifications and supervisory roles.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Customer ID</th>
                <th className="py-2.5 px-3">Protected Group</th>
                <th className="py-2.5 px-3">AI Pred</th>
                <th className="py-2.5 px-3">Human Override</th>
                <th className="py-2.5 px-3">Underwriter Role</th>
                <th className="py-2.5 px-3">Justification Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOverrides.slice(0, 8).map((ovr) => (
                <tr key={ovr.customer_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{ovr.customer_id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ovr.protected_group.includes('Group B')
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {ovr.protected_group.includes('Group B') ? 'Group B' : 'Group A'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {ovr.prediction_baseline === 1 ? 'FLAGGED (FRAUD)' : 'CLEARED'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ovr.override_decision.includes('Approved')
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {ovr.override_decision}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">{ovr.underwriter_role || 'Fraud Risk Officer'}</td>
                  <td className="py-2.5 px-3 text-slate-600 max-w-sm truncate" title={ovr.override_reason}>
                    {ovr.override_reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
