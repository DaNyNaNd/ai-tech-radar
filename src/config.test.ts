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
  process.env.LLM_PROVIDER = 'openai';
  delete process.env.OPENAI_API_KEY;
  delete process.env.GROQ_API_KEY;

  try {
    assert.throws(() => getConfig(), /OPENAI_API_KEY is required/);
  } finally {
    process.env = previous;
  }
});

test('main app config accepts Groq without an OpenAI API key', () => {
  const previous = { ...process.env };
  process.env.LLM_PROVIDER = 'groq';
  process.env.GROQ_API_KEY = 'groq-test-key';
  delete process.env.OPENAI_API_KEY;

  try {
    const config = getConfig();
    assert.equal(config.LLM_PROVIDER, 'groq');
    assert.equal(config.GROQ_API_KEY, 'groq-test-key');
  } finally {
    process.env = previous;
  }
});

test('main app config requires a Groq API key when Groq is selected', () => {
  const previous = { ...process.env };
  process.env.LLM_PROVIDER = 'groq';
  delete process.env.GROQ_API_KEY;
  delete process.env.OPENAI_API_KEY;

  try {
    assert.throws(() => getConfig(), /GROQ_API_KEY is required/);
  } finally {
    process.env = previous;
  }
});
