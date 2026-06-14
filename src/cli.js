// Simple CLI demo. Pass a prompt as arguments, or run with no args for the
// canonical example from the problem statement.
//
//   npm run demo -- "Show me accounts at risk of churn this quarter"

import { respond } from './agent.js';

const prompt = process.argv.slice(2).join(' ').trim() ||
  'Show me accounts at risk of churn this quarter';

console.log(`Prompt: ${prompt}\n`);
console.log(respond(prompt));
