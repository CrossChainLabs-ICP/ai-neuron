## Architecture

### System Components
- [**Eliza NNS Plugin**](https://github.com/CrossChainLabs-ICP/plugin-icp-nns) — fetches and filters NNS proposals for downstream processing.
- [**AI Neuron Agent**](https://github.com/CrossChainLabs-ICP/ai-neuron-agent) — retrieves proposals, analyzes associated code/commits, generates structured reports.
- [**AI Neuron Canister**](https://github.com/CrossChainLabs-ICP/ai-neuron/tree/main/src/ai-neuron-backend) — on-chain storage for proposal metadata and AI-generated reports.
- [**Web App**](https://github.com/CrossChainLabs-ICP/ai-neuron/tree/main/src/ai-neuron-frontend) — browses proposals, reports, insights, and decisions.
- [**OC Bot**](https://github.com/CrossChainLabs-ICP/ai-neuron/tree/main/src/ai-neuron-ocbot) — posts new report notifications to OpenChat channels with links to the web app.

### Data Flow (high level)
1. Plugin fetches proposals from NNS (with topic/status filters).
2. Agent selects targets, pulls code diffs, runs AI analysis, formats a report.
3. Agent persists `{proposalID, title, report}` on-chain via the canister.
4. Web app lists proposals & renders decoded report details.
5. OC Bot posts summaries and links when new reports land.
---