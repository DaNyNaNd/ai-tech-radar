import type { DigestJsonProvider, GenerateJsonArgs } from './types.js';

export class GroqDigestProvider implements DigestJsonProvider {
  constructor(
    private readonly apiKey: string,
    private readonly model: string
  ) {}

  async generateJson(args: GenerateJsonArgs): Promise<string> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: args.systemPrompt
          },
          {
            role: 'user',
            content: args.userPrompt
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: args.schemaName,
            strict: true,
            schema: args.schema
          }
        }
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Groq API request failed: ${response.status} ${body}`);
    }

    const json = await response.json() as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const content = json.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Groq API response did not include message content.');
    }

    return content;
  }
}
