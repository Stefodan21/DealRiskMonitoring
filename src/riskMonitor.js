// Deal risk monitoring: query the (mock) CRM and flag accounts at risk of churn.

import { accounts } from './data/mockData.js';

/** Risk thresholds. Mirrors the problem statement (engagement < 30, no activity in 60 days). */
export const THRESHOLDS = {
  engagementScore: 30,
  daysSinceActivity: 60,
  stalledStages: ['Proposal', 'Negotiation'],
};

/**
 * Derive a coarse risk level for an account.
 * @param {import('./data/mockData.js').Account} account
 * @returns {'high'|'medium'|'low'}
 */
export function riskLevelFor(account) {
  const lowEngagement = account.engagementScore < THRESHOLDS.engagementScore;
  const inactive = account.daysSinceActivity >= THRESHOLDS.daysSinceActivity;
  if (lowEngagement && inactive) return 'high';
  if (lowEngagement || inactive) return 'medium';
  return 'low';
}

/**
 * Determine whether an account should be flagged "At Risk".
 * @param {import('./data/mockData.js').Account} account
 * @returns {boolean}
 */
export function isAtRisk(account) {
  return (
    account.engagementScore < THRESHOLDS.engagementScore ||
    account.daysSinceActivity >= THRESHOLDS.daysSinceActivity ||
    THRESHOLDS.stalledStages.includes(account.stage)
  );
}

/**
 * Find at-risk accounts, optionally filtered by extracted keywords.
 * @param {{ company?: string|null, industry?: string|null, quarter?: string|null, riskLevel?: string|null }} [filters]
 * @param {import('./data/mockData.js').Account[]} [dataset]
 * @returns {Array<import('./data/mockData.js').Account & { riskLevel: string, atRisk: boolean }>}
 */
export function findAtRiskAccounts(filters = {}, dataset = accounts) {
  return dataset
    .filter((a) => isAtRisk(a))
    .filter((a) => (filters.company ? a.company === filters.company : true))
    .filter((a) => (filters.industry ? a.industry === filters.industry : true))
    .filter((a) => (filters.quarter ? a.quarter === filters.quarter : true))
    .map((a) => ({ ...a, riskLevel: riskLevelFor(a), atRisk: true }))
    .filter((a) => (filters.riskLevel ? a.riskLevel === filters.riskLevel : true))
    .sort((a, b) => a.engagementScore - b.engagementScore);
}
