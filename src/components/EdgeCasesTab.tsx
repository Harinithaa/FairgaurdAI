import React, { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
  FileSearch,
  CheckCircle2,
  Shield,
  ArrowRight,
  HelpCircle,
  Clock,
  UserCheck,
  Zap,
  RotateCcw,
  Sliders,
  DollarSign,
  Activity,
  Layers,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  BankingModelTask,
} from '../types';

interface EdgeCasesTabProps {
  dataset: SyntheticBankingRecord[];
  selectedTask: BankingModelTask;
}

export const EdgeCasesTab: React.FC<EdgeCasesTabProps> = ({
  dataset,
  selectedTask,
}) => {
  const [activeStressScenario, setActiveStressScenario] = useState<
    'boundary' | 'low_volume' | 'high_stakes' | 'queue_surge'
  >('boundary');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Dynamic filtering of edge cases based on scenario
  let stressCases = dataset.filter((r) => {
    if (activeStressScenario === 'boundary') {
      return r.fraud_probability >= 0.45 && r.fraud_probability <= 0.55;
    } else if (activeStressScenario === 'low_volume') {
      return (
        r.proxy_group.includes('Thin') ||
        r.proxy_group.includes('Remittance') ||
        r.proxy_group.includes('Gig')
      );
    } else if (activeStressScenario === 'high_stakes') {
      return (
        (r.transaction_amount && r.transaction_amount > 1200) ||
        r.severe_impact ||
        r.account_action === 'Temporary Account Freeze'
      );
    } else {
      // queue_surge
      return r.queue_wait_time > 22;
    }
  });

  if (stressCases.length === 0) stressCases = dataset.slice(0, 10);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    stressCases[0]?.customer_id || dataset[0]?.customer_id,
  );

  const selectedCase =
    dataset.find((r) => r.customer_id === selectedCaseId) || stressCases[0] || dataset[0];

  const handleAction = (status: string) => {
    setActionNotice(`Case ${selectedCase.customer_id}: ${status}`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              Boundary Risk, Stress Testing & Digital Trust Sentinel
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {stressCases.length} Boundary Cases Isolated
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Edge Case Analysis, Counterfactuals & Adversarial Stress Testing
          </h2>
          <p className="text-xs text-slate-500">
            Evaluating model stability under extreme scenarios: boundary probabilities, low-volume proxy cohorts, high-stakes transfers, and queue surges.
          </p>
        </div>

        {actionNotice && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* 4 Dedicated Stress Scenarios Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {[
          {
            id: 'boundary',
            title: '1. Boundary Probability Cases',
            desc: 'Near-threshold scores (0.45 – 0.55)',
            icon: Sliders,
            badge: 'Uncertainty Band',
          },
          {
            id: 'low_volume',
            title: '2. Low-Volume Proxy Groups',
            desc: 'Remittance corridors & thin-file accounts',
            icon: Layers,
            badge: 'Representation Bias',
          },
          {
            id: 'high_stakes',
            title: '3. High-Stakes Transfers',
            desc: 'Large transactions & emergency cash flows',
            icon: DollarSign,
            badge: 'Acute Financial Harm',
          },
          {
            id: 'queue_surge',
            title: '4. Extreme Queue Congestion',
            desc: 'Simulating 3x customer support load',
            icon: Clock,
            badge: 'Drop-off Vulnerability',
          },
        ].map((scenario) => {
          const Icon = scenario.icon;
          const isActive = activeStressScenario === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => {
                setActiveStressScenario(scenario.id as any);
              }}
              className={`p-4 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-blue-50/70 border-blue-500 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {scenario.badge}
                </span>
              </div>
              <h4 className="font-bold text-xs text-slate-900 mt-2">{scenario.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">{scenario.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Grid: Case List vs Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Edge Case List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Flagged Cases ({stressCases.length} records)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Select case to audit</span>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-y-auto custom-scrollbar pr-1">
            {stressCases.slice(0, 15).map((item) => {
              const isSelected = selectedCase?.customer_id === item.customer_id;

              return (
                <div
                  key={item.customer_id}
                  onClick={() => setSelectedCaseId(item.customer_id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-500 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {item.customer_id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.protected_group.includes('Group B')
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.protected_group.includes('Group B') ? 'Group B' : 'Group A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mt-1.5">
                    <span className="text-slate-700 font-medium truncate max-w-[180px]">
                      {item.proxy_group}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      Prob: {item.fraud_probability.toFixed(3)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-500">
                    <span>
                      Action: <strong className={item.account_action === 'Temporary Account Freeze' ? 'text-rose-700' : 'text-slate-700'}>{item.account_action}</strong>
                    </span>
                    <span>
                      Wait: <strong className="font-mono text-slate-800">{item.queue_wait_time}m</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Case Inspector & Counterfactual Engine */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex items-start justify-between border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-blue-700">
                  {selectedCase.customer_id}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                  {selectedCase.proxy_group}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Protected Cohort: <strong className="text-slate-800">{selectedCase.protected_group}</strong> ({selectedCase.group_label})
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-sans">Fraud Probability Score</span>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {selectedCase.fraud_probability.toFixed(3)}
                <span className="text-xs text-slate-400 font-sans font-normal ml-1">
                  (Cutoff: 0.500)
                </span>
              </div>
            </div>
          </div>

          {/* Account Profile Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-sans">Account Tenure</span>
              <span className="text-slate-800 font-semibold">{selectedCase.account_tenure_months} months</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-sans">Monthly Inflow</span>
              <span className="text-slate-800 font-semibold">${selectedCase.monthly_inflow.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-sans">Action Triggered</span>
              <span className="text-rose-700 font-bold">{selectedCase.account_action}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-sans">Friction / Lockout</span>
              <span className="text-slate-900 font-bold">{selectedCase.friction_hours} hrs</span>
            </div>
          </div>

          {/* Counterfactual "What-If" Recourse Engine (FCRA / CFPB Compliance) */}
          <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Counterfactual Recourse & Actionable Explanation (FCRA Section 615a)</span>
            </div>
            <p className="text-blue-950 leading-relaxed text-[11px]">
              {selectedCase.false_positive ? (
                <span>
                  <strong>What-If Recourse:</strong> If the applicant completes an instant mobile push biometric challenge or provides secondary proof of recurrent payroll, the fraud probability score drops from{' '}
                  <strong>{selectedCase.fraud_probability.toFixed(3)}</strong> to <strong>{(selectedCase.fraud_probability * 0.42).toFixed(3)}</strong>, instantly lifting the account freeze.
                </span>
              ) : (
                <span>
                  <strong>Adverse Action Explanation:</strong> Transaction flagged due to atypical foreign remittance frequency exceeding baseline deviation velocity. Account tenure of {selectedCase.account_tenure_months} months provided insufficient historical clearing baseline.
                </span>
              )}
            </p>
            <div className="text-[10px] text-blue-700 font-mono pt-1">
              Regulatory standard: Consumer Financial Protection Bureau (CFPB) adverse action specificity requirement.
            </div>
          </div>

          {/* Supervisory Governance & Remediation Actions */}
          <div className="pt-2 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">Supervisory Action Sign-Off</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleAction('Account freeze lifted via biometric callback validation')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Lift Freeze & Issue Redress Waiver</span>
              </button>

              <button
                onClick={() => handleAction('Routed to Tier 2 Fraud Risk Investigator')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-300 transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Escalate to Senior Fraud Lead</span>
              </button>

              <button
                onClick={() => handleAction('Temporary 30-day remittance corridor exemption logged')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Log 30-Day Corridor Exemption</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
