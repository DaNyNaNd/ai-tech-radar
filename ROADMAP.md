# AI Tech Radar Roadmap

Evidence reviewed: 2026-07-27.

## Roadmap outcome

Demonstrate that the local radar can consistently turn selected AI and software-engineering signals into one completed, recorded workflow experiment, then tune its sources and cadence from those results.

The first half of this outcome is grounded in the product rules: the repository exists to turn noisy signals into one concrete experiment and an accountable follow-up record. The final source-tuning step is a reasonable next outcome inferred from `docs/OPERATING_SYSTEM.md`; it is not presented as a prior commitment.

## Status model

- **Complete** means the capability is present on `main`, documented, and supported by repository tests or direct code evidence.
- **In progress** means it is the narrowest current outcome implied by the evidence, even when no issue or milestone tracks it.
- **Planned** means it is a recommended future stage inferred from current product rules. It is not historical scope.

## Stage summary

| #   | Stable ID                         | Stage                                   | Status      |
| --- | --------------------------------- | --------------------------------------- | ----------- |
| 1   | `signal-collection-and-digest`    | Signal collection and structured digest | Complete    |
| 2   | `durable-accountability-loop`     | Durable run and accountability loop     | Complete    |
| 3   | `operational-learning-validation` | Validate the learning loop in real use  | In progress |
| 4   | `evidence-based-source-tuning`    | Tune sources and cadence from outcomes  | Planned     |

## 1. Signal collection and structured digest

**ID:** `signal-collection-and-digest`  
**Status:** Complete

**Goal:** Produce one compact, action-oriented digest from a bounded set of AI and software-engineering signals.

**Scope:**

- collect Hacker News, GitHub repository search, and configured RSS signals;
- filter locally seen items;
- generate a schema-constrained digest with OpenAI or Groq;
- force one 30–90 minute workflow experiment;
- render to the console or send an optional Telegram notification.

**Completion criteria:**

- all three source collectors are wired into the runtime;
- the digest schema contains ranked signals, exactly one experiment, success criteria, a workflow fit, and a guardrail;
- OpenAI and Groq are selectable through documented configuration;
- console and Telegram delivery paths exist.

**Evidence:** `src/index.ts`, `src/sources/`, `src/summarizer.ts`, `src/llm/`, `src/deliveries/`, `README.md`, initial commit `623df02`, and provider commit `486672d`.

## 2. Durable run and accountability loop

**ID:** `durable-accountability-loop`  
**Status:** Complete

**Goal:** Make a successful run inspectable and preserve the link between its digest, rendered output, and follow-up experiment.

**Scope:**

- save digest history and a matching experiment-ledger entry;
- save the rendered human-readable output before source items are marked seen;
- record partial source failures and notification delivery failures;
- fail before summarization when every collector fails;
- provide credential-free `review` and `log-action` follow-up CLIs;
- validate experiment ratings.

**Completion criteria:**

- persistence occurs before dedupe state is advanced;
- each saved digest creates or preserves one experiment entry;
- source and delivery outcomes are recorded without making Telegram a completion dependency;
- rendered output is saved under the configured local output directory;
- unit tests cover the implemented persistence, failure, provider, formatter, dedupe, and rating contracts;
- product, architecture, configuration, and testing docs describe the shipped behavior.

**Evidence:** `src/history/`, `src/run.ts`, `src/utils/state.ts`, `src/cli/`, their tests, `docs/business/BUSINESS_RULES.md`, `docs/architecture/ARCHITECTURE.md`, commits `10015bd`, `09bd0b1`, `cd5e30f`, `b19ad05`, and `4b8dd06`. The Task 001 plan identifies rendered text as the missing artifact; commit `b19ad05` implements it, although the task's review, summary, and test-report files remain empty.

## 3. Validate the learning loop in real use

**ID:** `operational-learning-validation`  
**Status:** In progress

**Goal:** Demonstrate the product outcome with a real signal, a real task, and a recorded keep/discard/defer result.

**Scope:**

