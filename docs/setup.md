## Setup

### Prerequisites

* [DFX SDK](https://internetcomputer.org/docs/current/developer-docs/getting-started/install/) (>= 0.28.0)
* [Node.js](https://nodejs.org/) (>= 24.x)
* [Mops](https://mops.one) (Motoko package manager)

### Local Development
```bash
# 1) Start replica
$ dfx start --background

# 2) Deploy core canisters
$ ./deploy-local.sh

# 3) Deploy OC Bot locally
$ ./ocbot-deploy-local.sh

# 4) Frontend
$ cd src/ai-neuron-frontend && npm install && npm run dev
```

### Production
```bash
# Backend & frontend (assets)
$ ./deploy-prod.sh

# OC Bot (requires OpenChat public key)
$ ./ocbot-deploy-prod.sh
```
---