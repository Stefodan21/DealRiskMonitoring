// Retention playbooks: stands in for content stored in SharePoint/OneDrive.

import { playbooks } from './data/mockData.js';

/**
 * Get the retention playbook tailored to an industry, falling back to a default.
 * @param {string|null} industry
 * @returns {{ title: string, steps: string[] }}
 */
export function getPlaybook(industry) {
  if (industry && playbooks[industry]) return playbooks[industry];
  return playbooks.default;
}
