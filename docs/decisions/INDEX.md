# Decisions

No formal ADRs have been recorded yet.

Current durable decisions captured in repo docs:

| Decision | Source |
| --- | --- |
| Use local JSON persistence instead of a database for current scope. | `docs/operations/CURRENT_PRIORITIES.md` |
| Treat Telegram as notification-only. | `docs/business/BUSINESS_RULES.md` |
| Support only OpenAI and Groq until another provider is fully wired and tested. | `docs/architecture/ARCHITECTURE.md` |
| Keep one suggested experiment per digest. | `docs/OPERATING_SYSTEM.md` |

Create a new ADR when changing provider strategy, persistence strategy, run-completion semantics, or delivery semantics.
