import type { RadarItem, SourceCollectionRecord, SourceCollector } from './types.js';

export interface CollectionResult {
  items: RadarItem[];
  sources: SourceCollectionRecord[];
}

export async function collectSourceItems(sources: SourceCollector[]): Promise<CollectionResult> {
  const collected = await Promise.allSettled(sources.map((source) => source.collect()));
  const records: SourceCollectionRecord[] = [];
  const items: RadarItem[] = [];

  collected.forEach((result, index) => {
    const source = sources[index];

    if (!source) {
      return;
    }

    if (result.status === 'fulfilled') {
      items.push(...result.value);
      records.push({
        name: source.name,
        status: 'succeeded',
        itemCount: result.value.length
      });
      return;
    }

    records.push({
      name: source.name,
      status: 'failed',
      itemCount: 0,
      error: result.reason instanceof Error ? result.reason.message : String(result.reason)
    });
  });

  if (records.length > 0 && records.every((record) => record.status === 'failed')) {
    const summary = records.map((record) => `${record.name}: ${record.error}`).join('; ');
    throw new Error(`All radar sources failed: ${summary}`);
  }

  return { items, sources: records };
}
