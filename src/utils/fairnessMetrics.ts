import {
  SyntheticBankingRecord,
  MetricSummary,
  GroupFairnessMetrics,
  PerformanceGapItem,
  HarmEvaluationMetrics,
  OverrideMetrics,
  MitigationParams,
  BankingModelTask,
} from '../types';

/**
 * Computes standard confusion matrix and classification metrics from a dataset.
 */
export function calculateMetricSummary(
  records: SyntheticBankingRecord[],
  predictionExtractor: (r: SyntheticBankingRecord) => number = (r) => r.prediction_baseline,
): MetricSummary {
  const total = records.length;
  if (total === 0) {
    return {
      sample_size: 0,
      tp: 0,
      fp: 0,
      fn: 0,
      tn: 0,
      accuracy: 0,
      precision: 0,
      recall: 0,
      false_positive_rate: 0,
      false_negative_rate: 0,
      f1_score: 0,
      positive_rate: 0,
    };
  }

  let tp = 0;
  let fp = 0;
  let fn = 0;
  let tn = 0;

  for (const r of records) {
    const pred = predictionExtractor(r);
    const actual = r.actual_outcome;

    if (pred === 1 && actual === 1) tp++;
    else if (pred === 1 && actual === 0) fp++;
    else if (pred === 0 && actual === 1) fn++;
    else tn++;
  }

  const accuracy = (tp + tn) / total;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0; // True Positive Rate
  const false_positive_rate = fp + tn > 0 ? fp / (fp + tn) : 0;
  const false_negative_rate = fn + tp > 0 ? fn / (fn + tp) : 0;
  const f1_score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const positive_rate = (tp + fp) / total;

  return {
    sample_size: total,
    tp,
    fp,
    fn,
    tn,
    accuracy: Math.round(accuracy * 1000) / 1000,
    precision: Math.round(precision * 1000) / 1000,
    recall: Math.round(recall * 1000) / 1000,
    false_positive_rate: Math.round(false_positive_rate * 1000) / 1000,
    false_negative_rate: Math.round(false_negative_rate * 1000) / 1000,
    f1_score: Math.round(f1_score * 1000) / 1000,
    positive_rate: Math.round(positive_rate * 1000) / 1000,
  };
}

/**
 * Calculates core statutory fairness metrics comparing Group A (Reference) vs Group B (Protected).
 */
