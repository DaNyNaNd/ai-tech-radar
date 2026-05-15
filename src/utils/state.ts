import { promises as fs } from 'node:fs';
import path from 'node:path';

interface StateShape {
  seenIds: string[];
}

export class StateStore {
  constructor(private readonly filePath: string) {}

  async load(): Promise<StateShape> {
    try {
      const raw = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(raw) as StateShape;
    } catch {
      return { seenIds: [] };
    }
  }

  async save(state: StateShape): Promise<void> {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(state, null, 2), 'utf8');
  }

  async filterNewItems<T extends { id: string }>(items: T[]): Promise<T[]> {
    const state = await this.load();
    const seen = new Set(state.seenIds);
    return items.filter((item) => !seen.has(item.id));
  }

  async markSeen<T extends { id: string }>(items: T[]): Promise<void> {
    const state = await this.load();
    const nextSeenIds = [...new Set([...items.map((item) => item.id), ...state.seenIds])].slice(0, 1000);
    await this.save({ seenIds: nextSeenIds });
  }
}
