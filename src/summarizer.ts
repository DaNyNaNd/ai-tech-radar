import OpenAI from 'openai';
import type { RadarDigest, RadarItem } from './types.js';

export class DigestSummarizer {
  private readonly client: OpenAI;

  constructor(
    apiKey: string,
    private readonly model: string
  ) {
    this.client = new OpenAI({ apiKey });
  }

  async summarize(items: RadarItem[]): Promise<RadarDigest> {
    const runId = new Date().toISOString().replace(/[:.]/g, '-');

    if (items.length === 0) {
      return {
        runId,
        generatedAt: new Date().toISOString(),
        topSignals: [],
        tryThisWeek: {
          name: 'Nothing new today',
          why: 'No unseen items survived the dedupe step.',
          suggestedExperiment: 'Broaden the source filters or run again tomorrow.',
          successCriteria: [
            'Adjust one source or filter instead of doomscrolling elsewhere.',
            'Run the radar again on the next scheduled day.'
          ],
          workflowFit: 'Low; this is a maintenance day, not an exploration day.',
          guardrail: 'Do not replace action with more reading just because the feed was quiet.'
        },
        trendObservation: 'No clear trend because the current run had no new items.',
        discardPile: []
      };
    }

    const input = items.map((item, index) => ({
      index: index + 1,
      source: item.source,
      title: item.title,
      url: item.url,
      summary: item.summary,
      publishedAt: item.publishedAt,
      score: item.score,
      tags: item.tags
    }));

    const response = await this.client.responses.create({
      model: this.model,
      text: {
        format: {
          type: 'json_schema',
          name: 'radar_digest',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              runId: { type: 'string' },
              generatedAt: { type: 'string' },
              topSignals: {
                type: 'array',
                minItems: 0,
                maxItems: 5,
                items: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    title: { type: 'string' },
                    whyItMatters: { type: 'string' },
                    source: { type: 'string', enum: ['hackernews', 'github', 'rss'] },
                    url: { type: 'string' }
                  },
                  required: ['title', 'whyItMatters', 'source', 'url']
                }
              },
              tryThisWeek: {
                type: 'object',
                additionalProperties: false,
                properties: {
                  name: { type: 'string' },
                  why: { type: 'string' },
                  suggestedExperiment: { type: 'string' },
                  successCriteria: {
                    type: 'array',
                    minItems: 2,
                    maxItems: 4,
                    items: { type: 'string' }
                  },
                  workflowFit: { type: 'string' },
                  guardrail: { type: 'string' }
                },
                required: ['name', 'why', 'suggestedExperiment', 'successCriteria', 'workflowFit', 'guardrail']
              },
              trendObservation: { type: 'string' },
              discardPile: {
                type: 'array',
                items: { type: 'string' }
              }
            },
            required: ['runId', 'generatedAt', 'topSignals', 'tryThisWeek', 'trendObservation', 'discardPile']
          }
        }
      },
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: [
                'You are a pragmatic senior software engineer acting as a strict technology filter, not a hype machine.',
                'Your job is to reduce noise, pick practical signals, and force one actionable experiment.',
                'Optimize for tools and ideas that are painkillers, not vitamins.',
                'Prefer credible adoption, workflow impact, durability beyond a one-week trend, and fit for an experienced software engineer who wants practical leverage.',
                'Avoid novelty for novelty\'s sake.',
                'Do not recommend reading as the main action. Recommend a small real experiment that replaces or improves part of a workflow.',
                'The experiment must be finishable in 30 to 90 minutes.',
                'The success criteria must be observable. Examples: replace a real task, produce a tiny artifact, write a short note, or decide keep/discard.',
                'Use this grading rubric internally when choosing the try-this-week recommendation: workflow pain relieved, adoption signal, implementation friction, durability, and learning value.',
                'Be skeptical of AI agent hype and thin wrapper products unless there is clear practical leverage.'
              ].join(' ')
            }
          ]
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: [
                `Run ID: ${runId}`,
                'Create a daily engineering radar digest from these candidate items.',
                'Return at most 5 top signals.',
                'For the try-this-week section, select exactly one experiment tied to a likely workflow improvement.',
                'The guardrail must explain how to avoid passive consumption or overbuilding.',
                'The workflowFit field should state where this would fit in a real engineering workflow.',
                JSON.stringify(input, null, 2)
              ].join('\n\n')
            }
          ]
        }
      ]
    });

    const jsonText = response.output_text;
    return JSON.parse(jsonText) as RadarDigest;
  }
}
