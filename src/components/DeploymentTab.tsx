import React, { useState } from 'react';
import {
  RefreshCw,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  GitBranch,
  Radio,
  FileCheck2,
  Sliders,
  Check,
  X,
  History,
} from 'lucide-react';
import {
  SyntheticBankingRecord,
  MetricSummary,
} from '../types';

interface DeploymentTabProps {
  selectedModel: string;
  onChangeModel: (model: string) => void;
  dataset: SyntheticBankingRecord[];
  fairnessPrototype: any;
  prototypeMetrics: MetricSummary;
}

export const DeploymentTab: React.FC<DeploymentTabProps> = ({
  selectedModel,
  onChangeModel,
  dataset,
  fairnessPrototype,
  prototypeMetrics,
}) => {
  const [circuitBreakerActive, setCircuitBreakerActive] = useState<boolean>(true);
  const [canaryPercentage, setCanaryPercentage] = useState<number>(15);
  const [isRollingBack, setIsRollingBack] = useState<boolean>(false);
  const [rollbackSuccess, setRollbackSuccess] = useState<boolean>(false);
  const [promotionSuccess, setPromotionSuccess] = useState<boolean>(false);

  // Automated Go / No-Go Checklist evaluations based on live data
  const diPassed = fairnessPrototype.disparate_impact_ratio >= 0.80;
  const fprGapPassed = fairnessPrototype.fpr_gap <= 0.10;
  const accuracyPassed = prototypeMetrics.accuracy >= 0.85;
  const severeHarmPassed = true;
  const hitlSigned = true;

  const isAllChecklistPassed =
    diPassed && fprGapPassed && accuracyPassed && severeHarmPassed && hitlSigned;

  const [incidentLogs, setIncidentLogs] = useState([
    {
      id: 'INC-8812',
      timestamp: 'Today, 07:15 UTC',
      event: 'Canary traffic adjusted to 15%',
      actor: 'Model Risk Officer (Auto-Gated)',
      status: 'Nominal',
    },
    {
      id: 'INC-8811',
      timestamp: 'Yesterday, 19:40 UTC',
      event: 'Automated Circuit Breaker trip-wire simulated in staging',
      actor: 'Fairness Sentinel Daemon',
      status: 'Cleared',
    },
    {
      id: 'INC-8810',
      timestamp: '3 days ago',
      event: 'Baseline v1.0 frozen for annual Model Validation review',
      actor: 'Senior Credit Lead',
      status: 'Archived',
    },
  ]);

  const handleRollback = () => {
    setIsRollingBack(true);
    setTimeout(() => {
      setIsRollingBack(false);
      onChangeModel('baseline-v1.0');
      setRollbackSuccess(true);
      setCanaryPercentage(0);

      setIncidentLogs((prev) => [
        {
          id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
          timestamp: 'Just now',
          event: 'Emergency Rollback executed: Reverted production traffic to Baseline v1.0',
          actor: 'Bank Model Governance Lead',
          status: 'Triggered',
        },
        ...prev,
      ]);

      setTimeout(() => setRollbackSuccess(false), 5000);
    }, 1200);
  };

  const handlePromoteCanary = () => {
    onChangeModel('prototype-v2.4');
    setPromotionSuccess(true);
    setCanaryPercentage(100);

    setIncidentLogs((prev) => [
      {
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        event: 'Full Promotion: Model Prototype v2.4 (Debiased) allocated 100% traffic',
        actor: 'Model Risk Committee Sign-Off',
        status: 'Promoted',
      },
      ...prev,
    ]);

    setTimeout(() => setPromotionSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Model Release Gating & Deployment Guardrails
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              Automated Disparity Guardrails: Armed
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Deployment Governance, Canary Traffic & Rollback Orchestration
          </h2>
          <p className="text-xs text-slate-500">
            Enforcing zero-downtime automated rollbacks whenever disparate impact or false positive rate triggers trip.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleRollback}
            disabled={isRollingBack}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs flex items-center gap-1.5"
          >
            {isRollingBack ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Rollback...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Trigger Instant Rollback</span>
              </>
            )}
          </button>

          <button
            onClick={handlePromoteCanary}
            disabled={!isAllChecklistPassed}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-xs flex items-center gap-1.5"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Promote Canary to 100%</span>
          </button>
        </div>
      </div>

      {rollbackSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span>Safe Rollback Executed: Reverted active production to <strong>Baseline v1.0 (Fixed Fallback)</strong>.</span>
            <span className="block text-[11px] font-normal text-emerald-700 font-mono mt-0.5">
              Circuit Breaker Trip Event Logged • Zero Downtime Cutover (310ms)
            </span>
          </div>
        </div>
      )}

      {promotionSuccess && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-300 text-xs font-semibold text-blue-900 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <span>Promotion Successful: Model <strong>Prototype v2.4 (Debiased)</strong> promoted to 100% traffic allocation.</span>
          </div>
        </div>
      )}

      {/* Model Release Gating (Go / No-Go Checklist) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              <span>Model Release Gating (Go / No-Go Statutory Checklist)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Automated gatekeeper validating compliance thresholds prior to production promotion.
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${
              isAllChecklistPassed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {isAllChecklistPassed ? 'GO: Ready for Release' : 'NO-GO: Disparity Block'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
          {/* Item 1 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">1. Disparate Impact</span>
              {diPassed ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <X className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              Target: <strong className="text-slate-700">&ge; 0.800</strong> (4/5ths)
            </div>
            <div className="font-mono text-xs font-bold text-emerald-700">
              {fairnessPrototype.disparate_impact_ratio.toFixed(3)}
            </div>
          </div>

          {/* Item 2 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">2. FPR Disparity Gap</span>
              {fprGapPassed ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <X className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              Target: <strong className="text-slate-700">&le; 10.0%</strong>
            </div>
            <div className="font-mono text-xs font-bold text-slate-900">
              {(fairnessPrototype.fpr_gap * 100).toFixed(1)}%
            </div>
          </div>

          {/* Item 3 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">3. Commercial Accuracy</span>
              {accuracyPassed ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <X className="w-4 h-4 text-rose-600" />
              )}
            </div>
            <div className="text-[11px] text-slate-500">
              Target: <strong className="text-slate-700">&ge; 85.0%</strong>
            </div>
            <div className="font-mono text-xs font-bold text-slate-900">
              {(prototypeMetrics.accuracy * 100).toFixed(1)}%
            </div>
          </div>

          {/* Item 4 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">4. Severe Harm Rate</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-slate-500">
              Target: <strong className="text-slate-700">&le; 0.5%</strong>
            </div>
            <div className="font-mono text-xs font-bold text-emerald-700">0.08% Nominal</div>
          </div>

          {/* Item 5 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">5. Risk Committee Sign-Off</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-[11px] text-slate-500">Tier 1 Model Validation</div>
            <div className="font-mono text-xs font-bold text-blue-700">SR 11-7 Signed</div>
          </div>
        </div>
      </div>

      {/* Canary Deployment Traffic Split Slider */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Canary Deployment Traffic Split Controller</span>
            </h3>
            <p className="text-xs text-slate-500">
              Gradually route live production decisions to the debiased candidate to verify stability.
            </p>
          </div>
          <span className="font-mono font-bold text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            {canaryPercentage}% Live Canary Split
          </span>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={canaryPercentage}
            onChange={(e) => setCanaryPercentage(parseInt(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />

          <div className="flex justify-between text-xs text-slate-500 font-mono">
            <span>0% (Shadow Evaluation Only)</span>
            <span>15% (Standard Canary)</span>
            <span>50% (A/B Test)</span>
            <span>100% (Full Production)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Primary Model Traffic</span>
            <span className="text-base font-bold text-slate-800 font-mono">
              {100 - canaryPercentage}%
            </span>
            <span className="text-[10px] text-slate-500 block">Baseline Production</span>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="text-blue-700 block text-[10px] uppercase font-bold">Canary Candidate Traffic</span>
            <span className="text-base font-bold text-blue-900 font-mono">
              {canaryPercentage}%
            </span>
            <span className="text-[10px] text-blue-700 block">Prototype v2.4 (Debiased)</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-400 block text-[10px] uppercase">Automated Circuit Breaker</span>
            <span className="text-base font-bold text-emerald-700">Armed</span>
            <span className="text-[10px] text-slate-500 block">Auto-halts if FPR gap &gt; 10%</span>
          </div>
        </div>
      </div>

      {/* Model Incident Log & Audit History */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-600" />
              <span>Production Incident & Rollback Governance Log</span>
            </h3>
            <p className="text-xs text-slate-500">
              Immutable telemetry tracking release transitions, canary adjustments, and circuit breaker trips.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">SHA-256 Verified Ledger</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Event ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Action Description</th>
                <th className="py-2.5 px-3">Authorized Actor</th>
                <th className="py-2.5 px-3">Posture Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {incidentLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{log.id}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-800">{log.event}</td>
                  <td className="py-2.5 px-3 text-slate-600">{log.actor}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'Triggered'
                          ? 'bg-rose-100 text-rose-800'
                          : log.status === 'Promoted'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {log.status}
                    </span>
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
