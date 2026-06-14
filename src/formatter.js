// Manager-ready formatting of the agent's analysis.

/**
 * @typedef {Object} AnalysisResult
 * @property {string[]} intents
 * @property {Object} keywords
 * @property {Array} accountsAtRisk  Each item: account + intel + playbook + nextStep.
 */

/**
 * Render the analysis into a clear, structured, manager-ready summary.
 * @param {AnalysisResult} result
 * @returns {string}
 */
export function formatSummary(result) {
  const lines = [];
  lines.push('Accounts at Risk:');

  if (result.accountsAtRisk.length === 0) {
    lines.push('- None matched the current filters.');
  }

  for (const item of result.accountsAtRisk) {
    const { account, intel, playbook, nextStep } = item;
    lines.push(
      `- ${account.company} (Engagement Score: ${account.engagementScore}, Stage: ${account.stage}, Risk: ${account.riskLevel})`,
    );
    if (intel) {
      lines.push(`  Competitor Intel: ${intel}`);
    }
    if (playbook) {
      lines.push(`  Recommended Playbook: ${playbook.title}`);
    }
    if (nextStep) {
      lines.push(`  Next Step: ${nextStep}`);
    }
  }

  return lines.join('\n');
}