- run the current system with intentionally selected sources and a working provider;
- verify that a run creates digest history, rendered output, and one matching experiment entry;
- perform the suggested experiment on a real engineering task within the 30–90 minute guardrail;
- record the outcome and rating with `pnpm run log-action`;
- note source failures, delivery failures, and whether the digest was actionable.

**Completion criteria:**

- at least one current end-to-end run has matching history, rendered output, and experiment-ledger evidence;
- at least one non-placeholder suggested experiment is performed on a real task and has a recorded outcome;
- the evidence is sufficient to make one narrow source or cadence decision;
- no completion claim depends only on a successful test suite or an unread digest.

**Why this is current:** The implementation and 19-test suite support the mechanics, but the current checkout contains no saved history or rendered output and contains one pending ledger entry named “Nothing new today” with no recorded actions or rating. This stage classification is an inference from the product rules and evidence gap; no issue, pull request, or milestone explicitly declares active validation work.

## 4. Tune sources and cadence from outcomes

**ID:** `evidence-based-source-tuning`  
**Status:** Planned

**Goal:** Improve signal quality using completed experiment evidence rather than adding more feed consumption.

**Scope:**

- compare which configured sources produce experiments worth keeping;
- remove or narrow consistently noisy sources before adding new ones;
- choose a sustainable daily, weekly, or ad hoc cadence;
- document the resulting source and cadence decision in the operating or priority docs;
- preserve the one-experiment and local-first contracts.

**Completion criteria:**

- at least one source-filter or cadence decision cites completed experiment outcomes;
- the selected operating cadence is documented;
- `docs/operations/CURRENT_PRIORITIES.md` reflects the next actual priority;
- any configuration change is documented and verified under the repository's approval gates.

**Planning note:** This stage is inferred from the operating-system review questions and the open cadence question in `docs/business/BUSINESS_RULES.md`. The repository contains no historical commitment, issue, or milestone for it.

## Evidence-backed state outside the stage sequence

### Demonstrably implemented

- Local/manual or cron-driven operation with file-backed state.
- Hacker News, GitHub, and RSS collection.
- Local dedupe with post-persistence state advancement.
- OpenAI and Groq structured-output providers.
- Console and optional Telegram delivery.
- Digest history, rendered-output persistence, and experiment-ledger persistence.
- Credential-free review and outcome logging CLIs.
- Partial/all-source failure handling and notification failure recording.
- Nineteen passing unit tests and a passing TypeScript check on 2026-07-27.

### Incomplete or not demonstrated

- A completed real-world experiment outcome is not present in the current checkout.
- The current checkout has no saved files under `data/history/` or `data/outputs/`.
- `src/index.ts` orchestration order is documented and visible in code, but it has no dedicated end-to-end test.
- There is no repository-owned CI workflow on `main`.
- The Task 001 plan exists, but its review, summary, task, and test-report artifacts are empty.

### Explicitly deferred

The current priority and operating documents defer database persistence, cloud hosting, additional LLM providers, and multi-experiment digests. These are not roadmap stages.

### Obsolete or unclear evidence

- The local `add-lint-ci` branch contains a CI proposal, has no common ancestor with the current `main` history, and is not a remote branch. It is not treated as shipped work or a current commitment.
- GitHub has no issues, milestones, releases, or open pull requests. Two pull requests are merged: [#1](https://github.com/DaNyNaNd/ai-tech-radar/pull/1) and [#2](https://github.com/DaNyNaNd/ai-tech-radar/pull/2).
- GitHub shows two failed June 2026 Dependabot platform runs, but no application test workflow. The failures do not demonstrate a current product defect.
- No formal ADRs or release tags exist.

## Assumptions and uncertainties

- Generated runtime data is intentionally local and ignored. Its absence in this checkout does not prove that no historical runs occurred; it only means this checkout cannot demonstrate them.
- “Operational learning validation” is the narrowest defensible current stage because implementation is substantially complete while the outcome remains unproven. It is a reconstruction, not a recovered historical stage name.
- No number of repeated runs or permanent cadence is asserted. The next evidence should be only what is necessary to close one real experiment and support one source or cadence decision.
