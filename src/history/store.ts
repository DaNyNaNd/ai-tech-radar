import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { ExperimentLogEntry, RadarDigest } from '../types.js';

export class HistoryStore {
  constructor(
    private readonly historyDir: string,
    private readonly experimentLogFile: string
  ) {}

  async saveDigest(digest: RadarDigest): Promise<void> {
    await fs.mkdir(this.historyDir, { recursive: true });
    const filePath = path.join(this.historyDir, `${digest.runId}.json`);
    await fs.writeFile(filePath, JSON.stringify(digest, null, 2), 'utf8');
    await this.ensureExperimentEntry(digest);
  }

  async listDigests(): Promise<RadarDigest[]> {
    try {
      const fileNames = await fs.readdir(this.historyDir);
      const digests = await Promise.all(
        fileNames
          .filter((fileName) => fileName.endsWith('.json'))
          .map(async (fileName) => JSON.parse(await fs.readFile(path.join(this.historyDir, fileName), 'utf8')) as RadarDigest)
      );
      return digests.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
    } catch {
      return [];
    }
  }

  async loadExperimentLog(): Promise<ExperimentLogEntry[]> {
    try {
      return JSON.parse(await fs.readFile(this.experimentLogFile, 'utf8')) as ExperimentLogEntry[];
    } catch {
      return [];
    }
  }

  async updateExperimentLog(runId: string, updates: Partial<ExperimentLogEntry>): Promise<ExperimentLogEntry> {
    const entries = await this.loadExperimentLog();
    const index = entries.findIndex((entry) => entry.runId === runId);

    if (index === -1) {
      throw new Error(`No experiment log entry found for run ID ${runId}`);
    }

    const nextEntry: ExperimentLogEntry = {
      ...entries[index],
      ...updates,
      runId: entries[index].runId,
      generatedAt: entries[index].generatedAt,
      experimentName: entries[index].experimentName
    };

    entries[index] = nextEntry;
    await this.saveExperimentLog(entries);
    return nextEntry;
  }

  async getPendingEntries(): Promise<ExperimentLogEntry[]> {
    const entries = await this.loadExperimentLog();
    return entries.filter(
      (entry) =>
        entry.didExercise !== true ||
        entry.wrotePost !== true ||
        entry.integratedIntoWorkflow !== true ||
        entry.resultRating == null
    );
  }

  private async ensureExperimentEntry(digest: RadarDigest): Promise<void> {
    const entries = await this.loadExperimentLog();
    if (entries.some((entry) => entry.runId === digest.runId)) {
      return;
    }

    entries.push({
      runId: digest.runId,
      generatedAt: digest.generatedAt,
      experimentName: digest.tryThisWeek.name,
      didExercise: null,
      wrotePost: null,
      integratedIntoWorkflow: null,
      resultRating: null,
      notes: ''
    });

    await this.saveExperimentLog(entries);
  }

  private async saveExperimentLog(entries: ExperimentLogEntry[]): Promise<void> {
    await fs.mkdir(path.dirname(this.experimentLogFile), { recursive: true });
    await fs.writeFile(this.experimentLogFile, JSON.stringify(entries, null, 2), 'utf8');
  }
}
