import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { StateStore } from './state.js';

test('filtering new items does not mark them seen', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'radar-state-'));
  const stateFile = path.join(root, 'state.json');
  const store = new StateStore(stateFile);

  const fresh = await store.filterNewItems([{ id: 'item-1' }]);

  assert.deepEqual(fresh, [{ id: 'item-1' }]);
  assert.deepEqual(await store.load(), { seenIds: [] });
});

test('marking items seen persists IDs after a successful run', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'radar-state-'));
  const stateFile = path.join(root, 'state.json');
  const store = new StateStore(stateFile);

  await store.markSeen([{ id: 'item-1' }, { id: 'item-2' }]);

  assert.deepEqual(JSON.parse(await readFile(stateFile, 'utf8')), {
    seenIds: ['item-1', 'item-2']
  });
});
