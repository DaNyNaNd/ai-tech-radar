import { createHash } from 'node:crypto';
import type { RadarItem, SourceCollector } from '../types.js';
import { fetchJson } from '../utils/http.js';

interface GitHubRepo {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  topics?: string[];
  pushed_at?: string;
}

interface GitHubSearchResponse {
  items: GitHubRepo[];
}

export class GitHubSource implements SourceCollector {
  readonly name = 'github' as const;

  constructor(
    private readonly query: string,
    private readonly limit: number,
    private readonly token?: string
  ) {}

  async collect(): Promise<RadarItem[]> {
    const url = new URL('https://api.github.com/search/repositories');
    url.searchParams.set('q', this.query);
    url.searchParams.set('sort', 'stars');
    url.searchParams.set('order', 'desc');
    url.searchParams.set('per_page', String(this.limit));

    const response = await fetchJson<GitHubSearchResponse>(url.toString(), {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
      }
    });

    return response.items.map((repo) => ({
      id: createHash('sha1').update(`${this.name}:${repo.full_name}:${repo.pushed_at ?? ''}`).digest('hex'),
      source: this.name,
      title: repo.full_name,
      url: repo.html_url,
      summary: repo.description ?? undefined,
      publishedAt: repo.pushed_at,
      score: repo.stargazers_count,
      tags: repo.topics ?? []
    }));
  }
}
