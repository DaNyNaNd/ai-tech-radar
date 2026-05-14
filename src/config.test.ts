import assert from 'node:assert/strict';
import test from 'node:test';
import { getConfig, getStorageConfig } from './config.js';

test('storage config does not require an OpenAI API key', () => {
  const previous = { ...process.env };
  delete process.env.OPENAI_API_KEY;
  process.env.DIGEST_HISTORY_DIR = './tmp/history';
  process.env.EXPERIMENT_LOG_FILE = './tmp/experiment-log.json';

  try {
    const config = getStorageConfig();
    assert.equal(config.DIGEST_HISTORY_DIR, './tmp/history');
    assert.equal(config.EXPERIMENT_LOG_FILE, './tmp/experiment-log.json');
  } finally {
    process.env = previous;
  }
});

test('main app config requires an OpenAI API key', () => {
  const previous = { ...process.env };
  delete process.env.OPENAI_API_KEY;

  try {
    assert.throws(() => getConfig(), /OPENAI_API_KEY is required/);
  } finally {
    process.env = previous;
  }
});
