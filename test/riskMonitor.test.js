import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findAtRiskAccounts, isAtRisk, riskLevelFor } from '../src/riskMonitor.js';

test('flags low-engagement, inactive account as high risk', () => {
  const account = { engagementScore: 15, daysSinceActivity: 72, stage: 'Proposal' };
  assert.equal(isAtRisk(account), true);
  assert.equal(riskLevelFor(account), 'high');
});

test('healthy account is not at risk', () => {
  const account = { engagementScore: 78, daysSinceActivity: 5, stage: 'Closed Won' };
  assert.equal(isAtRisk(account), false);
  assert.equal(riskLevelFor(account), 'low');
});

test('finds Fabrikam among Q2 at-risk accounts', () => {
  const results = findAtRiskAccounts({ quarter: 'Q2' });
  const fabrikam = results.find((a) => a.company === 'Fabrikam');
  assert.ok(fabrikam, 'Fabrikam should be flagged at risk');
  assert.equal(fabrikam.riskLevel, 'high');
});

test('excludes healthy Tailspin Toys from at-risk list', () => {
  const results = findAtRiskAccounts();
  assert.ok(!results.some((a) => a.company === 'Tailspin Toys'));
});

test('filters by company', () => {
  const results = findAtRiskAccounts({ company: 'Fabrikam' });
  assert.equal(results.length, 1);
  assert.equal(results[0].company, 'Fabrikam');
});

test('results are sorted by ascending engagement score', () => {
  const results = findAtRiskAccounts();
  const scores = results.map((a) => a.engagementScore);
  const sorted = [...scores].sort((a, b) => a - b);
  assert.deepEqual(scores, sorted);
});
