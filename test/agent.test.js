import { test } from 'node:test';
import assert from 'node:assert/strict';
import { analyze, respond } from '../src/agent.js';

test('canonical example: surfaces Fabrikam with intel and playbook', () => {
  const result = analyze('Show me accounts at risk of churn this quarter');
  const fabrikam = result.accountsAtRisk.find((i) => i.account.company === 'Fabrikam');
  assert.ok(fabrikam, 'Fabrikam should be present');
  assert.match(fabrikam.intel, /Competitor X/);
  assert.match(fabrikam.playbook.title, /ROI/);
  assert.equal(fabrikam.nextStep, 'Schedule retention call with Fabrikam');
});

test('respond produces a manager-ready summary with required sections', () => {
  const out = respond('Show me accounts at risk of churn this quarter');
  assert.match(out, /Accounts at Risk:/);
  assert.match(out, /Competitor Intel:/);
  assert.match(out, /Recommended Playbook:/);
  assert.match(out, /Next Step:/);
});

test('company-scoped prompt returns only that account', () => {
  const result = analyze('Give me a retention playbook for Fabrikam');
  assert.equal(result.accountsAtRisk.length, 1);
  assert.equal(result.accountsAtRisk[0].account.company, 'Fabrikam');
});

test('empty match renders a friendly message', () => {
  const out = respond('accounts at risk for Q4');
  assert.match(out, /None matched/);
});
