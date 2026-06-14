import unittest

from deal_risk_monitoring import DealRiskMonitoringAgent


class DealRiskMonitoringAgentTests(unittest.TestCase):
    def setUp(self) -> None:
        self.agent = DealRiskMonitoringAgent()

    def test_detects_risk_intent_and_extracts_quarter(self) -> None:
        response = self.agent.handle_prompt("Show me accounts at risk of churn this Q2")

        self.assertIn("risk_monitoring", response.intents)
        self.assertEqual(response.variables["quarter"], "Q2")
        self.assertTrue(any(acct.company == "Fabrikam" for acct in response.accounts_at_risk))

    def test_combined_workflow_includes_competitor_and_playbook(self) -> None:
        response = self.agent.handle_prompt(
            "Show me high risk manufacturing accounts in Q2 with competitor intel and retention playbook"
        )

        self.assertIn("competitive_intelligence", response.intents)
        self.assertIn("retention_strategies", response.intents)
        self.assertIn("Fabrikam", response.competitor_intel)
        self.assertIn("Fabrikam", response.playbook_recommendations)
        self.assertIn("Schedule retention call with Fabrikam", response.next_steps)

    def test_manager_summary_has_required_sections(self) -> None:
        response = self.agent.handle_prompt("Show me accounts at risk of churn this Q2")
        summary = response.to_manager_summary()

        self.assertIn("Accounts at Risk:", summary)
        self.assertIn("Competitor Intel:", summary)
        self.assertIn("Playbook Recommendations:", summary)
        self.assertIn("Actionable Next Steps:", summary)


if __name__ == "__main__":
    unittest.main()
