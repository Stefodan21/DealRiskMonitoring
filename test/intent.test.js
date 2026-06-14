import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectIntent, extractKeywords, Intent } from '../src/intent.js';

test('detects risk monitoring intent', () => {
  const intents = detectIntent('Show me accounts at risk of churn this quarter');
  assert.ok(intents.includes(Intent.RISK_MONITORING));
});

test('detects competitive intelligence intent', () => {
  const intents = detectIntent('What are competitor pricing offers in manufacturing?');
  assert.ok(intents.includes(Intent.COMPETITIVE_INTEL));
});

test('detects retention playbook intent', () => {
  const intents = detectIntent('Give me a retention playbook for Fabrikam');
  assert.ok(intents.includes(Intent.RETENTION_PLAYBOOK));
});

test('defaults to risk monitoring when nothing matches', () => {
  const intents = detectIntent('hello there');
  assert.deepEqual(intents, [Intent.RISK_MONITORING]);
});

test('extracts quarter, company, industry, and risk level', () => {
  const kw = extractKeywords('Show high risk Fabrikam accounts in Manufacturing for Q2');
  assert.equal(kw.quarter, 'Q2');
  assert.equal(kw.company, 'Fabrikam');
  assert.equal(kw.industry, 'Manufacturing');
  assert.equal(kw.riskLevel, 'high');
});

test('returns null fields when nothing is present', () => {
  const kw = extractKeywords('show me everything');
  assert.equal(kw.quarter, null);
  assert.equal(kw.company, null);
  assert.equal(kw.industry, null);
  assert.equal(kw.riskLevel, null);
});
