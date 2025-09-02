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

---