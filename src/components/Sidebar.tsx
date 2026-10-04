import React from 'react';
import {
  Home,
  BarChart3,
  Scale,
  ShieldAlert,
  UserCheck,
  FlaskConical,
  Sparkles,
  RefreshCw,
  Lock,
  ChevronRight,
  Cpu,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';
import { NavigationTab } from '../types';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

interface NavItemDef {
  id: NavigationTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  num: string;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'warning';
}

const navItems: NavItemDef[] = [
  { id: 'overview', label: 'Overview', icon: Home, num: '1' },
  { id: 'performance', label: 'Performance', icon: BarChart3, num: '2' },
  { id: 'fairness', label: 'Fairness', icon: Scale, num: '3', badge: '0.88 Pass', badgeType: 'accent' },
  { id: 'harm-analysis', label: 'Harm Analysis', icon: ShieldAlert, num: '4' },
  { id: 'override-analysis', label: 'Override Analysis', icon: UserCheck, num: '5', badge: '4.2%', badgeType: 'default' },
  { id: 'mitigation-lab', label: 'Mitigation Lab', icon: FlaskConical, num: '6' },
  { id: 'edge-cases', label: 'Edge Cases', icon: Sparkles, num: '7', badge: '3 Flagged', badgeType: 'warning' },
  { id: 'deployment-rollback', label: 'Deployment & Rollback', icon: RefreshCw, num: '8' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  mobileOpen = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        id="responsible-ai-sidebar"
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col w-72 h-full bg-[#080E1E] text-slate-100 border-r border-slate-800/80 shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } select-none overflow-hidden`}
      >
        {/* Subtle AI/Circuit Trust Watermark Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 10 10 L 30 10 L 40 20 L 50 20 M 10 30 L 25 30 L 35 40 L 50 40 M 30 50 L 30 30" fill="none" stroke="#60A5FA" strokeWidth="1" />
                <circle cx="10" cy="10" r="2" fill="#60A5FA" />
                <circle cx="50" cy="20" r="2" fill="#60A5FA" />
                <circle cx="35" cy="40" r="2" fill="#60A5FA" />
                <circle cx="30" cy="50" r="2" fill="#60A5FA" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
          </svg>
        </div>

        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Project Brand & Shield + AI/Circuit Icon */}
        <div className="relative px-5 pt-6 pb-5 border-b border-slate-800/70">
          <div className="flex items-center gap-3">
            {/* Custom Shield + AI/Circuit Icon */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-950 via-[#0E1E38] to-[#0A1629] border border-blue-500/35 shadow-[0_0_15px_rgba(59,130,246,0.22)] shrink-0">
              <svg
                className="w-6 h-6 text-sky-400"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Shield Contour */}
                <path
                  d="M12 2.5L4 6V11.5C4 16.5 7.5 21 12 22.5C16.5 21 20 16.5 20 11.5V6L12 2.5Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-sky-400"
                />
                {/* AI / Circuit Core Traces */}
                <path
                  d="M12 7V10M12 14V17M8.5 12H10M14 12H15.5"
                  stroke="#93C5FD"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="12" r="1.8" fill="#38BDF8" />
                <circle cx="8" cy="12" r="0.8" fill="#60A5FA" />
                <circle cx="16" cy="12" r="0.8" fill="#60A5FA" />
                <circle cx="12" cy="6.5" r="0.8" fill="#60A5FA" />
              </svg>

              {/* Status Dot */}
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-400" />
              </span>
            </div>

            {/* Brand Titles */}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-semibold tracking-tight text-white">
                  TrustGuard AI
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase rounded bg-blue-500/15 text-sky-300 border border-blue-400/25">
                  Gov
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400 truncate">
                Responsible AI & Digital Trust
              </span>
            </div>
          </div>

          {/* Model Context & Security Hash Pill */}
          <div className="mt-3.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-300 truncate">
              <Lock className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="truncate font-mono text-slate-300">Retail Credit v4.2</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SOC2 • Verified</span>
            </div>
          </div>
        </div>

        {/* Navigation Category Label */}
        <div className="px-5 pt-4 pb-1.5 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400">
            Governance Workflows
          </span>
          <span className="text-[10px] font-mono text-sky-400/80 bg-blue-950/70 px-1.5 py-0.5 rounded border border-blue-800/40">
            8 Modules
          </span>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/20 text-white border border-blue-500/35 shadow-[0_0_16px_rgba(59,130,246,0.18)]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 pl-1">
                  <div
                    className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-500/20 text-sky-300'
                        : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] text-slate-400 group-hover:text-slate-300">
                      {item.num}.
                    </span>
                    <span className="truncate tracking-tight">{item.label}</span>
                  </div>
                </div>

                {/* Badges / Status */}
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium tracking-tight ${
                        item.badgeType === 'accent'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : item.badgeType === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Banking AI Governance & Digital Trust Footer Card */}
        <div className="p-3.5 mt-auto border-t border-slate-800/80 bg-[#060B18]">
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800/90 text-[11px] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                <FileCheck2 className="w-3.5 h-3.5 text-sky-400" />
                <span>Regulatory Posture</span>
              </div>
              <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Tier 1 Bank
              </span>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              SR 11-7 & EU AI Act High-Risk Credit System Governance actively enforced.
            </p>

            <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Cpu className="w-2.5 h-2.5 text-sky-400" />
                SHA-256: 4e8b..9a
              </span>
              <span className="text-sky-400 flex items-center gap-0.5 font-sans">
                <CheckCircle2 className="w-2.5 h-2.5 text-sky-400" />
                Live Enclave
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
