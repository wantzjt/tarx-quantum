# TARX Quantum

**Human Interaction Layer for Quantum Computing on the TARX Mesh Supercomputer**

TARX Quantum provides a direct interface between humans and quantum computing operations running on the TARX distributed mesh network. Each mesh node maps 1:1 to a qubit — no simulation, no abstraction layer.

## Architecture

```
Human → Chat/Dashboard → TARX Quantum API → TARX Mesh (port 11436)
                                                ↓
                                          Node = Qubit
                                     Peer Link = Entanglement Channel
                                    Mesh Query = Gate Operation
```

## Modules

| Route | Purpose |
|---|---|
| `/` | Dashboard — live qubit map, mesh stats, job feed |
| `/chat` | Natural language → quantum circuit execution |
| `/jobs` | Job queue, measurement results, circuit submission |
| `/learn` | Quantum concepts mapped to TARX mesh operations |
| `/roadmap` | AI → Quantum adoption timeline |
| `/mesh` | Node-level qubit state inspection |
| `/api/mesh` | Bridge to tarx-mesh binary |

## Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, TypeScript
- **Quantum SDK**: QPanda-2 (Origin Quantum) — circuit validation
- **Mesh**: tarx-mesh (Rust) — distributed qubit substrate
- **Deploy**: Vercel

## Development

```bash
npm install
npm run dev
```

## Proprietary

Copyright (c) 2026 TARX. All rights reserved. See [LICENSE](./LICENSE).
