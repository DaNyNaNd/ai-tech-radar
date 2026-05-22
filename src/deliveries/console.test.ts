import assert from 'node:assert/strict';
import test from 'node:test';
import { formatDigest } from './console.js';
import type { RadarDigest } from '../types.js';

const digest: RadarDigest = {
  runId: 'run-1',
  generatedAt: '2026-05-22T12:00:00.000Z',
  topSignals: [
    {
      title: 'Typed workflow logs',
      source: 'github',
      whyItMatters: 'They make follow-up easier to review.',
      url: 'https://example.com/workflow-logs'
    }
  ],
  tryThisWeek: {
    name: 'Persist a rendered digest',
    why: 'It keeps the human-readable output inspectable.',
    suggestedExperiment: 'Run the radar once and review the saved text artifact.',
    successCriteria: ['Output file exists.', 'Output text matches the console digest.'],
    workflowFit: 'After a local radar run.',
    guardrail: 'Do not duplicate JSON history.'
  },
  trendObservation: 'Local artifacts are useful for lightweight audits.',
  discardPile: ['generic roundup']
};

test('formatDigest returns the console-rendered digest text', () => {
  const rendered = formatDigest(digest);

  assert.match(rendered, /AI Tech Radar - 2026-05-22T12:00:00.000Z/);
  assert.match(rendered, /Run ID: run-1/);
  assert.match(rendered, /1\. Typed workflow logs/);
  assert.match(rendered, /Success criteria:\n   1\. Output file exists\./);
  assert.match(rendered, /Discarded as noise: generic roundup/);
});
