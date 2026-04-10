import { createHash } from 'node:crypto';
import Parser from 'rss-parser';
import type { RadarItem, SourceCollector } from '../types.js';

export class RssSource implements SourceCollector {
  readonly name = 'rss' as const;
  private readonly parser = new Parser();

  constructor(
    private readonly feeds: string[],
    private readonly limit: number
  ) {}

  async collect(): Promise<RadarItem[]> {
    const feeds = await Promise.all(
      this.feeds.map((feedUrl) => this.parser.parseURL(feedUrl).catch(() => null))
    );

    const items = feeds.flatMap((feed) => feed?.items ?? []).slice(0, this.limit);

    return items
      .filter((item) => item.title && item.link)
      .map((item) => ({
        id: createHash('sha1').update(`${this.name}:${item.link}`).digest('hex'),
        source: this.name,
        title: item.title!,
        url: item.link!,
        summary: item.contentSnippet ?? item.content ?? undefined,
        publishedAt: item.isoDate ?? item.pubDate,
        tags: ['rss']
      }));
  }
}
