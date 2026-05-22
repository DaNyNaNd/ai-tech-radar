import type { RadarDigest } from '../types.js';

export function formatDigest(digest: RadarDigest): string {
  const lines: string[] = [];

  lines.push(`AI Tech Radar - ${digest.generatedAt}`);
  lines.push(`Run ID: ${digest.runId}`);
  lines.push('');

  if (digest.topSignals.length === 0) {
    lines.push('No new signals today.');
  }

  digest.topSignals.forEach((signal, index) => {
    lines.push(`${index + 1}. ${signal.title}`);
    lines.push(`   Source: ${signal.source}`);
    lines.push(`   Why: ${signal.whyItMatters}`);
    lines.push(`   Link: ${signal.url}`);
    lines.push('');
  });

  lines.push(`Try this week: ${digest.tryThisWeek.name}`);
  lines.push(`Why: ${digest.tryThisWeek.why}`);
  lines.push(`Workflow fit: ${digest.tryThisWeek.workflowFit}`);
  lines.push(`Experiment: ${digest.tryThisWeek.suggestedExperiment}`);
  lines.push('Success criteria:');
  digest.tryThisWeek.successCriteria.forEach((criterion, index) => {
    lines.push(`   ${index + 1}. ${criterion}`);
  });
  lines.push(`Guardrail: ${digest.tryThisWeek.guardrail}`);
  lines.push('');

  lines.push(`Trend: ${digest.trendObservation}`);
  lines.push('');

  if (digest.discardPile.length > 0) {
    lines.push(`Discarded as noise: ${digest.discardPile.join(', ')}`);
  }

  return lines.join('\n');
}

export function printDigest(digest: RadarDigest): void {
  console.log(`\n${formatDigest(digest)}`);
}
