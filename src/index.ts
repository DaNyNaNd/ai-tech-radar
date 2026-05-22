import { getConfig } from './config.js';
import { formatDigest, printDigest } from './deliveries/console.js';
import { sendTelegramDigest } from './deliveries/telegram.js';
import { OutputStore } from './history/output-store.js';
import { HistoryStore } from './history/store.js';
import { GitHubSource } from './sources/github.js';
import { HackerNewsSource } from './sources/hackernews.js';
import { RssSource } from './sources/rss.js';
import { createDigestProvider } from './llm/provider.js';
import { collectSourceItems } from './run.js';
import { DigestSummarizer } from './summarizer.js';
import type { AppConfig } from './config.js';
import type { DeliveryRecord, RadarDigest } from './types.js';
import { StateStore } from './utils/state.js';

async function deliverDigest(config: AppConfig, digest: RadarDigest): Promise<DeliveryRecord> {
  const attemptedAt = new Date().toISOString();

  if (config.OUTPUT_MODE === 'telegram') {
    if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
      return {
        mode: 'telegram',
        status: 'failed',
        attemptedAt,
        error: 'TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required for telegram output.'
      };
    }

    try {
      await sendTelegramDigest({
        botToken: config.TELEGRAM_BOT_TOKEN,
        chatId: config.TELEGRAM_CHAT_ID,
        digest
      });
      return { mode: 'telegram', status: 'succeeded', attemptedAt };
    } catch (error) {
      return {
        mode: 'telegram',
        status: 'failed',
        attemptedAt,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  printDigest(digest);
  return { mode: 'console', status: 'succeeded', attemptedAt };
}

async function main(): Promise<void> {
  const config = getConfig();
  const state = new StateStore(config.STATE_FILE);
  const history = new HistoryStore(config.DIGEST_HISTORY_DIR, config.EXPERIMENT_LOG_FILE);
  const outputs = new OutputStore(config.OUTPUT_LOG_DIR);

  const sources = [
    new HackerNewsSource(config.HN_STORIES_LIMIT),
    new GitHubSource(config.GITHUB_REPO_SEARCH_QUERY, config.MAX_ITEMS_PER_SOURCE, config.GITHUB_TOKEN),
    new RssSource(config.rssFeeds, config.MAX_ITEMS_PER_SOURCE)
  ];

  const { items, sources: sourceResults } = await collectSourceItems(sources);
  const freshItems = await state.filterNewItems(items);

  const summarizer = new DigestSummarizer(createDigestProvider(config));
  const digest = await summarizer.summarize(freshItems);
  digest.sources = sourceResults;
  digest.delivery = await deliverDigest(config, digest);
  await history.saveDigest(digest);
  await outputs.saveRenderedOutput({
    runId: digest.runId,
    generatedAt: digest.generatedAt,
    renderedAt: new Date().toISOString(),
    content: formatDigest(digest)
  });
  await state.markSeen(items);

  sourceResults
    .filter((source) => source.status === 'failed')
    .forEach((source) => console.warn(`Source ${source.name} failed: ${source.error}`));

  if (digest.delivery.status === 'failed') {
    console.warn(`Delivery failed: ${digest.delivery.error}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
