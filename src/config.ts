import { z } from 'zod';

const EnvSchema = z.object({
  LLM_PROVIDER: z.enum(['openai', 'groq']).default('openai'),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default('gpt-5.4-mini'),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default('openai/gpt-oss-20b'),
  TELEGRAM_BOT_TOKEN: z.string().optional(),
  TELEGRAM_CHAT_ID: z.string().optional(),
  GITHUB_TOKEN: z.string().optional(),
  MAX_ITEMS_PER_SOURCE: z.coerce.number().int().positive().default(10),
  HN_STORIES_LIMIT: z.coerce.number().int().positive().default(15),
  GITHUB_REPO_SEARCH_QUERY: z
    .string()
    .default('topic:ai pushed:>2026-04-03 stars:>100'),
  RSS_FEEDS: z
    .string()
    .default('https://www.latent.space/feed,https://www.pragmaticengineer.com/rss/'),
  STATE_FILE: z.string().default('./data/state.json'),
  DIGEST_HISTORY_DIR: z.string().default('./data/history'),
  EXPERIMENT_LOG_FILE: z.string().default('./data/experiment-log.json'),
  OUTPUT_LOG_DIR: z.string().default('./data/outputs'),
  OUTPUT_MODE: z.enum(['console', 'telegram']).default('console')
});

export type AppConfig = z.infer<typeof EnvSchema> & {
  rssFeeds: string[];
};

export type StorageConfig = Pick<z.infer<typeof EnvSchema>, 'DIGEST_HISTORY_DIR' | 'EXPERIMENT_LOG_FILE'>;

function parseEnv(): z.infer<typeof EnvSchema> {
  return EnvSchema.parse(process.env);
}

export function getStorageConfig(): StorageConfig {
  const parsed = parseEnv();

  return {
    DIGEST_HISTORY_DIR: parsed.DIGEST_HISTORY_DIR,
    EXPERIMENT_LOG_FILE: parsed.EXPERIMENT_LOG_FILE
  };
}

export function getConfig(): AppConfig {
  const parsed = parseEnv();
  const openAiApiKey = parsed.OPENAI_API_KEY?.trim();
  const groqApiKey = parsed.GROQ_API_KEY?.trim();

  if (parsed.LLM_PROVIDER === 'openai' && !openAiApiKey) {
    throw new Error('OPENAI_API_KEY is required to run the radar.');
  }

  if (parsed.LLM_PROVIDER === 'groq' && !groqApiKey) {
    throw new Error('GROQ_API_KEY is required to run the radar.');
  }

  return {
    ...parsed,
    OPENAI_API_KEY: openAiApiKey,
    GROQ_API_KEY: groqApiKey,
    rssFeeds: parsed.RSS_FEEDS.split(',').map((feed) => feed.trim()).filter(Boolean)
  };
}
