import assert from 'node:assert/strict';
import test from 'node:test';
import { collectSourceItems } from './run.js';
import type { SourceCollector } from './types.js';

function source(name: SourceCollector['name'], collect: SourceCollector['collect']): SourceCollector {
  return { name, collect };
}

test('collectSourceItems records partial source failures with successful items', async () => {
  const result = await collectSourceItems([
    source('hackernews', async () => [
      {
        id: 'hn-1',
        source: 'hackernews',
        title: 'HN item',
        url: 'https://example.com/hn'
      }
    ]),
    source('github', async () => {
      throw new Error('GitHub unavailable');
    })
  ]);

  assert.equal(result.items.length, 1);
  assert.deepEqual(result.sources, [
    {
      name: 'hackernews',
      status: 'succeeded',
      itemCount: 1
    },
    {
      name: 'github',
      status: 'failed',
      itemCount: 0,
      error: 'GitHub unavailable'
    }
  ]);
});

test('collectSourceItems fails when all sources fail', async () => {
  await assert.rejects(
    () =>
      collectSourceItems([
        source('hackernews', async () => {
          throw new Error('network blocked');
        }),
        source('github', async () => {
          throw new Error('rate limited');
        })
      ]),
    /All radar sources failed/
  );
});
