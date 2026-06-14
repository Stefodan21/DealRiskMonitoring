from __future__ import annotations

from dataclasses import dataclass
import re
from typing import Dict, List, Optional, Set


@dataclass(frozen=True)
class Account:
    company: str
    industry: str
    quarter: str
    engagement_score: int
    days_since_activity: int
    stage: str


@dataclass
class AgentResponse:
    intents: Set[str]
    variables: Dict[str, Optional[str]]
    accounts_at_risk: List[Account]
    competitor_intel: Dict[str, str]
    playbook_recommendations: Dict[str, str]
    next_steps: List[str]

    def to_manager_summary(self) -> str:
        sections: List[str] = []

        sections.append("Accounts at Risk:")
        if not self.accounts_at_risk:
            sections.append("- None found for the current filters")
        else:
            for account in self.accounts_at_risk:
                sections.append(
                    f"- {account.company} (Engagement Score: {account.engagement_score}, Stage: {account.stage})"
                )

        sections.append("\nCompetitor Intel:")
        if not self.competitor_intel:
            sections.append("- No competitor updates found")
        else:
            for company, intel in self.competitor_intel.items():
                sections.append(f"- {company}: {intel}")

        sections.append("\nPlaybook Recommendations:")
        if not self.playbook_recommendations:
            sections.append("- No playbook recommendations available")
        else:
            for company, playbook in self.playbook_recommendations.items():
                sections.append(f"- {company}: {playbook}")

        sections.append("\nActionable Next Steps:")
        for step in self.next_steps:
            sections.append(f"- {step}")

        return "\n".join(sections)


class DealRiskMonitoringAgent:
    """Custom Engine Agent for deal risk and churn monitoring."""

    _accounts: List[Account] = [
        Account("Fabrikam", "Manufacturing", "Q2", 15, 71, "Proposal"),
        Account("Contoso", "Retail", "Q2", 78, 6, "Negotiation"),
        Account("Northwind", "Healthcare", "Q3", 24, 65, "Discovery"),
        Account("Adventure Works", "Manufacturing", "Q2", 29, 42, "Proposal"),
    ]

    _competitive_intel_by_industry: Dict[str, str] = {
        "manufacturing": "Competitor X offering 20% discount",
        "retail": "Competitor Y launched free onboarding for annual plans",
        "healthcare": "Competitor Z released compliance-focused bundle pricing",
    }

    _playbooks: Dict[str, str] = {
        "high": "Escalate executive sponsor, present quantified ROI, and offer a 90-day success plan",
        "medium": "Run objection-handling call, reinforce adoption milestones, and share customer proof points",
        "low": "Maintain cadence with value recap and monitor engagement weekly",
    }

    _company_pattern = re.compile(r"\b(?:for|with)\s+([A-Z][\w]*(?:\s+[A-Z][\w]*)*)")
    _quarter_pattern = re.compile(r"\bQ([1-4])\b", re.IGNORECASE)
    _risk_pattern = re.compile(r"\b(high|medium|low)\s+risk\b", re.IGNORECASE)

    def handle_prompt(self, prompt: str) -> AgentResponse:
        intents = self.detect_intents(prompt)
        variables = self.extract_variables(prompt)

        accounts = self._query_at_risk_accounts(
            company=variables.get("company"),
            industry=variables.get("industry"),
            quarter=variables.get("quarter"),
            risk_level=variables.get("riskLevel"),
        )

        competitor_intel = (
            self._fetch_competitor_intel(accounts)
            if {"risk_monitoring", "competitive_intelligence"} & intents
            else {}
        )
        playbooks = (
            self._build_playbook_recommendations(accounts, variables.get("riskLevel"))
            if {"risk_monitoring", "retention_strategies"} & intents
            else {}
        )
        next_steps = self._build_next_steps(accounts)

        return AgentResponse(
            intents=intents,
            variables=variables,
            accounts_at_risk=accounts,
            competitor_intel=competitor_intel,
            playbook_recommendations=playbooks,
            next_steps=next_steps,
        )

    def detect_intents(self, prompt: str) -> Set[str]:
        lowered = prompt.lower()
        intents: Set[str] = set()

        if any(keyword in lowered for keyword in ["risk", "churn", "at risk"]):
            intents.add("risk_monitoring")
        if any(keyword in lowered for keyword in ["competitor", "competitive", "pricing", "offer", "market"]):
            intents.add("competitive_intelligence")
        if any(keyword in lowered for keyword in ["retain", "retention", "playbook", "objection"]):
            intents.add("retention_strategies")

        if not intents:
            intents.add("risk_monitoring")

        return intents

    def extract_variables(self, prompt: str) -> Dict[str, Optional[str]]:
        lowered = prompt.lower()
        quarter_match = self._quarter_pattern.search(prompt)
        company_match = self._company_pattern.search(prompt)
        risk_match = self._risk_pattern.search(prompt)

        industry = None
        for account in self._accounts:
            if account.industry.lower() in lowered:
                industry = account.industry
                break

        company = company_match.group(1) if company_match else None
        if company:
            company = company.strip(" .,!?")

        return {
            "company": company,
            "industry": industry,
            "quarter": f"Q{quarter_match.group(1)}" if quarter_match else None,
            "riskLevel": risk_match.group(1).lower() if risk_match else None,
        }

    def _query_at_risk_accounts(
        self,
        company: Optional[str],
        industry: Optional[str],
        quarter: Optional[str],
        risk_level: Optional[str],
    ) -> List[Account]:
        filtered: List[Account] = []

        for account in self._accounts:
            if company and account.company.lower() != company.lower():
                continue
            if industry and account.industry.lower() != industry.lower():
                continue
            if quarter and account.quarter.lower() != quarter.lower():
                continue
            if not self._is_at_risk(account, risk_level):
                continue
            filtered.append(account)

        return filtered

    def _is_at_risk(self, account: Account, risk_level: Optional[str]) -> bool:
        at_risk = account.engagement_score < 30 or account.days_since_activity >= 60
        if not at_risk:
            return False

        if risk_level == "high":
            return account.engagement_score < 20 or account.days_since_activity >= 70
        if risk_level == "medium":
            return 20 <= account.engagement_score < 30 or 60 <= account.days_since_activity < 70
        if risk_level == "low":
            return account.engagement_score >= 25 and account.days_since_activity < 60

        return True

    def _fetch_competitor_intel(self, accounts: List[Account]) -> Dict[str, str]:
        intel: Dict[str, str] = {}
        for account in accounts:
            intel[account.company] = self._competitive_intel_by_industry.get(
                account.industry.lower(),
                "No major competitor updates detected",
            )
        return intel

    def _build_playbook_recommendations(
        self, accounts: List[Account], requested_risk_level: Optional[str]
    ) -> Dict[str, str]:
        recommendations: Dict[str, str] = {}
        for account in accounts:
            risk_level = requested_risk_level or self._derive_risk_level(account)
            recommendations[account.company] = self._playbooks[risk_level]
        return recommendations

    def _derive_risk_level(self, account: Account) -> str:
        if account.engagement_score < 20 or account.days_since_activity >= 70:
            return "high"
        if account.engagement_score < 30 or account.days_since_activity >= 60:
            return "medium"
        return "low"

    def _build_next_steps(self, accounts: List[Account]) -> List[str]:
        if not accounts:
            return ["Review filters and broaden the search scope"]
        return [f"Schedule retention call with {account.company}" for account in accounts]
