# DealRiskMonitoring

Minimal Python implementation of a custom deal risk monitoring agent.

## What it supports
- Intent detection for risk monitoring, competitive intelligence, and retention strategies
- Keyword extraction for `{company, industry, quarter, riskLevel}`
- Mock CRM risk detection (`engagement < 30` or `days since activity >= 60`)
- Mock competitor intelligence by industry
- Retention playbook recommendations
- Manager-ready summary output with actionable next steps

## Run tests
```bash
python -m unittest discover -v
```
