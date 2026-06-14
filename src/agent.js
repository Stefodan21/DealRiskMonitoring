// Orchestrator: ties intent detection, risk monitoring, competitive intel, and
// retention playbooks into a single manager-ready analysis.

import { detectIntent, extractKeywords, Intent } from './intent.js';
import { findAtRiskAccounts } from './riskMonitor.js';
import { summarizeIntel } from './competitiveIntel.js';
import { getPlaybook } from './playbooks.js';
import { formatSummary } from './formatter.js';

/**
 * Analyze an account manager prompt and produce a structured result.
 * @param {string} prompt
 * @returns {import('./formatter.js').AnalysisResult}
 */
export function analyze(prompt) {
  const intents = detectIntent(prompt);
  const keywords = extractKeywords(prompt);

  const wantsIntel = intents.includes(Intent.COMPETITIVE_INTEL) || intents.includes(Intent.RISK_MONITORING);
  const wantsPlaybook = intents.includes(Intent.RETENTION_PLAYBOOK) || intents.includes(Intent.RISK_MONITORING);

  const atRisk = findAtRiskAccounts(keywords);

  const accountsAtRisk = atRisk.map((account) => {
    const intel = wantsIntel ? summarizeIntel(account.industry) : null;
    const playbook = wantsPlaybook ? getPlaybook(account.industry) : null;
    const nextStep = `Schedule retention call with ${account.company}`;
    return { account, intel, playbook, nextStep };
  });

  return { intents, keywords, accountsAtRisk };
}

/**
 * Analyze a prompt and return a manager-ready string summary.
 * @param {string} prompt
 * @returns {string}
 */
export function respond(prompt) {
  return formatSummary(analyze(prompt));
}
