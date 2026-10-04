import { SyntheticBankingRecord, BankingModelTask } from '../types';

// Deterministic pseudo-random number generator for reproducible synthetic dataset
function createPRNG(seed: number) {
  let state = seed;
  return function () {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function generateSyntheticBankingDataset(count = 1200): SyntheticBankingRecord[] {
  const prng = createPRNG(42819);
  const records: SyntheticBankingRecord[] = [];

  const proxyGroups = [
    'Urban High-Density Zip',
    'Thin Bureau Credit File',
    'Gig Economy / Volatile Inflow',
    'Cross-Border Remittance Corridor',
    'Mobile-Only Digital Banking',
    'Low Initial Deposit Account',
  ];

  const groupBLabels = [
    'Young Adults (< 25)',
    'Protected Minority Proxy Zip',
    'Cross-Border Remittance Senders',
    'Thin-File Digital Immigrants',
    'Non-Traditional Gig Earners',
  ];

  const overrideReasonsGroupB = [
    'Known Cross-Border Family Remittance Pattern Verified',
    'Customer Verified via Direct Biometric In-App Push',
    'Alternative Payroll / Rent Payment History Verified',
    'Seasonal Small-Business Inflow Pattern Confirmed',
    'False Alarm on Urgent Holiday Travel Expenditure',
  ];

  const overrideReasonsGroupA = [
    'Longstanding 10+ Year Account Relationship Exception',
    'High Net-Worth Collateral Backing Verified',
    'Branch Manager Manual Signature Override',
    'Merchant POS Terminal Misconfiguration Cleared',
    'Routine Travel Notice Logged Post-Transaction',
  ];

  for (let i = 0; i < count; i++) {
    const idNum = 100000 + i;
    const customer_id = `CUST-${idNum}`;
    
    // Assign model task: 60% fraud detection, 40% customer service prioritisation
    const task_type: BankingModelTask = prng() < 0.60 ? 'fraud_detection' : 'service_prioritisation';
    
    // 45% Group B (Protected / Proxy), 55% Group A (Reference standard)
    const isGroupB = prng() < 0.45;
    const protected_group = isGroupB
      ? 'Group B (Protected Cohort)'
      : 'Group A (Reference / Majority)';
    
    const group_label = isGroupB
      ? groupBLabels[Math.floor(prng() * groupBLabels.length)]
      : 'Established Majority Demographic';
      
    const proxy_group = proxyGroups[Math.floor(prng() * proxyGroups.length)];

    const account_tenure_months = isGroupB
      ? Math.floor(prng() * 36) + 3 // newer accounts for Group B
      : Math.floor(prng() * 120) + 24;

    const monthly_inflow = isGroupB
      ? Math.floor(prng() * 4500) + 1200
      : Math.floor(prng() * 11000) + 3500;

    const transaction_amount = Math.floor(prng() * 1800) + 40;

    // Ground truth: actual fraud prevalence is ~8-10% in both groups
    // Note: Actual fraud rates are similar, but the model falsely flags Group B more often
    const baseFraudRate = 0.085;
    const actual_outcome = prng() < baseFraudRate ? 1 : 0;

    // Model Raw Probabilities:
    // Notice that Group B experiences synthetic upward probability bias due to historical proxy correlations
    let fraud_prob_raw = actual_outcome === 1
      ? 0.65 + prng() * 0.32
      : 0.05 + prng() * 0.38;

    // Introduce measurable disparity against Group B in the raw model
    if (isGroupB) {
      // Proxy features (like frequent remittance or newer account) shift predicted probability upward
      fraud_prob_raw = Math.min(0.98, fraud_prob_raw + (actual_outcome === 0 ? 0.14 : 0.04));
    }

    const fraud_probability = Math.round(fraud_prob_raw * 1000) / 1000;

    // Baseline Model: Fixed threshold at 0.50
    const baselineThreshold = 0.50;
    const prediction_baseline = fraud_probability >= baselineThreshold ? 1 : 0;

    // Prototype Model (calibrated, with debiased boundary handling)
    // The prototype slightly shifts threshold to minimize false positive disparity
    const prototypeThreshold = isGroupB ? 0.54 : 0.49;
    const prediction_prototype = fraud_probability >= prototypeThreshold ? 1 : 0;

    // False Positives & Negatives for Baseline
    const false_positive = prediction_baseline === 1 && actual_outcome === 0;
    const false_negative = prediction_baseline === 0 && actual_outcome === 1;

    // Operational Harm Modeling:
    let account_action: 'None' | 'Step-Up Auth' | 'Temporary Account Freeze' | 'Transaction Block' = 'None';
    let queue_wait_time = Math.round(prng() * 8 + 3); // baseline 3-11 mins
    let processing_time_sec = Math.round((prng() * 2.5 + 0.8) * 10) / 10;
    let friction_hours = 0;
    let severe_impact = false;
    let redress_eligible = false;

    if (task_type === 'fraud_detection') {
      if (prediction_baseline === 1) {
        if (fraud_probability > 0.75) {
          account_action = 'Temporary Account Freeze';
        } else {
          account_action = 'Transaction Block';
        }
      } else if (fraud_probability > 0.35) {
        account_action = 'Step-Up Auth';
      }

      // If unjustified freeze (False Positive resulting in Freeze)
      if (false_positive && account_action === 'Temporary Account Freeze') {
        // Group B experiences longer resolution times due to lack of private banking concierge
        friction_hours = isGroupB ? Math.round(prng() * 18 + 6) : Math.round(prng() * 6 + 2);
        queue_wait_time += isGroupB ? 32 : 12;
        
        // Severe impact: account freeze prevented essential payments or occurred on weekend
        severe_impact = friction_hours > 12 || prng() < 0.22;
        redress_eligible = true;
      } else if (false_positive) {
        friction_hours = Math.round(prng() * 4 + 1);
        queue_wait_time += 15;
      }
    } else {
      // Customer Service Prioritisation Task
      // Service priority assignment:
      // Group B historically deprioritized because of smaller monthly inflows/tenure in rule-based systems
      const service_urgency_score = Math.round((prng() * 0.7 + (actual_outcome === 1 ? 0.3 : 0)) * 100) / 100;
      
      let priority: 'Low' | 'Medium' | 'High' | 'Critical' = 'Medium';
      if (service_urgency_score > 0.8) priority = 'Critical';
      else if (service_urgency_score > 0.55) priority = 'High';
      else if (service_urgency_score > 0.25) priority = 'Medium';
      else priority = 'Low';

      // Rule-based routing artifact: Group A gets VIP expedited lines
      if (!isGroupB && monthly_inflow > 5000) {
        queue_wait_time = Math.round(prng() * 4 + 2); // 2-6 mins
      } else if (isGroupB) {
        queue_wait_time = Math.round(prng() * 24 + 14); // 14-38 mins
        if (queue_wait_time > 25) {
          friction_hours = Math.round(queue_wait_time / 30);
          if (friction_hours >= 2) severe_impact = true;
        }
      }
    }

    // Human-In-The-Loop Override Modeling:
    // Bank officers intervene on high-friction or borderline cases
    let override_decision: 'None' | 'Overruled - Approved' | 'Overruled - Denied' = 'None';
    let override_reason: string | undefined = undefined;
    let underwriter_role: string | undefined = undefined;

    // Approximately 6-8% of cases get human review
    const isReviewedByHuman = (fraud_probability >= 0.42 && fraud_probability <= 0.68) || false_positive || (isGroupB && prng() < 0.05);

    if (isReviewedByHuman && prng() < 0.65) {
      if (prediction_baseline === 1 && actual_outcome === 0) {
        // Human catches the false positive and overrules AI freeze
        override_decision = 'Overruled - Approved';
        override_reason = isGroupB
          ? overrideReasonsGroupB[Math.floor(prng() * overrideReasonsGroupB.length)]
          : overrideReasonsGroupA[Math.floor(prng() * overrideReasonsGroupA.length)];
        underwriter_role = prng() < 0.5 ? 'Senior Fraud Analyst' : 'Customer Risk Officer';
      } else if (prediction_baseline === 0 && actual_outcome === 1 && prng() < 0.35) {
        // Human detects subtle fraud anomaly and overrides to block
        override_decision = 'Overruled - Denied';
        override_reason = 'Unusual rapid-fire micro-transfers detected manually';
        underwriter_role = 'Fraud Operations Lead';
      }
    }

    records.push({
      customer_id,
      task_type,
      protected_group,
      group_label,
      proxy_group,
      account_tenure_months,
      monthly_inflow,
      transaction_amount,
      fraud_probability,
      service_urgency_score: Math.round(prng() * 100) / 100,
      prediction_baseline,
      prediction_prototype,
      actual_outcome,
      service_priority: fraud_probability > 0.75 ? 'Critical' : fraud_probability > 0.5 ? 'High' : 'Medium',
      account_action,
      queue_wait_time,
      processing_time_sec,
      false_positive,
      false_negative,
      friction_hours,
      severe_impact,
      redress_eligible,
      override_decision,
      override_reason,
      underwriter_role,
    });
  }

  return records;
}

// Pre-computed default dataset
export const defaultSyntheticDataset: SyntheticBankingRecord[] = generateSyntheticBankingDataset(1200);
