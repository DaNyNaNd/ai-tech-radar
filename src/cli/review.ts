import { getStorageConfig } from '../config.js';
import { HistoryStore } from '../history/store.js';

async function main(): Promise<void> {
  const config = getStorageConfig();
  const history = new HistoryStore(config.DIGEST_HISTORY_DIR, config.EXPERIMENT_LOG_FILE);
  const pending = await history.getPendingEntries();

  if (pending.length === 0) {
    console.log('No pending experiments. Miracles do happen.');
    return;
  }

  console.log('Pending experiment follow-up:\n');

  pending.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.experimentName}`);
    console.log(`   Run ID: ${entry.runId}`);
    console.log(`   Generated: ${entry.generatedAt}`);
    console.log(`   Exercise done: ${entry.didExercise}`);
    console.log(`   Post written: ${entry.wrotePost}`);
    console.log(`   Integrated into workflow: ${entry.integratedIntoWorkflow}`);
    console.log(`   Rating: ${entry.resultRating}`);
    if (entry.notes) {
      console.log(`   Notes: ${entry.notes}`);
    }
    console.log('');
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