export function calculateFairnessMetrics(
  records: SyntheticBankingRecord[],
  predictionExtractor: (r: SyntheticBankingRecord) => number = (r) => r.prediction_baseline,
): {
  groupA: MetricSummary;
  groupB: MetricSummary;
  demographic_parity_gap: number;
  equal_opportunity_gap: number;
  disparate_impact_ratio: number;
  fpr_gap: number;
  fnr_gap: number;
  table: Array<{
    metric: string;
    groupAVal: string;
    groupBVal: string;
    gapVal: string;
    threshold: string;
    status: 'PASS' | 'WARNING' | 'FAIL';
    definition: string;
  }>;
} {
  const groupARecords = records.filter(
    (r) => r.protected_group === 'Group A (Reference / Majority)',
  );
  const groupBRecords = records.filter(
    (r) => r.protected_group === 'Group B (Protected Cohort)',
  );

  const groupA = calculateMetricSummary(groupARecords, predictionExtractor);
  const groupB = calculateMetricSummary(groupBRecords, predictionExtractor);

  // 1. Demographic Parity Gap: |PR(A) - PR(B)|
  const demographic_parity_gap = Math.abs(groupA.positive_rate - groupB.positive_rate);

  // 2. Equal Opportunity Gap: |TPR(A) - TPR(B)|
  const equal_opportunity_gap = Math.abs(groupA.recall - groupB.recall);

  // 3. Disparate Impact Ratio: min(PR(B)/PR(A), PR(A)/PR(B))
  // In fraud detection, positive prediction = flagged as fraud.
  // Standard Four-Fifths rule: ratio between selection/pass rates must be >= 0.80
  const diRatio =
    groupA.positive_rate > 0
      ? groupB.positive_rate / groupA.positive_rate
      : 1.0;
  // Disparate impact for non-flagged (clearance rate) or flagged rate:
  // For adverse actions (freeze/block), we evaluate clearance rate ratio:
  const clearanceA = 1 - groupA.positive_rate;
  const clearanceB = 1 - groupB.positive_rate;
  const disparate_impact_ratio =
    clearanceA > 0 ? clearanceB / clearanceA : 1.0;

  // 4. False Positive Rate Gap: |FPR(A) - FPR(B)|
  const fpr_gap = Math.abs(groupA.false_positive_rate - groupB.false_positive_rate);

  // 5. False Negative Rate Gap: |FNR(A) - FNR(B)|
  const fnr_gap = Math.abs(groupA.false_negative_rate - groupB.false_negative_rate);

  const table = [
    {
      metric: 'Demographic Parity',
      groupAVal: `${(groupA.positive_rate * 100).toFixed(1)}%`,
      groupBVal: `${(groupB.positive_rate * 100).toFixed(1)}%`,
      gapVal: `${(demographic_parity_gap * 100).toFixed(1)}%`,
      threshold: '< 5.0% gap',
      status: demographic_parity_gap <= 0.05 ? 'PASS' : demographic_parity_gap <= 0.10 ? 'WARNING' : 'FAIL',
      definition: 'Difference in positive flag rates between demographic groups regardless of true outcome.',
    },
    {
      metric: 'Equal Opportunity (TPR)',
      groupAVal: `${(groupA.recall * 100).toFixed(1)}%`,
      groupBVal: `${(groupB.recall * 100).toFixed(1)}%`,
      gapVal: `${(equal_opportunity_gap * 100).toFixed(1)}%`,
      threshold: '< 5.0% gap',
      status: equal_opportunity_gap <= 0.05 ? 'PASS' : equal_opportunity_gap <= 0.10 ? 'WARNING' : 'FAIL',
      definition: 'Equal probability of true fraud detection across groups (True Positive Rate Parity).',
    },
    {
      metric: 'Disparate Impact (4/5ths Rule)',
      groupAVal: '1.000 (Ref)',
      groupBVal: disparate_impact_ratio.toFixed(3),
      gapVal: `${((1 - disparate_impact_ratio) * 100).toFixed(1)}%`,
      threshold: '≥ 0.800',
      status: disparate_impact_ratio >= 0.80 ? 'PASS' : disparate_impact_ratio >= 0.70 ? 'WARNING' : 'FAIL',
      definition: 'Ratio of non-flagged clearance rates between protected cohort and reference standard.',
    },
    {
      metric: 'False Positive Rate Gap',
      groupAVal: `${(groupA.false_positive_rate * 100).toFixed(1)}%`,
      groupBVal: `${(groupB.false_positive_rate * 100).toFixed(1)}%`,
      gapVal: `${(fpr_gap * 100).toFixed(1)}%`,
      threshold: '< 5.0% gap',
      status: fpr_gap <= 0.05 ? 'PASS' : fpr_gap <= 0.10 ? 'WARNING' : 'FAIL',
      definition: 'Difference in unjustified fraud flags/freezes on innocent customers (Direct harm driver).',
    },
    {
      metric: 'False Negative Rate Gap',
      groupAVal: `${(groupA.false_negative_rate * 100).toFixed(1)}%`,
      groupBVal: `${(groupB.false_negative_rate * 100).toFixed(1)}%`,
      gapVal: `${(fnr_gap * 100).toFixed(1)}%`,
      threshold: '< 5.0% gap',
      status: fnr_gap <= 0.05 ? 'PASS' : fnr_gap <= 0.10 ? 'WARNING' : 'FAIL',
      definition: 'Difference in undetected fraud cases that slip past defenses (Bank credit loss driver).',
    },
  ];

  return {
    groupA,
    groupB,
    demographic_parity_gap,
    equal_opportunity_gap,
    disparate_impact_ratio,
    fpr_gap,
    fnr_gap,
    table: table as any,
  };
}

/**
 * Dynamic calculation of performance gaps across protected subgroups from the synthetic dataset.
 */
