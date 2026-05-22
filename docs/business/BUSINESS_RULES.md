# Business Rules

This file is the highest-authority source for product behavior in `ai-tech-radar`.

## Product Summary

- Product: Local AI/software engineering technology radar.
- Primary user: Daniel / an engineer using the digest to choose small workflow experiments.
- Core value: Turn noisy technical signals into one concrete experiment and an accountable follow-up record.
- Critical workflow: collect signals -> summarize digest -> persist output -> record experiment -> review/log outcome.

## Rule Catalog

| ID | Rule | Applies To | Enforcement | Test Coverage |
| --- | --- | --- | --- | --- |
| BR-001 | The digest must prefer actionable engineering takeaways over broad news summaries. | `src/summarizer.ts` | Prompt and structured output schema | Indirect via summarizer schema tests if added; currently a review concern. |
| BR-002 | Every completed digest must create or preserve a matching experiment-log entry. | `src/history/store.ts` | `HistoryStore.saveDigest()` calls `ensureExperimentEntry()` | `src/history/store.test.ts` |
| BR-003 | A run is complete only after digest history and experiment ledger persistence succeed. | `src/index.ts`, `src/history/store.ts` | delivery result is attached before `saveDigest()`; state is marked seen afterward | `src/run.test.ts`, `src/history/store.test.ts` |
| BR-004 | Source dedupe state must not mark items seen until summarization and history persistence succeed. | `src/index.ts`, `src/utils/state.ts` | `state.markSeen(items)` runs after `history.saveDigest(digest)` | `src/utils/state.test.ts`, `src/run.test.ts` |
| BR-005 | If every source collector fails, the run must fail before summarization and before state writes. | `src/run.ts` | `collectSourceItems()` throws when all records failed | `src/run.test.ts` |
| BR-006 | Partial source failures may continue, but failed source details must be recorded in the saved digest. | `src/run.ts`, `src/types.ts` | source records attach to `digest.sources` | `src/run.test.ts` |
| BR-007 | Telegram is notification-only; delivery failure must be recorded but must not fail an otherwise persisted run. | `src/index.ts`, `src/deliveries/telegram.ts` | `deliverDigest()` returns failed `DeliveryRecord` instead of throwing | Covered through run behavior tests when delivery is mocked; add coverage if changing delivery. |
| BR-008 | Follow-up tools must work without LLM provider credentials. | `src/cli/review.ts`, `src/cli/log-action.ts`, `src/config.ts` | use `getStorageConfig()` rather than full `getConfig()` | `pnpm run review`; add CLI tests if behavior expands. |
| BR-009 | Each run must persist the rendered human-readable digest output locally. | `src/deliveries/console.ts`, `src/history/output-store.ts`, `src/index.ts` | `formatDigest()` output is written to `OUTPUT_LOG_DIR/<runId>.txt` before dedupe state is marked seen | `src/deliveries/console.test.ts`, `src/history/output-store.test.ts` |

## Domain Invariants

- `RadarDigest.runId` is the file identity for `data/history/<runId>.json`.
- `ExperimentLogEntry.runId` must match exactly one digest run.
- `generatedAt` must be an ISO timestamp.
- `resultRating` must be `1`, `2`, `3`, `4`, `5`, or `null`.
- Runtime data is local file-backed state; do not introduce a database or cloud persistence without approval.
- Rendered output logs are local runtime data and should remain under the configured `OUTPUT_LOG_DIR`.

## Sensitive Data Rules

- Never commit `.env`, API keys, Telegram chat IDs, or tokens.
- Do not print provider keys, Telegram tokens, or raw secret-bearing environment values.
- Generated digest content may include public URLs and summaries; do not add private research sources without documenting privacy expectations.

## Open Business Questions

| Question | Impact |
| --- | --- |
| Should generated digest history ever be committed as examples? | Affects whether `data/history/*.json` becomes fixtures or remains local runtime data. |
| What cadence should be considered healthy: daily, weekly, or ad hoc? | Affects future scheduling and notification choices. |
