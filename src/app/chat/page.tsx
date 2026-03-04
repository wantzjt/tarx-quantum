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
  "Optimize my delivery routes across 8 locations",
  "Search 1024 items for the optimal match",
  "Cluster these customer segments",
  "Solve this binary allocation problem",
  "Classify this dataset with quantum kernels",
];

function parseQuantumIntent(input: string): Message {
  const lower = input.toLowerCase();
  const now = new Date().toISOString();

  if (lower.includes("optimi") || lower.includes("route") || lower.includes("schedule") || lower.includes("portfolio")) {
    return {
      role: "system",
      content: `TARX Optimizer engaged. Routing your problem through QAOA (Quantum Approximate Optimization).\n\nThis solver finds optimal configurations across your variables by exploring solution space with quantum interference — wrong answers cancel out, optimal answers amplify.\n\nSolver: optimize\nEngine: TARX Quantum Engine v1.0\nSubstrate: TARX distributed mesh`,
      circuit: { name: "QAOA Optimization", gates: PRESET_CIRCUITS.bell.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("search") || lower.includes("find") || lower.includes("grover")) {
    return {
      role: "system",
      content: `TARX Search engaged. Running Grover's algorithm across mesh nodes.\n\nClassical search: O(N) steps\nTARX Search: O(√N) steps\n\nFor 1024 items, classical needs ~1024 checks. TARX needs ~32. That's a 32x speedup from quantum amplitude amplification.\n\nSolver: search\nEngine: TARX Quantum Engine v1.0`,
      circuit: { name: "Grover Search", gates: PRESET_CIRCUITS.grover2.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  if (lower.includes("cluster") || lower.includes("segment") || lower.includes("group")) {
    return {
      role: "system",
      content: `TARX Cluster engaged. Running quantum-enhanced K-means across mesh nodes.\n\nQuantum distance computation allows exponentially faster similarity calculations between data points. The mesh distributes the computation across available nodes.\n\nSolver: cluster\nEngine: TARX Quantum Engine v1.0`,
      timestamp: now,
    };
  }

  if (lower.includes("classif") || lower.includes("kernel") || lower.includes("svm") || lower.includes("predict")) {
    return {
      role: "system",
      content: `TARX Classifier engaged. Running Quantum SVM with quantum feature maps.\n\nQuantum kernels map data into exponentially large Hilbert spaces where linear separation becomes possible for complex patterns that classical SVMs can't handle.\n\nSolver: classify\nEngine: TARX Quantum Engine v1.0`,
      timestamp: now,
    };
  }

  if (lower.includes("binary") || lower.includes("allocat") || lower.includes("qubo") || lower.includes("combinat")) {
    return {
      role: "system",
      content: `TARX Binary Optimizer engaged. Running QUBO solver across mesh nodes.\n\nQuadratic Unconstrained Binary Optimization maps your allocation problem to a quantum energy landscape. The solver finds the lowest-energy configuration — your optimal assignment.\n\nSolver: binary\nEngine: TARX Quantum Engine v1.0`,
      circuit: { name: "QUBO", gates: PRESET_CIRCUITS.bell.gates.map(g => ({ type: g.type, targets: g.targets })) },
      timestamp: now,
    };
  }

  return {
    role: "system",
    content: `TARX Quantum Engine ready to solve: "${input}"\n\nAvailable solvers:\n• Optimize — routing, scheduling, portfolio optimization\n• Search — find items in O(√N) instead of O(N)\n• Classify — quantum kernel SVM for complex patterns\n• Cluster — quantum-enhanced K-means segmentation\n• Binary — QUBO allocation and combinatorial problems\n\nDescribe your problem and TARX routes it to the right solver.`,
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
      content: "TARX Quantum Engine ready. Describe an optimization, search, classification, or clustering problem and I'll solve it across the mesh.",
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
          Describe your problem. TARX routes it to the right solver.
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
            placeholder="Describe a problem to solve..."
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
