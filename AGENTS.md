# AGENTS.md

This repository is a Node.js + TypeScript radar that collects AI/software engineering signals, asks an LLM provider for a structured digest, saves completed runs locally, and keeps an experiment accountability ledger.

Agents must optimize for a useful learning loop, not for more feed consumption.

## Required Reading

Before planning or implementing non-trivial work, read:

1. `docs/business/BUSINESS_RULES.md`
2. `docs/operations/CURRENT_PRIORITIES.md`
3. `docs/architecture/ARCHITECTURE.md`
4. `docs/reviews/TESTING_STANDARDS.md`
5. the task source, such as `.tasks/*.md`

Also read `docs/OPERATING_SYSTEM.md` when work touches digest behavior, experiment tracking, source tuning, or output semantics.

## Current Architecture

- Runtime entry point: `src/index.ts`
- Source orchestration: `src/run.ts`
- Provider-agnostic digest prompt/schema: `src/summarizer.ts`
- LLM providers: `src/llm/`
- Source collectors: `src/sources/`
- Delivery channels: `src/deliveries/`
- Digest history and experiment ledger: `src/history/store.ts`
- Local follow-up CLIs: `src/cli/review.ts` and `src/cli/log-action.ts`
- Dedupe state: `src/utils/state.ts`

## Commands

Use `pnpm`. Do not use `npm install` or commit an npm lockfile.

```bash
pnpm test
pnpm run check
pnpm run review
git diff --check
```

`pnpm run review` and `pnpm run log-action` must remain usable without `.env` and without provider API keys. `pnpm run run` requires an API key for the selected `LLM_PROVIDER`.

## Behavioral Rules

- A run is complete only after summarization succeeds, digest history is written, and the experiment log entry is created.
- The rendered human-readable digest output must be saved under the configured output log directory before source items are marked seen.
- Source items must be marked seen only after digest persistence succeeds.
- If every source collector fails, the run must fail before summarization and before state is written.
- If some source collectors fail, the run may continue with warnings and must record failed source details in history.
- Telegram delivery is notification-only. A Telegram failure must be recorded in digest history but must not fail an otherwise persisted run.
- Each saved digest must create or preserve a matching experiment-log entry.
- Suggested experiments should be 30-90 minute workflow experiments, not passive reading.
- Generated runtime data under `data/` is local state unless a task explicitly turns it into a fixture.

## Approval Gates

Plan and request approval before changing:

- run completion semantics
- dedupe or history file formats
- provider selection or required environment variables
- output delivery contracts
- external service dependencies
- package manager, Node version, or build/test commands
- generated data retention behavior

## Documentation Rules

Update docs in the same change when behavior changes:

- `.env.example` and `README.md` for configuration changes
- `docs/architecture/ARCHITECTURE.md` for component or data-flow changes
- `docs/business/BUSINESS_RULES.md` for learning-loop or product-rule changes
- `docs/operations/CURRENT_PRIORITIES.md` for priority shifts
- `docs/reviews/TESTING_STANDARDS.md` for command or verification changes

If docs and code disagree, state the discrepancy and fix the documentation before relying on it for implementation.

<!-- PROJECT_STATUS_TRACKER_INSTRUCTIONS_START -->
## Project status tracker

- Treat the root `.project-status.json` as the canonical portfolio summary for this repository.
- Update it in the same change whenever the project status, roadmap outcome, stage list, or current stage changes.
- Keep `schemaVersion` at `1`. Keep `roadmap.currentStage` as a one-based index into the ordered `roadmap.stages` array.
- Preserve stable stage `id` values after they are introduced. Change the stage order or roadmap outcome only when the actual roadmap changes.
- When work advances to another stage, update `roadmap.currentStage`. When the final stage is finished, set `status` to `complete` and leave `currentStage` pointing at the final stage.
- Use `status` values only from `in-progress`, `planned`, `paused`, `complete`, or `archived`.
- GitHub issue and pull-request counts are derived by the dashboard; never store those counts in the tracker. Use an optional stage `githubMilestone` only when that milestone really exists.
- If `reviewed` is `false`, inspect the repository's authoritative roadmap and current-status documentation, replace the generated placeholder data, and set `reviewed` to `true`. Do not invent roadmap stages or outcomes when authority is unclear.
<!-- PROJECT_STATUS_TRACKER_INSTRUCTIONS_END -->
