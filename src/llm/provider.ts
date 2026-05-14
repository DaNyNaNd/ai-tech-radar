import type { AppConfig } from '../config.js';
import { GroqDigestProvider } from './groq.js';
import { OpenAiDigestProvider } from './openai.js';
import type { DigestJsonProvider } from './types.js';

export function createDigestProvider(config: AppConfig): DigestJsonProvider {
  if (config.LLM_PROVIDER === 'groq') {
    return new GroqDigestProvider(config.GROQ_API_KEY ?? '', config.GROQ_MODEL);
  }

  return new OpenAiDigestProvider(config.OPENAI_API_KEY ?? '', config.OPENAI_MODEL);
}
