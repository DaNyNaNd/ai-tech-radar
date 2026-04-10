import { z } from 'zod';

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default('gpt-5.4-mini'),
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
  OUTPUT_MODE: z.enum(['console', 'telegram']).default('console')
});

export type AppConfig = z.infer<typeof EnvSchema> & {
  rssFeeds: string[];
};

export function getConfig(): AppConfig {
  const parsed = EnvSchema.parse(process.env);

  return {
    ...parsed,
    rssFeeds: parsed.RSS_FEEDS.split(',').map((feed) => feed.trim()).filter(Boolean)
  };
}
