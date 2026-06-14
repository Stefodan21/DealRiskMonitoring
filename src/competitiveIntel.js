// Competitive intelligence: stands in for Bing AI Search (Azure Cognitive Services).

import { competitorIntel } from './data/mockData.js';

/**
 * Look up competitor signals relevant to an industry.
 * @param {string|null} industry
 * @returns {{ competitor: string, signal: string }[]}
 */
export function getCompetitorIntel(industry) {
  if (!industry) return [];
  return competitorIntel[industry] || [];
}

/**
 * Produce a short human-readable intel summary for an industry.
 * @param {string|null} industry
 * @returns {string|null}
 */
export function summarizeIntel(industry) {
  const intel = getCompetitorIntel(industry);
  if (intel.length === 0) return null;
  return intel.map((i) => `${i.competitor} ${i.signal}`).join('; ');
}
