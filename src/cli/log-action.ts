import { getStorageConfig } from '../config.js';
import { HistoryStore } from '../history/store.js';

function parseArgs(argv: string[]): Record<string, string> {
  const parsed: Record<string, string> = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1] && !argv[index + 1].startsWith('--') ? argv[index + 1] : 'true';
    parsed[key] = value;

    if (value !== 'true') {
      index += 1;
    }
  }

  return parsed;
}

function parseBool(value: string | undefined): boolean | null | undefined {
  if (value == null) return undefined;
  if (value === 'null') return null;
  if (['yes', 'true', '1'].includes(value.toLowerCase())) return true;
  if (['no', 'false', '0'].includes(value.toLowerCase())) return false;
  throw new Error(`Invalid boolean-like value: ${value}`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const config = getStorageConfig();
  const history = new HistoryStore(config.DIGEST_HISTORY_DIR, config.EXPERIMENT_LOG_FILE);

  const digests = await history.listDigests();
  const latestRunId = digests[0]?.runId;
  const runId = args.run ?? latestRunId;

  if (!runId) {
    throw new Error('No run found. Execute the radar at least once before logging outcomes.');
  }

  const updated = await history.updateExperimentLog(runId, {
    didExercise: parseBool(args.exercise),
    wrotePost: parseBool(args.post),
    integratedIntoWorkflow: parseBool(args.workflow),
    resultRating: args.rating ? Number(args.rating) as 1 | 2 | 3 | 4 | 5 : undefined,
    notes: args.notes ?? undefined,
    completedAt: new Date().toISOString()
  });

  console.log(`Updated run ${updated.runId}`);
  console.log(`Experiment: ${updated.experimentName}`);
  console.log(`Exercise done: ${updated.didExercise}`);
  console.log(`Post written: ${updated.wrotePost}`);
  console.log(`Integrated into workflow: ${updated.integratedIntoWorkflow}`);
  console.log(`Rating: ${updated.resultRating}`);
  console.log(`Notes: ${updated.notes}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
