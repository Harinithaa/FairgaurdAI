export type NavigationTab =
  | 'overview'
  | 'performance'
  | 'fairness'
  | 'harm-analysis'
  | 'override-analysis'
  | 'mitigation-lab'
  | 'edge-cases'
  | 'deployment-rollback';

export type BankingModelTask = 'fraud_detection' | 'service_prioritisation';

export interface NavItemConfig {
  id: NavigationTab;
  label: string;
  number: number;
  iconName: string;
  badge?: string;
  badgeType?: 'default' | 'accent' | 'warning';
  description: string;
}

export interface SyntheticBankingRecord {
  customer_id: string; // Synthetic ID e.g. "CUST-94281"
  task_type: BankingModelTask;
  protected_group: 'Group A (Reference / Majority)' | 'Group B (Protected Cohort)';
  group_label: string; // Specific sub-label e.g. "Young Adults (<25)", "Minority Proxy Zip", "Cross-Border Remittance"
  proxy_group: string; // e.g. "Urban High-Density", "Thin Credit File", "Digital-Only Banking"
  
  // Model Inputs / Features (Non-PII)
  transaction_amount?: number;
  account_tenure_months: number;
  monthly_inflow: number;
  
  // Probabilities & Scores
  fraud_probability: number; // 0.00 to 1.00
  service_urgency_score: number; // 0.00 to 1.00
  
  // Predictions & Ground Truth
  prediction_baseline: number; // 0 or 1
  prediction_prototype: number; // 0 or 1
  actual_outcome: number; // Ground truth: 1 = actual fraud / actual high urgency, 0 = legitimate / routine
  
  // Operational Outcomes
  service_priority: 'Low' | 'Medium' | 'High' | 'Critical';
  account_action: 'None' | 'Step-Up Auth' | 'Temporary Account Freeze' | 'Transaction Block';
  queue_wait_time: number; // in minutes
  processing_time_sec: number; // in seconds
  
  // Harm & Friction
  false_positive: boolean;
  false_negative: boolean;
  friction_hours: number; // Time spent by customer to resolve issue
  severe_impact: boolean; // e.g. stranded without funds, missed essential billing
  redress_eligible: boolean; // Eligible for fee rebate / restitution
  
  // Human-In-The-Loop Override
  override_decision: 'None' | 'Overruled - Approved' | 'Overruled - Denied';
  override_reason?: string;
  underwriter_role?: string;
}

export interface MetricSummary {
  sample_size: number;
  tp: number;
  fp: number;
  fn: number;
  tn: number;
  accuracy: number;
  precision: number;
  recall: number; // TPR
  false_positive_rate: number; // FPR
  false_negative_rate: number; // FNR
  f1_score: number;
  positive_rate: number; // (TP + FP) / Total
}

export interface GroupFairnessMetrics {
  group_name: string;
  category: string;
  sample_size: number;
  positive_rate: number;
  true_positive_rate: number; // Recall
  false_positive_rate: number;
  false_negative_rate: number;
  disparate_impact_ratio: number;
  tpr_gap: number;
  fpr_gap: number;
  status: 'PASS' | 'WARNING' | 'FAIL';
}

export interface PerformanceGapItem {
  metric: string;
  affected_group: string;
  baseline: number | string;
  target: number | string;
  measured_result: number | string;
  gap: string;
  severity: 'High' | 'Medium' | 'Low';
  possible_cause: string;
}

export interface HarmEvaluationMetrics {
  unjustified_freeze_rate_group_a: number; // %
  unjustified_freeze_rate_group_b: number; // %
  unjustified_freeze_gap: number;
  avg_wait_time_group_a: number; // mins
  avg_wait_time_group_b: number; // mins
  wait_time_disparity_minutes: number;
  total_friction_hours: number;
  avg_friction_hours_group_a: number;
  avg_friction_hours_group_b: number;
  severe_impact_count: number;
  redress_eligibility_count: number;
  operational_friction_index: number; // 0-100 scale
}

export interface OverrideMetrics {
  total_evaluations: number;
  total_overrides: number;
  override_rate: number;
  group_a_override_rate: number;
  group_b_override_rate: number;
  upgraded_count: number; // Denied by AI -> Approved by Human
  downgraded_count: number; // Approved by AI -> Denied by Human
  disparate_impact_before: number;
  disparate_impact_after: number;
  fpr_gap_before: number;
  fpr_gap_after: number;
  impact_verdict: 'Reduced Disparity' | 'Neutral' | 'Increased Disparity';
}

export interface MitigationParams {
  threshold_global: number;
  threshold_group_a: number;
  threshold_group_b: number;
  use_group_thresholds: boolean;
  reweighting_factor: number;
  equalized_odds_enabled: boolean;
  fairness_constraint: 'equal_opportunity' | 'disparate_impact' | 'minimize_unjustified_freeze';
}
