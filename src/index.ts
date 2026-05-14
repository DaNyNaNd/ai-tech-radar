import { getConfig } from './config.js';
import { printDigest } from './deliveries/console.js';
import { sendTelegramDigest } from './deliveries/telegram.js';
import { HistoryStore } from './history/store.js';
import { GitHubSource } from './sources/github.js';
import { HackerNewsSource } from './sources/hackernews.js';
import { RssSource } from './sources/rss.js';
import { createDigestProvider } from './llm/provider.js';
import { DigestSummarizer } from './summarizer.js';
import { StateStore } from './utils/state.js';

async function main(): Promise<void> {
  const config = getConfig();
  const state = new StateStore(config.STATE_FILE);
  const history = new HistoryStore(config.DIGEST_HISTORY_DIR, config.EXPERIMENT_LOG_FILE);

  const sources = [
    new HackerNewsSource(config.HN_STORIES_LIMIT),
    new GitHubSource(config.GITHUB_REPO_SEARCH_QUERY, config.MAX_ITEMS_PER_SOURCE, config.GITHUB_TOKEN),
    new RssSource(config.rssFeeds, config.MAX_ITEMS_PER_SOURCE)
  ];

  const collected = await Promise.allSettled(sources.map((source) => source.collect()));
  const items = collected.flatMap((result) => (result.status === 'fulfilled' ? result.value : []));
  const freshItems = await state.filterNewItems(items);

  const summarizer = new DigestSummarizer(createDigestProvider(config));
  const digest = await summarizer.summarize(freshItems);
  await history.saveDigest(digest);

  if (config.OUTPUT_MODE === 'telegram') {
    if (!config.TELEGRAM_BOT_TOKEN || !config.TELEGRAM_CHAT_ID) {
      throw new Error('TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required for telegram output.');
    }

    await sendTelegramDigest({
      botToken: config.TELEGRAM_BOT_TOKEN,
      chatId: config.TELEGRAM_CHAT_ID,
      digest
    });
    return;
  }

  printDigest(digest);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