export function calculatePerformanceGaps(records: SyntheticBankingRecord[]): PerformanceGapItem[] {
  const fairness = calculateFairnessMetrics(records);
  const items: PerformanceGapItem[] = [];

  // FPR Gap Issue
  if (fairness.fpr_gap > 0.04) {
    items.push({
      metric: 'False Positive Rate (Unjustified Fraud Flags)',
      affected_group: 'Group B (Protected Cohort)',
      baseline: `${(fairness.groupA.false_positive_rate * 100).toFixed(1)}%`,
      target: '< 10.0%',
      measured_result: `${(fairness.groupB.false_positive_rate * 100).toFixed(1)}%`,
      gap: `+${(fairness.fpr_gap * 100).toFixed(1)}%`,
      severity: fairness.fpr_gap > 0.08 ? 'High' : 'Medium',
      possible_cause:
        'Model over-weights rapid-fire micro-transfers and cross-border remittance patterns common among immigrant/young accounts.',
    });
  }

  // Queue Wait Time Disparity
  const harm = calculateHarmMetrics(records);
  if (harm.wait_time_disparity_minutes > 5) {
    items.push({
      metric: 'Customer Service Queue Wait Time Disparity',
      affected_group: 'Group B (Protected Cohort)',
      baseline: `${harm.avg_wait_time_group_a.toFixed(1)} mins`,
      target: '< 12.0 mins',
      measured_result: `${harm.avg_wait_time_group_b.toFixed(1)} mins`,
      gap: `+${harm.wait_time_disparity_minutes.toFixed(1)} mins`,
      severity: harm.wait_time_disparity_minutes > 12 ? 'High' : 'Medium',
      possible_cause:
        'Rule-based routing privileges high-balance accounts with VIP concierge while routing lower-balance protected cohorts to general queues.',
    });
  }

  // Disparate Impact
  if (fairness.disparate_impact_ratio < 0.90) {
    items.push({
      metric: 'Disparate Impact Clearance Ratio (4/5ths Rule)',
      affected_group: 'Group B (Protected Cohort)',
      baseline: '1.000',
      target: '≥ 0.800',
      measured_result: fairness.disparate_impact_ratio.toFixed(3),
      gap: `-${((1 - fairness.disparate_impact_ratio) * 100).toFixed(1)}%`,
      severity: fairness.disparate_impact_ratio < 0.80 ? 'High' : 'Medium',
      possible_cause:
        'Proxy correlation between geographic zip codes, account age, and fraud probability score calibration.',
    });
  }

  // Unjustified Account Freezes
  if (harm.unjustified_freeze_gap > 2) {
    items.push({
      metric: 'Unjustified Account Freeze Harm Rate',
      affected_group: 'Group B (Protected Cohort)',
      baseline: `${harm.unjustified_freeze_rate_group_a.toFixed(1)}%`,
      target: '< 3.0%',
      measured_result: `${harm.unjustified_freeze_rate_group_b.toFixed(1)}%`,
      gap: `+${harm.unjustified_freeze_gap.toFixed(1)}%`,
      severity: 'High',
      possible_cause:
        'High sensitivity threshold triggers account freeze without step-up authentication challenge.',
    });
  }

  return items;
}

/**
 * Calculates operational harms: account freezes, queue times, friction hours, severe impact.
 */
