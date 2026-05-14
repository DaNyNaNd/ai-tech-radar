import type { RadarDigest } from '../types.js';

function escapeHtml(input: string): string {
  return input
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export async function sendTelegramDigest(args: {
  botToken: string;
  chatId: string;
  digest: RadarDigest;
}): Promise<void> {
  const lines: string[] = [];
  lines.push(`<b>AI Tech Radar</b>`);
  lines.push(escapeHtml(args.digest.generatedAt));
  lines.push(`Run: <code>${escapeHtml(args.digest.runId)}</code>`);
  lines.push('');

  args.digest.topSignals.forEach((signal, index) => {
    lines.push(`<b>${index + 1}. ${escapeHtml(signal.title)}</b>`);
    lines.push(`${escapeHtml(signal.whyItMatters)}`);
    lines.push(`<a href="${signal.url}">Open link</a>`);
    lines.push('');
  });

  lines.push(`<b>Try this week:</b> ${escapeHtml(args.digest.tryThisWeek.name)}`);
  lines.push(escapeHtml(args.digest.tryThisWeek.why));
  lines.push(`<b>Workflow fit:</b> ${escapeHtml(args.digest.tryThisWeek.workflowFit)}`);
  lines.push(escapeHtml(args.digest.tryThisWeek.suggestedExperiment));
  lines.push(`<b>Success criteria:</b>`);
  args.digest.tryThisWeek.successCriteria.forEach((criterion, index) => {
    lines.push(`${index + 1}. ${escapeHtml(criterion)}`);
  });
  lines.push(`<b>Guardrail:</b> ${escapeHtml(args.digest.tryThisWeek.guardrail)}`);
  lines.push('');
  lines.push(`<b>Trend:</b> ${escapeHtml(args.digest.trendObservation)}`);

  const response = await fetch(`https://api.telegram.org/bot${args.botToken}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chat_id: args.chatId,
      text: lines.join('\n'),
      parse_mode: 'HTML',
      disable_web_page_preview: true
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Telegram delivery failed: ${response.status} ${body}`);
  }
}
