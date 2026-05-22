# Current Priorities

## Active Priorities

| Rank | Priority | Why It Matters | Success Signal |
| --- | --- | --- | --- |
| 1 | Preserve the learning accountability loop | The project is useful only when digests result in tried experiments. | Each saved digest has a follow-up entry and `pnpm run review` surfaces pending work. |
| 2 | Keep local persistence simple and reliable | Current scope explicitly avoids DBs and cloud services. | Outputs, history, state, and logs remain file-backed and inspectable. |
| 3 | Maintain provider flexibility between Groq and OpenAI | The repo may be run with either API key. | Both providers stay documented, configured, and testable. |
| 4 | Make failure modes visible | Silent "nothing new" outcomes hide source or delivery failures. | Source and delivery failures are recorded or surfaced in console warnings. |

## Explicit Non-Priorities

| Non-Priority | Reason | Revisit When |
| --- | --- | --- |
| Database persistence | Local JSON is enough for the current single-user workflow. | Multiple users, concurrent writers, or query-heavy reporting are required. |
| Cloud hosting | The current system is local/manual or cron-driven. | A real deployment target is chosen. |
| More LLM providers | Provider sprawl adds config and test burden. | A provider is needed and can support structured output. |
| Multi-experiment digests | The operating system intentionally forces one experiment. | The accountability loop proves too narrow in repeated use. |

## Current Operational Risks

| Risk | Impact | Current Mitigation |
| --- | --- | --- |
| Local JSON files are mutable by hand | Bad edits can break review/logging commands. | Keep schema simple and fail loudly on unexpected behavior. |
| Source APIs may fail or rate limit | Digest quality drops or runs fail. | Partial failure recording and all-source failure guard. |
| Telegram can fail independently | A user may miss notification while run succeeded. | Delivery status is recorded in history and warned in console. |

## Decision Guidance

When priorities conflict, prefer:

1. preserving digest/history/experiment-log correctness
2. avoiding silent data loss
3. keeping local operation simple
4. provider compatibility
5. optional convenience features
