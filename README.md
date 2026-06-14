# DealRiskMonitoring

A custom engine agent core that helps account managers monitor **deal risk and churn
potential**. It analyzes a natural-language prompt, detects intent, extracts structured
variables, and orchestrates three modules into a manager-ready summary:

1. **Deal Risk Monitoring** — flags accounts as *At Risk* using thresholds
   (engagement `< 30`, no activity in `60+` days, or a stalled deal stage).
2. **Competitive Intelligence** — enriches each account with competitor signals
   (mock stand-in for Bing AI Search / Azure Cognitive Services).
3. **Retention Playbooks** — surfaces a tailored playbook and next step
   (mock stand-in for content in SharePoint/OneDrive via Microsoft Graph).

> This repository contains a **self-contained, testable demo core** that uses a mock
> dataset (`src/data/mockData.js`) in place of live CRM/ATS, Azure, and Microsoft Graph
> integrations, as called for by the hackathon brief. The modules are structured so the
> mock data sources can be swapped for real connectors without changing the orchestration.

## Quick start

```bash
# Run the demo with the canonical prompt
npm run demo

# Or pass your own prompt
npm run demo -- "Give me a retention playbook for Fabrikam"

# Run the test suite
npm test
```

## Example

Prompt: `Show me accounts at risk of churn this quarter`

```
Accounts at Risk:
- Fabrikam (Engagement Score: 15, Stage: Proposal, Risk: high)
  Competitor Intel: Competitor X offering 20% discount on annual contracts
  Recommended Playbook: Emphasize ROI, counter discount with bundled offer
  Next Step: Schedule retention call with Fabrikam
```

## Architecture

| Module | File | Responsibility |
| --- | --- | --- |
| Intent & keywords | `src/intent.js` | Detect intent(s); extract `{company, industry, quarter, riskLevel}` |
| Risk monitoring | `src/riskMonitor.js` | Query CRM (mock) and flag at-risk accounts by threshold |
| Competitive intel | `src/competitiveIntel.js` | Pull competitor/market signals (mock Bing AI Search) |
| Retention playbooks | `src/playbooks.js` | Surface tailored retention playbooks (mock SharePoint) |
| Orchestrator | `src/agent.js` | Route to modules and assemble the result |
| Formatter | `src/formatter.js` | Render a clear, structured, manager-ready summary |
| CLI demo | `src/cli.js` | Run the agent from the command line |
| Mock data | `src/data/mockData.js` | Accounts, competitor intel, playbooks |

## Production integration points

These mock modules map directly to the integrations described in the brief:

- **Microsoft Graph API** → Outlook, Teams, SharePoint, OneDrive (playbooks, outreach)
- **CRM/ATS connectors** → account and deal data (replaces `mockData.accounts`)
- **Bing AI Search (Azure Cognitive Services)** → competitor and market intelligence