# Testing Standards

Use `pnpm` for every command in this repo.

## Command Inventory

| Layer | Command | When Required |
| --- | --- | --- |
| Unit tests | `pnpm test` | Logic, persistence, provider, source, or CLI changes. |
| Type check | `pnpm run check` | Any TypeScript change. |
| Follow-up CLI smoke test | `pnpm run review` | Changes to storage config, history, experiment log, or CLI behavior. |
| Whitespace check | `git diff --check` | Before handoff when a git diff exists. |
| Live run | `pnpm run run` | Only when credentials and network access are intentionally available. |

## Coverage Expectations

- Changes to `src/history/store.ts` need tests for digest writes, duplicate experiment entries, pending entries, and update behavior.
- Changes to `src/history/output-store.ts` need tests for output directory creation, run-based file naming, and timestamped content.
- Changes to `src/deliveries/console.ts` need formatter tests when rendered digest text changes.
- Changes to `src/run.ts` need tests for successful, partial-failure, and all-failure source collection.
- Changes to `src/index.ts` need tests or a documented strategy for ordering: summarize, deliver, persist, then mark seen.
- Provider changes need schema/output tests and documentation updates.
- CLI changes need coverage or a smoke command proving they work without provider credentials.
- Documentation-only changes should still run `git diff --check` when possible.

## Reporting

Final handoffs must list exact commands run and state any skipped commands. Do not describe unrun live provider checks as verified.
