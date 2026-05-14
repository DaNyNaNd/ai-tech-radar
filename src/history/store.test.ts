import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { HistoryStore } from './store.js';
import type { RadarDigest } from '../types.js';

function digest(runId: string): RadarDigest {
  return {
    runId,
    generatedAt: '2026-05-13T12:00:00.000Z',
    topSignals: [],
    tryThisWeek: {
      name: 'Try the real workflow',
      why: 'It tests the accountability loop.',
      suggestedExperiment: 'Use the radar output on one real task.',
      successCriteria: ['A task was attempted.', 'A keep/discard decision was recorded.'],
      workflowFit: 'During weekly engineering workflow review.',
      guardrail: 'Do not substitute reading for doing.'
    },
    trendObservation: 'No trend in this fixture.',
    discardPile: []
  };
}

test('saving a digest writes history and creates a pending experiment entry', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'radar-history-'));
  const history = new HistoryStore(path.join(root, 'history'), path.join(root, 'experiment-log.json'));

  await history.saveDigest(digest('run-1'));

  const digests = await history.listDigests();
  assert.equal(digests.length, 1);
  assert.equal(digests[0]?.runId, 'run-1');

  const pending = await history.getPendingEntries();
  assert.equal(pending.length, 1);
  assert.equal(pending[0]?.experimentName, 'Try the real workflow');
});

test('updating an experiment preserves immutable run metadata', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'radar-history-'));
  const history = new HistoryStore(path.join(root, 'history'), path.join(root, 'experiment-log.json'));

  await history.saveDigest(digest('run-2'));
  const updated = await history.updateExperimentLog('run-2', {
    didExercise: true,
    wrotePost: false,
    integratedIntoWorkflow: true,
    resultRating: 4,
    notes: 'Worth keeping.',
    runId: 'changed',
    experimentName: 'changed'
  });

  assert.equal(updated.runId, 'run-2');
  assert.equal(updated.experimentName, 'Try the real workflow');
  assert.equal(updated.didExercise, true);
  assert.equal(updated.resultRating, 4);
});