export function calculateHarmMetrics(records: SyntheticBankingRecord[]): HarmEvaluationMetrics {
  const groupA = records.filter((r) => r.protected_group === 'Group A (Reference / Majority)');
  const groupB = records.filter((r) => r.protected_group === 'Group B (Protected Cohort)');

  // Unjustified freeze = false positive where account_action was Temporary Account Freeze
  const groupAFreezes = groupA.filter(
    (r) => r.false_positive && r.account_action === 'Temporary Account Freeze',
  ).length;
  const groupBFreezes = groupB.filter(
    (r) => r.false_positive && r.account_action === 'Temporary Account Freeze',
  ).length;

  const freezeRateA = groupA.length > 0 ? (groupAFreezes / groupA.length) * 100 : 0;
  const freezeRateB = groupB.length > 0 ? (groupBFreezes / groupB.length) * 100 : 0;

  // Queue wait times
  const waitA =
    groupA.length > 0 ? groupA.reduce((acc, r) => acc + r.queue_wait_time, 0) / groupA.length : 0;
  const waitB =
    groupB.length > 0 ? groupB.reduce((acc, r) => acc + r.queue_wait_time, 0) / groupB.length : 0;

  // Friction hours
  const totalFriction = records.reduce((acc, r) => acc + r.friction_hours, 0);
  const frictionA =
    groupA.length > 0 ? groupA.reduce((acc, r) => acc + r.friction_hours, 0) / groupA.length : 0;
  const frictionB =
    groupB.length > 0 ? groupB.reduce((acc, r) => acc + r.friction_hours, 0) / groupB.length : 0;

  // Severe impact & redress eligibility
  const severe_impact_count = records.filter((r) => r.severe_impact).length;
  const redress_eligibility_count = records.filter((r) => r.redress_eligible).length;

  // Operational friction index: 0-100 composite score based on wait time, freeze rate disparity, and severe harm count
  const frictionIndex = Math.min(
    100,
    Math.round(
      (freezeRateB * 2.5 + (waitB - waitA) * 1.5 + (severe_impact_count / records.length) * 200) *
        10,
    ) / 10,
  );

  return {
    unjustified_freeze_rate_group_a: Math.round(freezeRateA * 10) / 10,
    unjustified_freeze_rate_group_b: Math.round(freezeRateB * 10) / 10,
    unjustified_freeze_gap: Math.round(Math.abs(freezeRateA - freezeRateB) * 10) / 10,
    avg_wait_time_group_a: Math.round(waitA * 10) / 10,
    avg_wait_time_group_b: Math.round(waitB * 10) / 10,
    wait_time_disparity_minutes: Math.round(Math.abs(waitA - waitB) * 10) / 10,
    total_friction_hours: totalFriction,
    avg_friction_hours_group_a: Math.round(frictionA * 10) / 10,
    avg_friction_hours_group_b: Math.round(frictionB * 10) / 10,
    severe_impact_count,
    redress_eligibility_count,
    operational_friction_index: frictionIndex,
  };
}

/**
 * Calculates human-in-the-loop override metrics and whether overrides reduced or increased disparity.
 */
export function calculateOverrideMetrics(records: SyntheticBankingRecord[]): OverrideMetrics {
  const total = records.length;
  const overrides = records.filter((r) => r.override_decision !== 'None');
  const groupA = records.filter((r) => r.protected_group === 'Group A (Reference / Majority)');
  const groupB = records.filter((r) => r.protected_group === 'Group B (Protected Cohort)');

  const groupAOverrides = groupA.filter((r) => r.override_decision !== 'None').length;
  const groupBOverrides = groupB.filter((r) => r.override_decision !== 'None').length;

  const upgraded = overrides.filter((r) => r.override_decision === 'Overruled - Approved').length;
  const downgraded = overrides.filter((r) => r.override_decision === 'Overruled - Denied').length;

  // Fairness metrics BEFORE override (AI Baseline decision)
  const beforeFairness = calculateFairnessMetrics(records, (r) => r.prediction_baseline);

  // Fairness metrics AFTER override (Final Decision = AI decision modified by Human Override)
  const afterFairness = calculateFairnessMetrics(records, (r) => {
    if (r.override_decision === 'Overruled - Approved') return 0; // cleared by human
    if (r.override_decision === 'Overruled - Denied') return 1; // blocked by human
    return r.prediction_baseline;
  });

  const diBefore = beforeFairness.disparate_impact_ratio;
  const diAfter = afterFairness.disparate_impact_ratio;
  const fprGapBefore = beforeFairness.fpr_gap;
  const fprGapAfter = afterFairness.fpr_gap;

  let verdict: 'Reduced Disparity' | 'Neutral' | 'Increased Disparity' = 'Neutral';
  if (diAfter > diBefore && fprGapAfter < fprGapBefore) {
    verdict = 'Reduced Disparity';
  } else if (diAfter < diBefore || fprGapAfter > fprGapBefore) {
    verdict = 'Increased Disparity';
  }

  return {
    total_evaluations: total,
    total_overrides: overrides.length,
    override_rate: Math.round((overrides.length / total) * 1000) / 10,
    group_a_override_rate: Math.round((groupAOverrides / (groupA.length || 1)) * 1000) / 10,
    group_b_override_rate: Math.round((groupBOverrides / (groupB.length || 1)) * 1000) / 10,
    upgraded_count: upgraded,
    downgraded_count: downgraded,
    disparate_impact_before: Math.round(diBefore * 1000) / 1000,
    disparate_impact_after: Math.round(diAfter * 1000) / 1000,
    fpr_gap_before: Math.round(fprGapBefore * 1000) / 1000,
    fpr_gap_after: Math.round(fprGapAfter * 1000) / 1000,
    impact_verdict: verdict,
  };
}

