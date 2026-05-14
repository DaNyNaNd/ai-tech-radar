# Agent Notes

This repo is a small Node.js + TypeScript radar that collects engineering and AI tooling signals, asks OpenAI for a structured digest, saves each run, and tracks whether the suggested experiment was actually tried.

## Current Architecture

- Runtime entry point: `src/index.ts`
- OpenAI digest generation: `src/summarizer.ts`
- Source collectors: `src/sources/`
- Console and Telegram delivery: `src/deliveries/`
- Digest history and experiment ledger: `src/history/store.ts`
- Local CLI follow-up tools: `src/cli/review.ts` and `src/cli/log-action.ts`

The app currently supports OpenAI only. Do not add environment variables for Groq, Gemini, Together, or another provider unless the provider is fully wired into the run path and documented.

## Local Commands

Use `pnpm` for this repo. Do not use `npm install` or commit an npm lockfile.

Use these commands before handing off changes:

```bash
pnpm test
pnpm run check
pnpm run review
git diff --check
```

`pnpm run review` and `pnpm run log-action` should remain usable without `.env` and without `OPENAI_API_KEY`; they only inspect or update local JSON state. `pnpm run run` requires `OPENAI_API_KEY`.

## Data Files

- `data/state.json` is local dedupe state and may not exist until the app runs.
- `data/history/*.json` is generated digest history and may not exist until the app runs.
- `data/experiment-log.json` is the local experiment ledger.

Avoid committing generated digest history unless the user explicitly asks for example fixtures.

## Change Guidelines

- Keep the accountability loop intact: every saved digest should create a corresponding experiment-log entry.
- Keep the prompt action-oriented. The suggested experiment should be a 30-90 minute workflow experiment, not reading.
- If adding provider abstraction or summary caching, add tests and update `.env.example`, `README.md`, and this file in the same change.
- Resolve build blockers before making feature changes; TypeScript should compile cleanly.
