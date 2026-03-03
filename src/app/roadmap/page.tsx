"use client";

interface Phase {
  id: string;
  name: string;
  timeframe: string;
  status: "completed" | "active" | "upcoming";
  items: { label: string; done: boolean }[];
  insight: string;
}

const PHASES: Phase[] = [
  {
    id: "p1",
    name: "Foundation — Classical Mesh",
    timeframe: "Q3 2025 – Q1 2026",
    status: "completed",
    items: [
      { label: "TARX Mesh binary (Rust) — 15 API endpoints", done: true },
      { label: "Peer discovery & mesh networking", done: true },
      { label: "MCP server integration (9 tools)", done: true },
      { label: "Hardware scoring & device capabilities", done: true },
      { label: "Distributed inference routing", done: true },
    ],
    insight: "The mesh network is live. Each node can discover peers, route work, and report capabilities. This is the substrate.",
  },
  {
    id: "p2",
    name: "Quantum Mapping Layer",
    timeframe: "Q1 2026 – Q2 2026",
    status: "active",
    items: [
      { label: "1:1 node-to-qubit mapping protocol", done: true },
      { label: "Human Interaction Layer (this app)", done: true },
      { label: "Chat-to-quantum NL interface", done: true },
      { label: "QPanda integration for circuit validation", done: false },
      { label: "Mesh quantum gate execution protocol", done: false },
      { label: "Entanglement channel over peer links", done: false },
    ],
    insight: "We're here. The interaction layer is live. Next: wire QPanda circuit validation and implement the gate execution protocol over mesh queries.",
  },
  {
    id: "p3",
    name: "Hybrid AI-Quantum Operations",
    timeframe: "Q2 2026 – Q4 2026",
    status: "upcoming",
    items: [
      { label: "Variational Quantum Eigensolver (VQE) on mesh", done: false },
      { label: "Quantum-enhanced ML kernel integration", done: false },
      { label: "Quantum random number generation", done: false },
      { label: "Hybrid classical-quantum job scheduling", done: false },
      { label: "Origin Quantum cloud bridge (real hardware)", done: false },
    ],
    insight: "Combine AI inference already running on mesh nodes with quantum operations. Nodes dynamically switch between AI and quantum roles based on workload.",
  },
  {
    id: "p4",
    name: "Quantum Error Correction & Scale",
    timeframe: "Q4 2026 – Q2 2027",
    status: "upcoming",
    items: [
      { label: "Surface code mapping across node clusters", done: false },
      { label: "Syndrome detection via mesh health checks", done: false },
      { label: "Logical qubit abstraction (N nodes = 1 logical qubit)", done: false },
      { label: "100+ node mesh quantum operations", done: false },
      { label: "Fault-tolerant circuit compilation", done: false },
    ],
    insight: "Error correction is where mesh redundancy pays off. The same mechanisms that heal node failures can correct quantum errors. This is TARX's structural advantage.",
  },
  {
    id: "p5",
    name: "Quantum-Native Applications",
    timeframe: "Q2 2027+",
    status: "upcoming",
    items: [
      { label: "Quantum-native optimization engine", done: false },
      { label: "Molecular simulation for drug discovery", done: false },
      { label: "Quantum-secured mesh communication", done: false },
      { label: "Quantum AI model training", done: false },
      { label: "Public quantum computing marketplace", done: false },
    ],
    insight: "Endgame: TARX mesh becomes the first distributed quantum computing platform accessible to anyone. The interaction layer built today becomes the standard interface.",
  },
];

const STATUS_STYLES = {
  completed: "border-success/40 bg-success/5",
  active: "border-accent/40 bg-accent/5 quantum-glow",
  upcoming: "border-border bg-surface",
};

const STATUS_DOT = {
  completed: "bg-success",
  active: "bg-accent quantum-pulse",
  upcoming: "bg-foreground/20",
};

export default function RoadmapPage() {
  return (
    <div className="p-6 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          AI → Quantum Roadmap
        </h1>
        <p className="text-sm text-foreground/50 mt-1">
          TARX adoption path from classical mesh to quantum-native computing
        </p>
      </header>

      <div className="space-y-4">
        {PHASES.map((phase, i) => (
          <div
            key={phase.id}
            className={`border rounded-lg p-5 transition-all ${STATUS_STYLES[phase.status]}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-1 shrink-0 ${STATUS_DOT[phase.status]}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground/90">{phase.name}</h3>
                  <span className="text-xs text-foreground/30 font-mono">{phase.timeframe}</span>
                </div>

                <ul className="mt-3 space-y-1.5">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <span className={`text-xs ${item.done ? "text-success" : "text-foreground/20"}`}>
                        {item.done ? "✓" : "○"}
                      </span>
                      <span className={item.done ? "text-foreground/60" : "text-foreground/40"}>
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-3 text-xs text-foreground/40 border-t border-border/50 pt-3">
                  {phase.insight}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-surface border border-accent/20 rounded-lg p-5 quantum-glow">
        <h3 className="font-semibold text-accent-light text-sm">First-Mover Position</h3>
        <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
          Origin Quantum just open-sourced their OS. IBM, Google, and IonQ provide cloud access but keep their OS proprietary.
          TARX is building the human interaction layer NOW — before fault-tolerant hardware arrives.
          When it does, we already have the interface, the mesh substrate, and the user base.
          The window is 12-18 months.
        </p>
      </div>
    </div>
  );
}
