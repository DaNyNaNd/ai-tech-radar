import type { RadarDigest } from '../types.js';

export function printDigest(digest: RadarDigest): void {
  console.log(`\nAI Tech Radar — ${digest.generatedAt}`);
  console.log(`Run ID: ${digest.runId}\n`);

  if (digest.topSignals.length === 0) {
    console.log('No new signals today.');
  }

  digest.topSignals.forEach((signal, index) => {
    console.log(`${index + 1}. ${signal.title}`);
    console.log(`   Source: ${signal.source}`);
    console.log(`   Why: ${signal.whyItMatters}`);
    console.log(`   Link: ${signal.url}\n`);
  });

  console.log(`Try this week: ${digest.tryThisWeek.name}`);
  console.log(`Why: ${digest.tryThisWeek.why}`);
  console.log(`Workflow fit: ${digest.tryThisWeek.workflowFit}`);
  console.log(`Experiment: ${digest.tryThisWeek.suggestedExperiment}`);
  console.log('Success criteria:');
  digest.tryThisWeek.successCriteria.forEach((criterion, index) => {
    console.log(`   ${index + 1}. ${criterion}`);
  });
  console.log(`Guardrail: ${digest.tryThisWeek.guardrail}\n`);

  console.log(`Trend: ${digest.trendObservation}\n`);

  if (digest.discardPile.length > 0) {
    console.log(`Discarded as noise: ${digest.discardPile.join(', ')}`);
  }
}
