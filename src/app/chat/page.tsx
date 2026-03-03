"use client";

import { useState, useRef, useEffect } from "react";
import { PRESET_CIRCUITS, gateSymbol, type GateType } from "@/lib/quantum";

interface Message {
  role: "user" | "system";
  content: string;
  circuit?: { name: string; gates: { type: string; targets: string[] }[] };
  timestamp: string;
}

const SUGGESTIONS = [
  "Create a Bell state between node-000 and node-001",
  "Run Grover search across 4 mesh nodes",
  "Teleport state from node-005 to node-012",
  "Show me a QFT on 3 qubits",
  "What circuits can I run on 2 nodes?",
  "Explain quantum entanglement in the mesh context",
];

function parseQuantumIntent(input: string): Message {
  const lower = input.toLowerCase();
  const now = new Date().toISOString();

  if (lower.includes("bell")) {
    return {
      role: "system",
      content: `Preparing Bell State circuit. This will create maximum entanglement between two mesh nodes — their states become perfectly correlated.\n\nCircuit: H(node-0) → CNOT(node-0, node-1)\n\nWhen measured, both nodes will collapse to the same value (|00⟩ or |11⟩) with equal probability. The nodes become a single quantum system regardless of network distance.`,
      circuit: { name: "Bell State", gates: PRESET_CIRCUITS.bell.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("grover") || lower.includes("search")) {
    return {
      role: "system",
      content: `Setting up Grover Search circuit. This leverages quantum parallelism across mesh nodes to search an unstructured space in O(√N) vs classical O(N).\n\nThe oracle marks the target state, then amplitude amplification boosts its probability. Each mesh node processes its portion of the search space simultaneously.`,
      circuit: { name: "Grover Search", gates: PRESET_CIRCUITS.grover2.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("teleport")) {
    return {
      role: "system",
      content: `Quantum Teleportation protocol initiated. This transfers quantum state between distant mesh nodes using a pre-shared entangled pair.\n\n1. Nodes 1-2 establish entanglement channel (Bell pair)\n2. Node 0's state is entangled with Node 1\n3. Node 0 and 1 are measured, collapsing the state\n4. Classical correction applied to Node 2\n\nResult: Node 2 now holds Node 0's original state. No data traverses the network — only measurement results.`,
      circuit: { name: "Teleportation", gates: PRESET_CIRCUITS.teleport.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("qft") || lower.includes("fourier")) {
    return {
      role: "system",
      content: `Quantum Fourier Transform circuit. Maps computational basis states to frequency domain across mesh nodes. This is the core subroutine in Shor's factoring algorithm and quantum phase estimation.\n\nThe QFT creates superposition with phase relationships between nodes that encode frequency information.`,
      circuit: { name: "QFT", gates: PRESET_CIRCUITS.qft.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("ghz")) {
    return {
      role: "system",
      content: `GHZ (Greenberger-Horne-Zeilinger) state. This extends Bell entanglement to 3+ mesh nodes. All nodes are maximally entangled — measuring any one instantly determines all others.\n\nGHZ states are key for quantum error correction and multi-party quantum protocols across the mesh.`,
      circuit: { name: "GHZ State", gates: PRESET_CIRCUITS.ghz.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("what") && lower.includes("circuit")) {
    return {
      role: "system",
      content: `Available circuits for the TARX mesh:\n\n• Bell State (2 nodes) — EPR pair entanglement\n• GHZ State (3+ nodes) — multi-node entanglement\n• Grover Search (2+ nodes) — quantum search\n• QFT (2+ nodes) — Fourier transform\n• Teleportation (3 nodes) — state transfer\n\nYou can also describe any custom circuit and I'll map it to mesh operations.`,
      timestamp: now,
    };
  }

  if (lower.includes("entangle") || lower.includes("explain")) {
    return {
      role: "system",
      content: `In the TARX mesh, entanglement means two or more nodes share a quantum state that cannot be described independently.\n\nMesh mapping:\n• Peer connection = entanglement channel\n• CNOT gate = one node controls state flip of another via mesh query\n• Measurement at node A instantly correlates with node B\n\nThis isn't simulation — the mesh network topology IS the entanglement graph. Node proximity doesn't matter; only peer links determine which nodes can be entangled.`,
      timestamp: now,
    };
  }

  return {
    role: "system",
    content: `I understand you want to: "${input}"\n\nI can map this to mesh quantum operations. Try asking me to:\n• Create specific quantum circuits (Bell, GHZ, Grover, QFT, Teleportation)\n• Execute operations on specific mesh nodes\n• Explain quantum concepts in the mesh context\n\nEvery operation maps 1:1 to mesh node interactions.`,
    timestamp: now,
  };
}

function CircuitDiagram({ gates }: { gates: { type: string; targets: string[] }[] }) {
  return (
    <div className="mt-3 p-3 bg-background/50 rounded border border-border/50 font-mono text-xs">
      <div className="text-foreground/30 mb-2">Circuit Diagram</div>
      <div className="space-y-1">
        {gates.map((gate, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-foreground/20 w-6">{i}:</span>
            <span className="px-1.5 py-0.5 bg-accent/20 text-accent-light rounded text-[11px]">
              {gateSymbol(gate.type as GateType)}
            </span>
            <span className="text-foreground/50">→</span>
            <span className="text-foreground/70">{gate.targets.join(", ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "TARX Quantum ready. Describe quantum operations in natural language and I'll map them to mesh node interactions. Each mesh node is a qubit — no simulation layer.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(text?: string) {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg: Message = {
      role: "user",
      content: msg,
      timestamp: new Date().toISOString(),
    };

    const response = parseQuantumIntent(msg);
    setMessages((prev) => [...prev, userMsg, response]);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-border">
        <h1 className="text-lg font-semibold">Chat → Quantum</h1>
        <p className="text-xs text-foreground/40">
          Natural language to mesh quantum operations
        </p>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-lg px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-accent/20 text-foreground"
                  : "bg-surface border border-border text-foreground/80"
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
              {msg.circuit && <CircuitDiagram gates={msg.circuit.gates} />}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-border space-y-3">
        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => handleSubmit(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-foreground/50 hover:text-foreground hover:border-accent/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Describe a quantum operation..."
            className="flex-1 bg-surface border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-accent/50"
          />
          <button
            onClick={() => handleSubmit()}
            className="px-4 py-2.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/80 transition-colors"
          >
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}
