export type SourceName = 'hackernews' | 'github' | 'rss';

export interface RadarItem {
  id: string;
  source: SourceName;
  title: string;
  url: string;
  summary?: string;
  publishedAt?: string;
  score?: number;
  tags?: string[];
}

export interface RadarDigest {
  runId: string;
  generatedAt: string;
  topSignals: Array<{
    title: string;
    whyItMatters: string;
    source: SourceName;
    url: string;
  }>;
  tryThisWeek: {
    name: string;
    why: string;
    suggestedExperiment: string;
    successCriteria: string[];
    workflowFit: string;
    guardrail: string;
  };
  trendObservation: string;
  discardPile: string[];
  sources?: SourceCollectionRecord[];
  delivery?: DeliveryRecord;
}

export interface SourceCollectionRecord {
  name: SourceName;
  status: 'succeeded' | 'failed';
  itemCount: number;
  error?: string;
}

export interface DeliveryRecord {
  mode: 'console' | 'telegram';
  status: 'succeeded' | 'failed';
  attemptedAt: string;
  error?: string;
}

export interface SourceCollector {
  name: SourceName;
  collect(): Promise<RadarItem[]>;
}

export interface ExperimentLogEntry {
  runId: string;
  generatedAt: string;
  experimentName: string;
  didExercise: boolean | null;
  wrotePost: boolean | null;
  integratedIntoWorkflow: boolean | null;
  resultRating: 1 | 2 | 3 | 4 | 5 | null;
  notes: string;
  completedAt?: string;
}
