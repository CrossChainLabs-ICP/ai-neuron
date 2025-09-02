## Eliza NNS Plugin

### Purpose
Fetch and filter NNS governance proposals for downstream AI processing.

### Commands (chat)
- `!proposals` — latest 10 proposals.
- `!proposals <limit>` — specify count.
- `!proposals <limit> topic <id>` — filter by topic id.
- `!proposals <limit> status <id>` — filter by status id.
- `!proposals <limit> topic <id> status <id>` — combine filters.

> **Topics & Status** use numeric IDs as defined by the Governance canister (see `src/topic.ts`, `src/status.ts`).

### How it works
- Creates an HTTP agent to mainnet and a Governance actor using the candid IDL.
- Calls `list_proposals` with optional `exclude_topic` computed from your `topic` filter.
- Calls `get_proposal_info` for each proposal to enrich with topic/status.
- Emits summarized results ready for Agent consumption.

### Key Files
- `src/index.ts` — provider `GOVERNANCE_PROVIDER` handling `!proposals` command and filters.
- `src/topic.ts` — topic numeric mapping.
- `src/status.ts` — status numeric mapping.
- `src/governance/*` — Candid bindings and actor factory.

### Quick Start
```bash
npm install
npm run dev   # hot reload
npm run build
```

---