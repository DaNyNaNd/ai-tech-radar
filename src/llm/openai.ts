import OpenAI from 'openai';
import type { DigestJsonProvider, GenerateJsonArgs } from './types.js';

export class OpenAiDigestProvider implements DigestJsonProvider {
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async generateJson(args: GenerateJsonArgs): Promise<string> {
    const response = await this.client.responses.create({
      model: this.model,
      text: {
        format: {
          type: 'json_schema',
          name: args.schemaName,
          schema: args.schema
        }
      },
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: args.systemPrompt
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: args.userPrompt
            }
          ]
        }
      ]
    });

    return response.output_text;
  }
}
