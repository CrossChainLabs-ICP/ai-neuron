# AI-Driven Governance & Security for ICP

**AI-Driven Governance & Security for ICP** is a modular system that enhances Internet Computer (ICP) governance with AI-powered analysis, automated auditing, on-chain reporting, and OpenChat notifications.

- 🔍 Proposal retrieval from the NNS
- 🤖 AI-based verification of code changes in proposals
- 📝 On-chain storage of structured reports
- 💬 OpenChat bot notifications with deep links
- 🌐 Web app to browse reports and reasoning

## System Components
- [**Eliza NNS Plugin**](https://github.com/CrossChainLabs-ICP/plugin-icp-nns) — fetches and filters NNS proposals for downstream processing.
- [**AI Neuron Agent**](https://github.com/CrossChainLabs-ICP/ai-neuron-agent) — retrieves proposals, analyzes associated code/commits, generates structured reports.
- [**AI Neuron Canister**](https://github.com/CrossChainLabs-ICP/ai-neuron/tree/main/src/ai-neuron-backend) — on-chain storage for proposal metadata and AI-generated reports.
- [**Web App**](https://github.com/CrossChainLabs-ICP/ai-neuron/tree/main/src/ai-neuron-frontend) — browses proposals, reports, insights, and decisions.
- [**OC Bot**](https://github.com/CrossChainLabs-ICP/ai-neuron/tree/main/src/ai-neuron-ocbot) — posts new report notifications to OpenChat channels with links to the web app.

## Documentation
- [Developer Guide](#developer-guide)
- [User Guide](#user-guide)
- [Eliza NNS Plugin](#eliza-nns-plugin)
- [AI Neuron Agent & Canister](#ai-neuron)
- [Web App & OC Bot](#webapp-and-oc-bot)

## Developer Guide

The repository includes:

* **Backend canister** (`ai-neuron-backend`) – core Motoko services.
* **Frontend canister** (`ai-neuron-frontend`) – React app for users to interact with the system.
* **Ocbot canister** (`ai-neuron-ocbot`) – handles orchestration, metrics, subscriptions, and event processing.
* **Deployment scripts** – utilities for local and production deployment.

### Data Flow (high level)
1. Plugin fetches proposals from NNS (with topic/status filters).
2. Agent selects targets, pulls code diffs, runs AI analysis, formats a report.
3. Agent persists `{proposalID, title, report}` on-chain via the canister.
4. Web app lists proposals & renders decoded report details.
5. OC Bot posts summaries and links when new reports land.

## Project Structure

```
ai-neuron/
├── canister_ids.json        # Deployed canister identifiers
├── dfx.json                 # DFINITY project configuration
├── mops.toml                # Motoko package manager config
├── deploy-local.sh          # Deploy backend/frontend locally
├── deploy-prod.sh           # Deploy backend/frontend to production
├── ocbot-deploy-local.sh    # Deploy ocbot locally
├── ocbot-deploy-prod.sh     # Deploy ocbot to production
├── ocbot-delete-local.sh    # Remove local ocbot deployment
├── ocbot-delete-prod.sh     # Remove production ocbot deployment
├── src/
│   ├── ai-neuron-backend/   # Motoko backend logic
│   │   ├── main.mo
│   │   └── types.mo
│   ├── ai-neuron-frontend/  # React frontend
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   ├── public/
│   │   └── src/
│   │       ├── App.jsx
│   │       ├── client-icp.js
│   │       ├── config.js
│   │       ├── components/
│   │       └── pages/
│   └── ai-neuron-ocbot/     # Ocbot (OpenChat Bot)
│       ├── definition.mo
│       ├── events.mo
│       ├── main.mo
│       ├── metrics.mo
│       ├── state.mo
│       └── subscriptions.mo
```

## Installation & Setup

### Prerequisites

* [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/) (>= 0.28.0)
* [Node.js](https://nodejs.org/) (>= 24.x)
* [Mops](https://mops.one) (Motoko package manager)

### Clone the repository

```bash
git clone https://github.com/CrossChainLabs-ICP/ai-neuron.git
cd ai-neuron
```

### Install frontend dependencies

```bash
npm install
```

### Local deployment

Start the local replica:

```bash
dfx start --background
```

Deploy backend and frontend canisters:

```bash
./deploy-local.sh
```

Deploy ocbot canister locally:

```bash
./ocbot-deploy-local.sh
```

### Production deployment

```bash
./deploy-prod.sh
./ocbot-deploy-prod.sh
```

To remove ocbot deployments:

```bash
./ocbot-delete-local.sh
./ocbot-delete-prod.sh
```

## Backend (Motoko)

The backend canister (`ai-neuron-backend`) contains:

* **main.mo** – Core logic and service entry points.
* **types.mo** – Type definitions and shared data structures.

## Frontend (React/Vite)

The frontend is located in `src/ai-neuron-frontend` and uses Vite for fast development.

### Key files:

* `client-icp.js` – ICP client integration for canister calls.
* `config.js` – Environment and network configuration.
* `App.jsx` – Root application component.
* `components/` – Shared UI components (`Layout`, `Navbar`).
* `pages/` – Page-level components (`HomePage`, `ReportDetails`).

### Development

Run the frontend in dev mode:

```bash
npm run dev
```

## Ocbot Canister

The **ocbot** is a Motoko-based Open Chat Bot designed to automatically posts a notification in a specific OpenChat group/channel when a new report is published.

Modules include:

* `definition.mo` – Core bot definitions.
* `events.mo` – Event handling logic.
* `metrics.mo` – System metrics and monitoring.
* `state.mo` – Canister state management.
* `subscriptions.mo` – Subscription management.
* `main.mo` – Entry point for the ocbot service.

## Development Workflow

1. Write or modify Motoko code in `src/ai-neuron-backend` or `src/ai-neuron-ocbot`.
2. Run `mops install` if new Motoko dependencies are added.
3. Re-deploy updated canisters with `deploy-local.sh` or `ocbot-deploy-local.sh`.
4. Update React frontend components in `src/ai-neuron-frontend/src`.
5. Run frontend with `npm run dev` for live reloading.

## Contributing

Contributions are welcome! To propose changes:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit changes and push (`git push origin feature-name`).
4. Open a Pull Request.

## Code Reference & Deep Dive

### Backend Canister: `ReportsStorage` (Motoko)

**Source:** `src/ai-neuron-backend/main.mo`, `src/ai-neuron-backend/types.mo`
**Candid:** `src/declarations/ai-neuron-backend/ai-neuron-backend.did`

#### Data Types

```motoko
module Types {
  public type ReportItem = {
    proposalID : Text;
    proposalTitle : Text;
    report : Text;
  };
}
```

#### Public Interface (Candid)

```candid
service ReportsStorage : {
  balance : () -> (nat) query;
  get_full_reports : (vec text) -> (vec ReportItem) query;
  get_report : (text) -> (ReportItem) query;
  get_reports_list : (start: nat, size: nat) -> (vec text) query;
  saveReport : (proposalID: text, proposalTitle: text, report: text) -> (nat);
}
```

#### Responsibilities & Behavior

* **`saveReport`**: Upserts a report by `proposalID`.
* **`get_report`**: Fetches a single `ReportItem` by ID. Return a default empty report if not found.
* **`get_full_reports`**: Batch fetch by IDs (used by frontend to minimize round-trips).
* **`get_reports_list(start,size)`**: Paginates over report IDs (most-recent-first).
* **`balance`**: Returns the canister cycle balance.


#### Usage from JavaScript (DFINITY Agent)

```js
import { HttpAgent } from "@dfinity/agent";
import { createActor } from "../declarations/ai-neuron-backend";

const agent = new HttpAgent({ host: HOST });
const backend = createActor(CANISTER_ID, { agent });

// Create or update a report
await backend.saveReport("42", "My Proposal", JSON.stringify({ audit: {...} }));

// Read a single report
const item = await backend.get_report("42");

// List latest report IDs (page 0, size 20)
const ids = await backend.get_reports_list(0n, 20n);

// Bulk read
const reports = await backend.get_full_reports(ids);
```

---

### Frontend Canister (Assets) & React App

**Location:** `src/ai-neuron-frontend`
**Key files:**

* `src/client-icp.js` – creates a DFINITY `HttpAgent` and backend actor. Provides helpers to fetch lists and full reports.
* `src/pages/HomePage.jsx` – lists reports in a MUI table, showing title, date, issue count, and top severity.
* `src/pages/ReportDetails.jsx` – renders a single report with breakdown charts (Recharts `PieChart`) and severity badges.
* `src/components/Navbar.jsx`, `src/components/Layout.jsx` – layout and navigation.
* `src/config.js` – sets `HOST` and `CANISTER_ID` (toggle dev vs prod).

#### ICP Client Wrapper

```js
// src/client-icp.js 
import { HttpAgent } from "@dfinity/agent";
import { createActor as createMainActor } from "../../declarations/ai-neuron-backend";

export class ClientICP {
  constructor() {
    const agent = new HttpAgent({ host: HOST });
    this.mainActor = createMainActor(CANISTER_ID, { agent });
  }

  async getReportsPage(start = 0n, size = 20n) {
    const ids = await this.mainActor.get_reports_list(start, size);
    return ids.length ? this.mainActor.get_full_reports(ids) : [];
  }

  async getReport(id) { return this.mainActor.get_report(id); }
}
```

**UI Notes**

* Uses **Material UI** for tables and layout.
* Uses **Recharts** for a severity pie chart in `ReportDetails`.
* Computes a **top severity** tag from `audit.issues[].severity` ("high" | "medium" | "low").

**Dev Commands**

```bash
npm run dev     # start Vite dev server
npm run build   # build to dist/
```

---

### OCBot (Motoko Bot for OpenChat)

**Location:** `src/ai-neuron-ocbot`
**External Deps:** `mo:openchat-bot-sdk`, `mo:ecdsa`

**Modules & Roles**

* `definition.mo` – Exposes the bot definition via `Sdk.Definition.serialize` with description, commands, and autonomous permissions (can send #Text messages). Returns JSON over HTTP via a query handler.
* `events.mo` – **Update handler** that validates OpenChat JWT events with `mo:ecdsa` public key and dispatches by event type. Handles installations/uninstallations to keep state in sync. Responds with proper HTTP codes via `ResponseBuilder`.
* `metrics.mo` – Exposes a query endpoint returning JSON metrics: number of API keys and subscriptions (`{"apiKeys": n, "subscriptions": m}`).
* `state.mo` – Defines in-memory state and stable representation:

  ```motoko
  public type State = {
    apiKeyRegistry : ApiKeyRegistry.ApiKeyRegistry;
    subscriptions : Subscriptions.ChatSubscriptions;
  };
  public type StableState = {
    apiKeys : [ApiKeyRegistry.ApiKeyRecord];
    subscriptions : [Subscriptions.Sub];
  };
  ```

* `subscriptions.mo` – Maintains chat subscriptions in a `HashMap<Chat, Record>` with `Timer.recurringTimer` per subscription. Calls the **ReportsStorage** canister (`import ReportsStorage "canister:ai-neuron-backend";`) to fetch and post fresh reports to chats, tracking `sentReports` to avoid duplicates. Caps iterations with `maxIterations` to protect resources.
* `main.mo` – The persistent actor class `OCBot(key : Text)` wires everything:

  * Parses OpenChat public key once (`Sdk.parsePublicKeyOrTrap(key)`).
  * Exposes HTTP routes: `/.well-known/definition`, `/metrics`, `/events`, plus bot commands (e.g., `/subscribe`, `/unsubscribe`).
  * Persists `StableState` across upgrades; reconstructs transient timers on init.

**Lifecycle & Security**

* Validates OpenChat-signed events via ECDSA (`mo:ecdsa`).
* Keeps an **API key registry** keyed by chat/location; prunes on `#Uninstalled` lifecycle events.
* Rebuilds recurring timers after upgrade by iterating stored `subscriptions` and calling `Timer.recurringTimer`.

## Deployment Scripts

* **Backend**

  * `deploy-local.sh` – clears local state (`rm -rf ./.dfx/local`) and deploys backend and frontend.
  * `deploy-prod.sh` – deploys backend and frontend to `--network ic`.
* **Bot (ocbot)**

  * `ocbot-deploy-{local,prod}.sh` – fetches OpenChat public key (`curl https://oc.app/public-key`), creates the bot canister, and sets the key as constructor arg.
  * `ocbot-delete-{local,prod}.sh` – stops & deletes the bot canister (no-withdrawal locally; `--network ic` in prod).

> Note: The ocbot deploy scripts assume availability of the OpenChat public key and pass it to `OCBot` so JWTs can be verified server-side.

## Integration: [**ai‑neuron‑agent**](https://github.com/CrossChainLabs-ICP/ai-neuron-agent) → `saveReport`

This repository is designed to be fed by an external agent app — **ai-neuron-agent** — which discovers proposals/code, generates audits, and persists results on‑chain by calling the backend canister’s `saveReport` method.

### Where `saveReport` is called (agent side)

**File:** [`ai-neuron-agent/src/index.ts`](https://github.com/CrossChainLabs-ICP/ai-neuron-agent/blob/1ca70cd3807ea1803c411236535c0c6876027466/src/index.ts)


### Agent responsibilities (high level)

* **Discover** NNS proposals (via `@crosschainlabs/plugin-icp-nns`).
* **Fetch diffs** (latest vs previous commit) and **analyze** them via OpenAI (`@elizaos/plugin-openai`).
* **Normalize/repair JSON** produced by the model (`fixJson`, `stripJsonFences`).
* Build a `report` object:

  ```ts
  const report = {
    id: proposal.id,
    title: proposal.title,
    summary: proposal.summary,
    topic: proposal.topic,
    repository,
    latestCommit,
    previousCommit,
    audit,         // structured issues, severity, findings
  };
  ```
* **Encode** title/report to Base64 and **persist** via `saveReport(proposalID, base64Title, base64Report)`.
* **Deduplicate** using `haveReport(proposalID)` which calls backend `get_report` and checks the id.

### Data contract alignment

* The backend canister expects a **UTF‑8 JSON payload** encoded as **Base64** for both `proposalTitle` and `report`. The agent’s `objectToBase64` ensures this. On the read path the frontend decodes and parses the stored JSON.
* **Types:**

  ```ts
  // from ai-neuron-backend.did.d.ts
  export interface ReportItem {
    report: string;          // base64 JSON string
    proposalTitle: string;   // base64 JSON string (often just a string)
    proposalID: string;
  }
  ```

### Identity & network

* The agent signs calls with a **Secp256k1** identity loaded from a PEM file, e.g. `~/identity/identity.pem`.
* It can be pointed to **local** (`http://127.0.0.1:4943`) or **mainnet** (`https://ic0.app`) by switching the `HttpAgent.create` `host`.

### End‑to‑end sequence (Agent → Backend → Frontend)

1. **Agent** discovers a proposal and fetches a repo diff.
2. Agent audits the diff (OpenAI) and assembles a structured `report` object.
3. Agent encodes `{ report, title }` as Base64 and calls `saveReport(proposalID, base64Title, base64Report)`.
4. **Backend** upserts the `ReportItem` and updates the ordered id index.
5. **Frontend** lists IDs via `get_reports_list`, bulk reads via `get_full_reports`, and decodes Base64 to render summary, issue counts, and charts.
6. **OCBot** periodically pulls new IDs and posts summaries to subscribed chats.

## User Guide

### What you can do
- Browse latest AI-generated governance reports.
- Inspect proposal titles, summaries, severities, and issue breakdowns.
- Follow OpenChat bot links to deep-dive proposal pages.

### Web App Basics
- **Home**: table of proposals with title, top severity and number of issues.
- **Details**: charts of severities and full audit report.

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

## AI Neuron

### AI Neuron Agent
- Integrates with Eliza runtime.
- Fetches proposals via the NNS plugin.
- Pulls associated code diffs and runs AI verification (vulnerabilities & quality).
- Produces a structured report (JSON) with findings and severities.
- Base64-encodes `{title, report}` and persists to chain via `saveReport`.

### AI Neuron Canister
- Stores `{proposalID, proposalTitle(base64), report(base64)}`.
- Supports pagination (`get_reports_list`) and batch reads (`get_full_reports`).
- Exposes `get_report(id)` for direct access.

### Example
```js
const base64 = (o) => Buffer.from(JSON.stringify(o), 'utf8').toString('base64');
await backend.saveReport(proposal.id, base64(proposal.title), base64(report));
```

## Web App and OC Bot

### Web App
- Lists proposals with title, top severity and number of issues.
- Detail page shows charts (severity breakdown) and the full decoded report.

**Example Web App**
- **URL:** [https://kcyll-maaaa-aaaak-quk5q-cai.icp0.io/](https://kcyll-maaaa-aaaak-quk5q-cai.icp0.io/)

### OC Bot
- Subscribes channels and posts notifications when new reports are stored.
- Each post includes a deep link to the web app.
- Reconstructs timers after upgrades; deduplicates already-sent reports.

**Example AI Neuron OpenChat Bot**
- **Principal:** `fr75p-eiaaa-aaaak-qulya-cai`
- **URL:** [https://fr75p-eiaaa-aaaak-qulya-cai.raw.icp0.io/](https://fr75p-eiaaa-aaaak-qulya-cai.raw.icp0.io/)
- **How to install an OC Bot:** [https://www.youtube.com/watch?v=LmYwBWf_1gQ](https://www.youtube.com/watch?v=LmYwBWf_1gQ)

## License

This project is licensed under the **AGPL-3.0 License**. See the [LICENSE](./LICENSE) file for details.

