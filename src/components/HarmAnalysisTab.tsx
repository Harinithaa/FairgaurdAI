import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Info,
  DollarSign,
  Clock,
  UserX,
  CreditCard,
  PhoneCall,
  Search,
  Sliders,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  HarmEvaluationMetrics,
  BankingModelTask,
} from '../types';

interface HarmAnalysisTabProps {
  dataset: SyntheticBankingRecord[];
  harmMetrics: HarmEvaluationMetrics;
  selectedTask: BankingModelTask;
}

export const HarmAnalysisTab: React.FC<HarmAnalysisTabProps> = ({
  dataset,
  harmMetrics,
  selectedTask,
}) => {
  const [isRunningStressTest, setIsRunningStressTest] = useState(false);
  const [stressTested, setStressTested] = useState(false);
  const [activeHarmFilter, setActiveHarmFilter] = useState<'All' | 'Severe' | 'Freeze' | 'Redress'>('All');

  const runAdversarialTest = () => {
    setIsRunningStressTest(true);
    setTimeout(() => {
      setIsRunningStressTest(false);
      setStressTested(true);
    }, 1200);
  };

  // Harm cases from synthetic dataset
  const harmCases = dataset.filter((r) => {
    if (activeHarmFilter === 'Severe') return r.severe_impact;
    if (activeHarmFilter === 'Freeze') return r.account_action === 'Temporary Account Freeze';
    if (activeHarmFilter === 'Redress') return r.redress_eligible;
    return r.false_positive || r.severe_impact || r.queue_wait_time > 20;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
              Operational Harm & Customer Friction Vector
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Composite Friction Index: {harmMetrics.operational_friction_index} / 100
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Operational Harm, Account Freezing & Queue Wait Time Disparity
          </h2>
          <p className="text-xs text-slate-500">
            Measuring real downstream human impact: unjustified fraud freezes, financial lock-out, and customer service deprioritisation.
          </p>
        </div>

        <button
          onClick={runAdversarialTest}
          disabled={isRunningStressTest}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 transition-colors shadow-xs flex items-center gap-2 self-start md:self-auto"
        >
          {isRunningStressTest ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              <span>Simulating High-Friction Surge...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Simulate Peak Stress Load</span>
            </>
          )}
        </button>
      </div>

      {/* Primary Harm Evaluation Metrics Grid (As requested by user) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {/* Metric 1: Unjustified Freeze Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Unjustified Freeze Rate</span>
            <UserX className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-rose-700 font-mono">
              {harmMetrics.unjustified_freeze_rate_group_b}%
            </span>
            <span className="text-xs font-bold text-rose-600 font-mono">
              vs {harmMetrics.unjustified_freeze_rate_group_a}% (A)
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Disparity Gap: <strong className="text-rose-700">+{harmMetrics.unjustified_freeze_gap}%</strong> on Group B
          </p>
        </div>

        {/* Metric 2: Average Friction Hours */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Friction Hours</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {harmMetrics.avg_friction_hours_group_b} hrs
            </span>
            <span className="text-xs font-mono text-slate-500">
              vs {harmMetrics.avg_friction_hours_group_a} hrs (A)
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            Total Hours Lost: <strong className="text-slate-800">{harmMetrics.total_friction_hours} hrs</strong>
          </p>
        </div>

        {/* Metric 3: Queue Wait Time Disparity */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Wait Time Disparity</span>
            <PhoneCall className="w-4 h-4 text-purple-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-purple-700 font-mono">
              +{harmMetrics.wait_time_disparity_minutes} min
            </span>
            <span className="text-[10px] font-bold text-purple-600">Delay</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Group B Avg: {harmMetrics.avg_wait_time_group_b}m vs A: {harmMetrics.avg_wait_time_group_a}m
          </p>
        </div>

        {/* Metric 4: Severe Impact Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Severe Impact Count</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-slate-900 font-mono">
              {harmMetrics.severe_impact_count}
            </span>
            <span className="text-[10px] font-bold text-rose-600">Critical files</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Acute financial lockout or essential bill failure
          </p>
        </div>

        {/* Metric 5: Redress Eligibility Count */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-bold uppercase tracking-wider">Redress Eligible</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-emerald-700 font-mono">
              {harmMetrics.redress_eligibility_count}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">Restitution</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Automated customer fee refund qualified
          </p>
        </div>
      </div>

      {/* Asymmetric Harm Analysis: Fraud Freeze vs Support Deprioritisation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Account Freezing Harm Analysis */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
              <CreditCard className="w-4 h-4" />
              <span>1. Account Freezing & Financial Lock-out Harm</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
              Severity: High
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When an ML model falsely flags legitimate transactions on lower-income or immigrant accounts as fraud,
            the bank triggers a <strong>Temporary Account Freeze</strong>. Unlike affluent customers who reach a dedicated private banker,
            protected cohort members suffer multi-day card locks, inability to pay rent, and overdraft penalties.
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Group B Freeze Incident Rate:</span>
              <span className="font-mono font-bold text-rose-700">{harmMetrics.unjustified_freeze_rate_group_b}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Group A Reference Freeze Rate:</span>
              <span className="font-mono font-semibold text-slate-800">{harmMetrics.unjustified_freeze_rate_group_a}%</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-semibold">
              <span className="text-slate-700">Disproportionate Freezing Gap:</span>
              <span className="font-mono text-rose-700">+{harmMetrics.unjustified_freeze_gap}% elevated risk</span>
            </div>
          </div>
        </div>

        {/* Card 2: Customer Service Routing & Wait Time Disparity */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <PhoneCall className="w-4 h-4" />
              <span>2. Customer Service Deprioritisation Harm</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
              Severity: Medium
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Rule-based routing algorithms prioritize inbound support based on account balance and lifetime value.
            Consequently, young adults and protected demographic proxies experience substantial queue wait times when attempting to resolve fraud false-positives.
          </p>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Group B Mean Support Wait:</span>
              <span className="font-mono font-bold text-purple-700">{harmMetrics.avg_wait_time_group_b} minutes</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Group A (VIP Expedited):</span>
              <span className="font-mono font-semibold text-slate-800">{harmMetrics.avg_wait_time_group_a} minutes</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200 font-semibold">
              <span className="text-slate-700">Queue Latency Penalty:</span>
              <span className="font-mono text-purple-700">+{harmMetrics.wait_time_disparity_minutes} mins delay</span>
            </div>
          </div>
        </div>
      </div>

      {/* Audited Harm Incidents Explorer */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Audited Customer Harm Incidents ({harmCases.length} records)
            </h3>
            <p className="text-xs text-slate-500">
              Live case records flagged for unjustified account freeze, severe friction hours, or redress eligibility.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs">
            {[
              { id: 'All', label: 'All Incidents' },
              { id: 'Severe', label: 'Severe Impact' },
              { id: 'Freeze', label: 'Account Freezes' },
              { id: 'Redress', label: 'Redress Eligible' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveHarmFilter(f.id as any)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  activeHarmFilter === f.id
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Protected Group</th>
                <th className="py-2.5 px-3">Proxy Category</th>
                <th className="py-2.5 px-3">Account Action</th>
                <th className="py-2.5 px-3">Friction Hours</th>
                <th className="py-2.5 px-3">Wait Time</th>
                <th className="py-2.5 px-3">Severe Harm</th>
                <th className="py-2.5 px-3">Redress Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {harmCases.slice(0, 8).map((c) => (
                <tr key={c.customer_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{c.customer_id}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.protected_group.includes('Group B')
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {c.protected_group.includes('Group B') ? 'Group B (Protected)' : 'Group A (Ref)'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{c.proxy_group}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.account_action === 'Temporary Account Freeze'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {c.account_action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{c.friction_hours} hrs</td>
                  <td className="py-2.5 px-3 font-mono text-slate-600">{c.queue_wait_time} min</td>
                  <td className="py-2.5 px-3">
                    {c.severe_impact ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        Severe Lockout
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Moderate</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    {c.redress_eligible ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Fee Waiver & Apology Credit
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">Standard Handling</span>
                    )}
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
