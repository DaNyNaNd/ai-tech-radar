# AI Tech Radar

A small Node.js + TypeScript service that pulls in software engineering and AI tooling signals, filters duplicate noise, ranks the useful items, and emits a compact digest with one forced experiment.

This version also keeps a local history of digests, creates an experiment accountability log, and includes a playbook so this does not degrade into a fancy reading habit.

## What it does

- Pulls from Hacker News top stories
- Pulls from GitHub repository search
- Pulls from selected RSS feeds
- Deduplicates items using a local state file
- Uses OpenAI to produce a structured digest
- Saves each digest to `data/history`
- Creates and updates an experiment follow-up ledger in `data/experiment-log.json`
- Outputs to console or Telegram

## Quick start

1. Copy `.env.example` to `.env`
2. Fill in at least `OPENAI_API_KEY`
3. Install dependencies
4. Run the radar

```bash
cp .env.example .env
npm install
npm run run
```

## Extra commands

Review unfinished experiments:

```bash
npm run review
```

Log the outcome of the latest experiment:

```bash
npm run log-action -- --exercise yes --post no --workflow yes --rating 4 --notes "Used it for one real repo setup. Worth keeping."
```

Log the outcome for a specific run:

```bash
npm run log-action -- --run 2026-04-10T15-30-00-000Z --exercise yes --post yes --workflow no --rating 3
```

## Data files

- `data/state.json`: dedupe state
- `data/history/*.json`: one file per digest run
- `data/experiment-log.json`: your accountability ledger

## Telegram setup

Set:

- `OUTPUT_MODE=telegram`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## Source tuning

You can control the GitHub slice via `GITHUB_REPO_SEARCH_QUERY`, for example:

```env
GITHUB_REPO_SEARCH_QUERY=topic:llm pushed:>2026-04-03 stars:>50
```

You can also swap RSS feeds:

```env
RSS_FEEDS=https://openai.com/news/rss.xml,https://www.pragmaticengineer.com/rss/
```

## Cron example

Run every morning at 7:30:

```cron
30 7 * * * cd /path/to/ai-tech-radar && /usr/bin/node --env-file=.env --import tsx src/index.ts >> ./radar.log 2>&1
```

## Guardrails

Read `docs/OPERATING_SYSTEM.md` before pretending this is productivity.
