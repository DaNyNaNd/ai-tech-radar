# Current Status

Evidence reviewed: 2026-07-27.

## Current-state summary

AI Tech Radar is a working local Node.js and TypeScript application with the core collection, structured-digest, persistence, failure-recording, notification, and experiment-follow-up mechanics implemented on `main`. The repository is not yet demonstrably at its intended learning outcome: the current checkout contains no persisted digest history or rendered output and its only experiment-ledger entry is still pending.

The project is therefore **in progress**, not complete.

## Current roadmap stage

**Stage 3 of 4 — `operational-learning-validation`: Validate the learning loop in real use.**

Stages 1 and 2 are complete because their capabilities are present on `main`, documented, and covered by the current 19-test suite. Stage 3 is current because a successful implementation is not the same as a completed learning loop: there is no current evidence of a non-placeholder experiment being performed and rated.

This stage assignment is an evidence-based inference. No GitHub issue, pull request, milestone, or pre-existing roadmap names an active stage.

## Completed work

- Collects signals from Hacker News, GitHub repository search, and configured RSS feeds.
- Deduplicates locally and advances seen-item state only after required persistence.
- Produces a structured digest through either OpenAI or Groq.
- Forces one time-boxed workflow experiment with observable success criteria.
- Saves digest history, rendered text output, and a matching experiment-ledger entry.
- Records partial source failures and non-fatal Telegram delivery failures.
- Fails before summarization when every source collector fails.
- Supports console and optional Telegram delivery.
- Provides `review` and `log-action` CLIs that do not require provider credentials.
- Validates outcome ratings as integers from 1 through 5.
- Documents current business rules, architecture, priorities, testing standards, and operating guardrails.

## Active work

There is no explicit active issue, pull request, or milestone. The reconstructed active outcome is to prove the learning loop through one current end-to-end run and one completed real-task experiment. The checked-in ledger has one pending entry from 2026-05-15 named “Nothing new today”; it does not demonstrate the intended outcome.

## Known gaps

- No current end-to-end run artifacts are present under `data/history/` or `data/outputs/`.
- No completed experiment outcome is present in `data/experiment-log.json`.
- The main orchestration order in `src/index.ts` lacks a dedicated end-to-end regression test.
- `main` has no repository-owned CI workflow. A local `add-lint-ci` branch is unrelated to the current history and is not shipped.
- There are no formal ADRs, releases, or tags.
- The Task 001 implementation is evident in code and commit `b19ad05`, but `.tasks/001/review.md`, `summary.md`, `task.md`, and `test-report.md` are empty.

## Risks

- **Outcome risk:** the radar can become a feed-consumption tool if experiments remain pending.
- **Evidence risk:** ignored local runtime artifacts make historical operation impossible to verify from Git alone.
- **Regression risk:** local tests pass, but no repository-owned CI runs them on pushes or pull requests.
- **Source-quality risk:** current source selection and healthy cadence remain unvalidated.
- **Local-data risk:** mutable JSON files can be edited or removed without an audit trail.

## Recommended next step

Run one credentialed radar cycle with the current source set, verify the matching history/output/ledger artifacts, perform its single suggested experiment on a real engineering task, and record a keep/discard/defer result plus rating with `pnpm run log-action`.

This is the highest-value step because it tests the product outcome directly and creates the minimum evidence needed before changing sources, cadence, or infrastructure.

## Assumptions and uncertainties

- Generated `data/` artifacts are local and ignored, so their absence now does not prove that runs never occurred.
- The pending “Nothing new today” entry may be legacy or intentionally retained; no matching history file is available to establish its full context.
- Stage 4, evidence-based source tuning, is a recommendation derived from current operating questions. It is not a recovered historical commitment.
- The old `add-lint-ci` branch may represent abandoned or experimental work; its intended disposition is not documented.
- Two failed June 2026 GitHub Dependabot runs exist, but their platform-generated workflow is not application CI and does not establish a product failure.

## Evidence

| Evidence                                                                            | What it supports                                                                                                                                                                      |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `README.md`                                                                         | User-facing sources, providers, delivery modes, persistence paths, commands, and run semantics.                                                                                       |
| `docs/business/BUSINESS_RULES.md`                                                   | Highest-authority product outcome and run/accountability invariants.                                                                                                                  |
| `docs/operations/CURRENT_PRIORITIES.md`                                             | Active emphasis on accountability, local persistence, provider flexibility, and visible failures; explicit non-priorities.                                                            |
| `docs/architecture/ARCHITECTURE.md`                                                 | Implemented components, data flow, storage contracts, and local/cron deployment model.                                                                                                |
| `docs/OPERATING_SYSTEM.md`                                                          | One-experiment guardrail, 30–90 minute constraint, success definition, and source/cadence review questions.                                                                           |
| `docs/reviews/TESTING_STANDARDS.md`                                                 | Required verification commands and acknowledged orchestration-test expectations.                                                                                                      |
| `src/index.ts`, `src/run.ts`, `src/summarizer.ts`                                   | Runtime ordering, failure behavior, and experiment-oriented digest schema.                                                                                                            |
| `src/sources/`, `src/llm/`, `src/deliveries/`                                       | Implemented collectors, providers, and output channels.                                                                                                                               |
| `src/history/`, `src/cli/`, `src/utils/state.ts`                                    | History/output persistence, accountability commands, and dedupe state behavior.                                                                                                       |
| `src/**/*.test.ts`                                                                  | Nineteen passing unit tests on 2026-07-27.                                                                                                                                            |
| `data/experiment-log.json`, `data/history/`, `data/outputs/`                        | One pending placeholder-like ledger entry and no current saved history/output evidence.                                                                                               |
| `.tasks/001-output-logging.md`, `.tasks/001/plan.md`                                | Planned rendered-output persistence scope and guardrails.                                                                                                                             |
| Commits `623df02`, `10015bd`, `486672d`, `09bd0b1`, `cd5e30f`, `b19ad05`, `4b8dd06` | Foundation, accountability stabilization, provider support, failure records, output persistence/docs, and rating validation.                                                          |
| Git history and branches inspected 2026-07-27                                       | No tags; old unrelated-history `add-lint-ci` branch is not merged into current `main`.                                                                                                |
| GitHub inspected 2026-07-27                                                         | No issues, milestones, releases, or open pull requests; merged PRs [#1](https://github.com/DaNyNaNd/ai-tech-radar/pull/1) and [#2](https://github.com/DaNyNaNd/ai-tech-radar/pull/2). |
| Verification on 2026-07-27                                                          | `pnpm test` passed 19/19; `pnpm run check` passed; `pnpm run review` ran without provider credentials and reported one pending entry.                                                 |
