import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { OutputStore } from './output-store.js';

test('saving rendered output writes a timestamped run file', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'radar-output-'));
  const store = new OutputStore(path.join(root, 'outputs'));

  const result = await store.saveRenderedOutput({
    runId: 'run-1',
    generatedAt: '2026-05-22T12:00:00.000Z',
    renderedAt: '2026-05-22T12:01:00.000Z',
    content: 'AI Tech Radar text'
  });

  assert.equal(result.filePath, path.join(root, 'outputs', 'run-1.txt'));
  assert.equal(await readFile(result.filePath, 'utf8'), [
    'Run ID: run-1',
    'Generated at: 2026-05-22T12:00:00.000Z',
    'Rendered at: 2026-05-22T12:01:00.000Z',
    '',
    'AI Tech Radar text',
    ''
  ].join('\n'));
});
