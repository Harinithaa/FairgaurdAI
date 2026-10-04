import React from 'react';
import {
  ShieldCheck,
  Download,
  Menu,
  CheckCircle,
  Clock,
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  Lock,
  Layers,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { BankingModelTask } from '../types';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onExportDossier: () => void;
  selectedModel: string;
  onChangeModel: (model: string) => void;
  selectedTask: BankingModelTask;
  onChangeTask: (task: BankingModelTask) => void;
  onRegenerateData: () => void;
  totalRecordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onExportDossier,
  selectedModel,
  onChangeModel,
  selectedTask,
  onChangeTask,
  onRegenerateData,
  totalRecordsCount,
}) => {
  return (
    <header
      id="workbench-top-header"
      className="sticky top-0 z-30 flex flex-col bg-white border-b border-slate-200/90 shadow-xs"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile Toggle + Breadcrumb / Active Model */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Banking Model Risk Governance (SR 11-7 / CFPB ECOA)
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3 h-3 text-emerald-600" />
                Live Telemetry Active
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                FairBank AI – Fairness & Harm Evaluation Workbench
              </h1>
            </div>
          </div>
        </div>

        {/* Right Controls: Task Selector, Model Selector, Export Dossier */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Banking Model Task Toggle */}
          <div className="hidden md:flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
            <button
              onClick={() => onChangeTask('fraud_detection')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedTask === 'fraud_detection'
                  ? 'bg-white text-blue-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Fraud Detection Model
            </button>
            <button
              onClick={() => onChangeTask('service_prioritisation')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedTask === 'service_prioritisation'
                  ? 'bg-white text-blue-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Support Prioritisation
            </button>
          </div>

          {/* Model Selection Dropdown */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={selectedModel}
              onChange={(e) => onChangeModel(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="prototype-v2.4">Prototype v2.4 (Debiased)</option>
              <option value="baseline-v1.0">Baseline v1.0 (Fixed Threshold)</option>
              <option value="canary-v2.5">Canary v2.5 (15% Traffic)</option>
            </select>
          </div>

          {/* Regenerate Synthetic Data Button */}
          <button
            onClick={onRegenerateData}
            title="Generate new synthetic cohort to verify live calculation"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <RefreshCw className="w-3 h-3 text-slate-500" />
            <span>Reseed Data ({totalRecordsCount})</span>
          </button>

          {/* Export Regulatory Dossier Button */}
          <button
            id="btn-export-dossier"
            type="button"
            onClick={onExportDossier}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Audit Dossier</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>

      {/* Mandatory Privacy/Ethics Banner as required */}
      <div className="px-4 sm:px-6 py-1.5 bg-blue-50/70 border-t border-blue-100 flex items-center justify-between text-[11px] text-blue-900">
        <div className="flex items-center gap-1.5 font-medium truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate">
            <strong>Privacy & Ethics Assurance:</strong> Only data essential for fairness and operational-harm evaluation is used. All customer identifiers are synthetic. Zero PII collected.
          </span>
        </div>
        <div className="hidden xl:flex items-center gap-3 shrink-0 text-blue-700 font-mono text-[10px]">
          <span>Evaluated Sample: N={totalRecordsCount} Synthetic Records</span>
          <span>•</span>
          <span>Target Standard: 4/5ths Rule (80% Disparate Impact Floor)</span>
        </div>
      </div>
    </header>
  );
};
