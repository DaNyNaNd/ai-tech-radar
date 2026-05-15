import assert from 'node:assert/strict';
import test from 'node:test';
import { GroqDigestProvider } from './groq.js';

test('Groq provider requests a schema-constrained chat completion', async () => {
  const previousFetch = globalThis.fetch;
  const calls: Array<{ url: string; init: RequestInit }> = [];

  globalThis.fetch = async (input: string | URL | Request, init?: RequestInit): Promise<Response> => {
    calls.push({ url: String(input), init: init ?? {} });
    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              content: JSON.stringify({ ok: true })
            }
          }
        ]
      }),
      { status: 200, headers: { 'content-type': 'application/json' } }
    );
  };

  try {
    const provider = new GroqDigestProvider('test-key', 'llama-3.1-8b-instant');
    const result = await provider.generateJson({
      systemPrompt: 'system',
      userPrompt: 'user',
      schemaName: 'radar_digest',
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: { ok: { type: 'boolean' } },
        required: ['ok']
      }
    });

    assert.equal(result, '{"ok":true}');
    assert.equal(calls.length, 1);
    assert.equal(calls[0]?.url, 'https://api.groq.com/openai/v1/chat/completions');

    const body = JSON.parse(String(calls[0]?.init.body));
    assert.equal(body.model, 'llama-3.1-8b-instant');
    assert.equal(body.messages[0].role, 'system');
    assert.equal(body.messages[1].content, 'user');
    assert.deepEqual(body.response_format, {
      type: 'json_schema',
      json_schema: {
        name: 'radar_digest',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: { ok: { type: 'boolean' } },
          required: ['ok']
        }
      }
    });
  } finally {
    globalThis.fetch = previousFetch;
  }
});
