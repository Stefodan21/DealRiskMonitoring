// Mock datasets used in place of live CRM/ATS, Bing AI Search, and SharePoint/OneDrive
// integrations for the hackathon demo. In production these would be replaced by
// Microsoft Graph API, CRM connectors, and Azure Cognitive Services calls.

/**
 * @typedef {Object} Account
 * @property {string} company
 * @property {string} industry
 * @property {number} engagementScore  Lower scores indicate weaker engagement.
 * @property {string} stage            Current deal stage.
 * @property {number} daysSinceActivity Days since the last recorded activity.
 * @property {string} quarter          Quarter the deal is associated with.
 */

/** @type {Account[]} */
export const accounts = [
  {
    company: 'Fabrikam',
    industry: 'Manufacturing',
    engagementScore: 15,
    stage: 'Proposal',
    daysSinceActivity: 72,
    quarter: 'Q2',
  },
  {
    company: 'Contoso',
    industry: 'Retail',
    engagementScore: 28,
    stage: 'Negotiation',
    daysSinceActivity: 64,
    quarter: 'Q2',
  },
  {
    company: 'Northwind Traders',
    industry: 'Logistics',
    engagementScore: 41,
    stage: 'Discovery',
    daysSinceActivity: 20,
    quarter: 'Q2',
  },
  {
    company: 'Adventure Works',
    industry: 'Manufacturing',
    engagementScore: 22,
    stage: 'Proposal',
    daysSinceActivity: 35,
    quarter: 'Q3',
  },
  {
    company: 'Tailspin Toys',
    industry: 'Retail',
    engagementScore: 78,
    stage: 'Closed Won',
    daysSinceActivity: 5,
    quarter: 'Q2',
  },
];

/**
 * Mock competitive intelligence keyed by industry. Stands in for Bing AI Search
 * (Azure Cognitive Services) results enriching the risk analysis.
 * @type {Record<string, { competitor: string, signal: string }[]>}
 */
export const competitorIntel = {
  Manufacturing: [
    { competitor: 'Competitor X', signal: 'offering 20% discount on annual contracts' },
  ],
  Retail: [
    { competitor: 'Competitor Y', signal: 'bundling free onboarding for new customers' },
  ],
  Logistics: [
    { competitor: 'Competitor Z', signal: 'launching a usage-based pricing tier' },
  ],
};

/**
 * Mock retention playbooks keyed by industry. Stands in for content stored in
 * SharePoint/OneDrive and surfaced via Microsoft Graph.
 * @type {Record<string, { title: string, steps: string[] }>}
 */
export const playbooks = {
  Manufacturing: {
    title: 'Emphasize ROI, counter discount with bundled offer',
    steps: [
      'Quantify realized ROI from current usage',
      'Counter competitor discount with a bundled services offer',
      'Schedule an executive business review',
    ],
  },
  Retail: {
    title: 'Reinforce value, match onboarding incentives',
    steps: [
      'Highlight differentiated features versus competitor bundle',
      'Offer a tailored onboarding accelerator',
      'Share peer success stories in retail',
    ],
  },
  Logistics: {
    title: 'Protect margin, position flexible pricing',
    steps: [
      'Present a flexible pricing option aligned to usage',
      'Demonstrate total cost of ownership advantage',
      'Engage procurement early with a renewal proposal',
    ],
  },
  default: {
    title: 'General retention strategy',
    steps: [
      'Reconnect with the economic buyer',
      'Reconfirm success criteria and value delivered',
      'Propose a concrete next step within two weeks',
    ],
  },
};
