import { promises as fs } from 'node:fs';
import path from 'node:path';

export interface RenderedOutputRecord {
  runId: string;
  generatedAt: string;
  renderedAt: string;
  content: string;
}

export interface SavedRenderedOutput {
  filePath: string;
}

export class OutputStore {
  constructor(private readonly outputDir: string) {}

  async saveRenderedOutput(record: RenderedOutputRecord): Promise<SavedRenderedOutput> {
    await fs.mkdir(this.outputDir, { recursive: true });
    const filePath = path.join(this.outputDir, `${record.runId}.txt`);
    const output = [
      `Run ID: ${record.runId}`,
      `Generated at: ${record.generatedAt}`,
      `Rendered at: ${record.renderedAt}`,
      '',
      record.content,
      ''
    ].join('\n');

    await fs.writeFile(filePath, output, 'utf8');
    return { filePath };
  }
}