/**
 * Interactive simulation engine for Mitigation Lab.
 * Recomputes predictions per record and yields updated dataset with before vs after diffs.
 */
export function simulateMitigation(
  records: SyntheticBankingRecord[],
  params: MitigationParams,
): {
  mitigatedRecords: SyntheticBankingRecord[];
  baselineMetrics: MetricSummary;
  mitigatedMetrics: MetricSummary;
  baselineFairness: ReturnType<typeof calculateFairnessMetrics>;
  mitigatedFairness: ReturnType<typeof calculateFairnessMetrics>;
  baselineHarm: HarmEvaluationMetrics;
  mitigatedHarm: HarmEvaluationMetrics;
} {
  const baselineMetrics = calculateMetricSummary(records, (r) => r.prediction_baseline);
  const baselineFairness = calculateFairnessMetrics(records, (r) => r.prediction_baseline);
  const baselineHarm = calculateHarmMetrics(records);

  const mitigatedRecords: SyntheticBankingRecord[] = records.map((record) => {
    let threshold = params.threshold_global;

    if (params.use_group_thresholds) {
      threshold =
        record.protected_group === 'Group A (Reference / Majority)'
          ? params.threshold_group_a
          : params.threshold_group_b;
    }

    let prob = record.fraud_probability;

    // Apply Reweighting effect
    if (params.reweighting_factor > 0) {
      if (record.protected_group === 'Group B (Protected Cohort)') {
        // Reweighting counters proxy upward bias
        prob = prob * (1 - params.reweighting_factor * 0.18);
      }
    }

    // Apply Equalized Odds post-processing simulation
    if (params.equalized_odds_enabled) {
      if (record.protected_group === 'Group B (Protected Cohort)' && prob >= 0.48 && prob <= 0.58) {
        // Equalize False Positive rate on boundary
        prob = prob * 0.90;
      }
    }

    // Fairness constraint shift
    if (params.fairness_constraint === 'minimize_unjustified_freeze') {
      threshold = Math.max(threshold, 0.56);
    } else if (params.fairness_constraint === 'disparate_impact') {
      if (record.protected_group === 'Group B (Protected Cohort)') {
        threshold = threshold + 0.04;
      }
    }

    const newPred = prob >= threshold ? 1 : 0;
    const isFP = newPred === 1 && record.actual_outcome === 0;
    const isFN = newPred === 0 && record.actual_outcome === 1;

    let newAction = record.account_action;
    let newFriction = record.friction_hours;
    let newSevere = record.severe_impact;

    if (newPred === 0) {
      newAction = 'None';
      newFriction = 0;
      newSevere = false;
    } else if (isFP) {
      newFriction = Math.max(1, Math.round(record.friction_hours * 0.6));
      newSevere = newFriction > 10;
    }

    return {
      ...record,
      prediction_prototype: newPred,
      false_positive: isFP,
      false_negative: isFN,
      account_action: newAction,
      friction_hours: newFriction,
      severe_impact: newSevere,
    };
  });

  const mitigatedMetrics = calculateMetricSummary(
    mitigatedRecords,
    (r) => r.prediction_prototype,
  );
  const mitigatedFairness = calculateFairnessMetrics(
    mitigatedRecords,
    (r) => r.prediction_prototype,
  );
  const mitigatedHarm = calculateHarmMetrics(mitigatedRecords);

  return {
    mitigatedRecords,
    baselineMetrics,
    mitigatedMetrics,
    baselineFairness,
    mitigatedFairness,
    baselineHarm,
    mitigatedHarm,
  };
}
