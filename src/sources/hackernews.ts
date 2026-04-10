import { createHash } from 'node:crypto';
import type { RadarItem, SourceCollector } from '../types.js';
import { fetchJson } from '../utils/http.js';

interface HnStory {
  id: number;
  title: string;
  url?: string;
  score?: number;
  time?: number;
}

export class HackerNewsSource implements SourceCollector {
  readonly name = 'hackernews' as const;

  constructor(private readonly limit: number) {}

  async collect(): Promise<RadarItem[]> {
    const ids = await fetchJson<number[]>('https://hacker-news.firebaseio.com/v0/topstories.json');
    const selected = ids.slice(0, this.limit);

    const stories = await Promise.all(
      selected.map((id) =>
        fetchJson<HnStory>(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).catch(() => null)
      )
    );

    return stories
      .filter((story): story is HnStory => Boolean(story?.title))
      .map((story) => ({
        id: createHash('sha1').update(`${this.name}:${story.id}`).digest('hex'),
        source: this.name,
        title: story.title,
        url: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
        publishedAt: story.time ? new Date(story.time * 1000).toISOString() : undefined,
        score: story.score,
        tags: ['news', 'engineering']
      }));
  }
}
