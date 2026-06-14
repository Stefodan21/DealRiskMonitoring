// Intent detection and keyword extraction for account manager prompts.

import { accounts } from './data/mockData.js';

/** Intents the agent can route to. */
export const Intent = {
  RISK_MONITORING: 'risk_monitoring',
  COMPETITIVE_INTEL: 'competitive_intel',
  RETENTION_PLAYBOOK: 'retention_playbook',
};

const INTENT_KEYWORDS = {
  [Intent.RISK_MONITORING]: ['risk', 'churn', 'at risk', 'engagement', 'stalled', 'deal stage', 'monitor'],
  [Intent.COMPETITIVE_INTEL]: ['competitor', 'competition', 'rival', 'offer', 'pricing', 'price', 'discount', 'market', 'trend'],
  [Intent.RETENTION_PLAYBOOK]: ['retention', 'playbook', 'strategy', 'objection', 'outreach', 'save', 'retain'],
};

/**
 * Detect which intents a prompt expresses. A prompt may map to multiple intents.
 * Risk monitoring is used as a sensible default when nothing else matches.
 * @param {string} prompt
 * @returns {string[]} ordered list of detected intents
 */
export function detectIntent(prompt) {
  const text = String(prompt || '').toLowerCase();
  const detected = [];
  for (const intent of Object.values(Intent)) {
    if (INTENT_KEYWORDS[intent].some((kw) => text.includes(kw))) {
      detected.push(intent);
    }
  }
  if (detected.length === 0) {
    detected.push(Intent.RISK_MONITORING);
  }
  return detected;
}

const KNOWN_COMPANIES = accounts.map((a) => a.company);
const KNOWN_INDUSTRIES = [...new Set(accounts.map((a) => a.industry))];

/**
 * Extract structured variables from a prompt.
 * @param {string} prompt
 * @returns {{ company: string|null, industry: string|null, quarter: string|null, riskLevel: string|null }}
 */
export function extractKeywords(prompt) {
  const raw = String(prompt || '');
  const text = raw.toLowerCase();

  const company = KNOWN_COMPANIES.find((c) => text.includes(c.toLowerCase())) || null;
  const industry = KNOWN_INDUSTRIES.find((i) => text.includes(i.toLowerCase())) || null;

  const quarterMatch = raw.match(/\bQ([1-4])\b/i);
  const quarter = quarterMatch ? `Q${quarterMatch[1]}` : null;

  let riskLevel = null;
  if (/\bhigh\b/.test(text)) riskLevel = 'high';
  else if (/\bmedium\b/.test(text)) riskLevel = 'medium';
  else if (/\blow\b/.test(text)) riskLevel = 'low';

  return { company, industry, quarter, riskLevel };
}
