"use client";

import { useState } from "react";

interface Lesson {
  id: string;
  title: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  content: string;
  meshMapping: string;
}

const LESSONS: Lesson[] = [
  {
    id: "q-001",
    title: "What is a Qubit?",
    category: "Foundations",
    difficulty: "beginner",
    content: `A classical bit is 0 or 1. A qubit can be both simultaneously — this is superposition.

Mathematically: |ψ⟩ = α|0⟩ + β|1⟩

Where |α|² + |β|² = 1. When measured, the qubit collapses to |0⟩ with probability |α|² or |1⟩ with probability |β|².

This isn't about "not knowing" the state. The qubit genuinely exists in both states until measurement forces a choice.`,
    meshMapping: `In the TARX mesh, each node IS a qubit. The node's state register holds α and β amplitudes. When a mesh query "measures" the node, it returns 0 or 1 based on those probabilities.

Node state before measurement: superposition
Node state after measurement: classical (0 or 1)
The act of querying changes the system.`,
  },
  {
    id: "q-002",
    title: "Quantum Gates",
    category: "Foundations",
    difficulty: "beginner",
    content: `Quantum gates are operations that transform qubit states. Unlike classical gates, they're reversible — you can always undo them.

Key gates:
• H (Hadamard): |0⟩ → |+⟩ = (|0⟩+|1⟩)/√2  — creates superposition
• X (NOT): |0⟩ ↔ |1⟩  — flips the state
• Z (Phase): |1⟩ → -|1⟩  — flips phase without changing probabilities
• CNOT: Flips target qubit IF control qubit is |1⟩  — creates entanglement

Gates are represented as unitary matrices. Every quantum computation is a sequence of gates.`,
    meshMapping: `Each gate maps to a mesh operation:
• H gate → mesh node enters balanced superposition mode
• X gate → mesh node flips its state register
• CNOT → mesh query from control node triggers conditional flip on target node
• The peer link between nodes IS the wire in the circuit

Gate execution = mesh query. The mesh protocol ensures unitarity (reversibility).`,
  },
  {
    id: "q-003",
    title: "Entanglement",
    category: "Foundations",
    difficulty: "beginner",
    content: `Entanglement is the core quantum resource. Two qubits are entangled when their joint state cannot be written as a product of individual states.

Bell state: |Φ+⟩ = (|00⟩ + |11⟩) / √2

If you measure one qubit and get 0, the other is INSTANTLY 0, regardless of distance. Not because of communication — because they're one system.

Einstein called this "spooky action at a distance." It's real, verified thousands of times, and it's the basis of quantum computing's power.`,
    meshMapping: `In the TARX mesh, entanglement = peer link state correlation.

When two nodes establish an entangled pair (via H + CNOT), their state registers are linked at the protocol level. Querying (measuring) one node's state simultaneously determines the other's.

This is how the mesh achieves quantum speedup: entangled nodes process information as a single unit, not as independent computers.`,
  },
  {
    id: "q-004",
    title: "Quantum Speedup",
    category: "Algorithms",
    difficulty: "intermediate",
    content: `Quantum computers aren't universally faster. They provide speedup for specific problem structures:

Exponential speedup:
• Shor's algorithm: Factor N in O((log N)³) vs classical O(e^(log N)^(1/3))
• Quantum simulation: Simulate quantum systems naturally

Quadratic speedup:
• Grover search: Find item in O(√N) vs O(N)
• Amplitude estimation

No speedup:
• Sorting (quantum can't beat O(N log N))
• Most everyday computing tasks

The speedup comes from interference — quantum states that correspond to wrong answers destructively interfere (cancel out), while correct answers constructively interfere (amplify).`,
    meshMapping: `The TARX mesh realizes quantum parallelism through simultaneous node operations:

• N entangled mesh nodes explore 2^N states simultaneously
• Interference = mesh consensus protocol filters incorrect results
• Grover: 4-node mesh searches 16-element space in ~π√16/4 ≈ 3 mesh rounds
• The mesh doesn't "try all answers" — it uses wave-like interference to amplify the right one`,
  },
  {
    id: "q-005",
    title: "Quantum Error Correction",
    category: "Advanced",
    difficulty: "advanced",
    content: `Real qubits are noisy. Decoherence — interaction with environment — destroys quantum information. Error correction encodes one logical qubit across many physical qubits.

Surface code: O(1000) physical qubits per logical qubit
Steane code: 7 physical qubits per logical qubit

Threshold theorem: If physical error rate < ~1%, error correction can make computation arbitrarily reliable.

This is why quantum computers need millions of physical qubits for practical computation — most are for error correction.`,
    meshMapping: `In the TARX mesh, error correction maps to redundant node groups:

• 1 logical qubit = cluster of N mesh nodes
• Syndrome measurement = mesh health checks detect bit/phase flips
• Error correction = mesh self-healing restores corrupted node states
• The mesh's existing redundancy and consensus mechanisms naturally map to QEC

Node going offline = qubit decoherence
Mesh heal = error correction
More nodes = lower logical error rate`,
  },
  {
    id: "q-006",
    title: "The AI-Quantum Convergence",
    category: "Roadmap",
    difficulty: "intermediate",
    content: `AI and quantum computing are converging:

Near-term (2024-2027):
• Quantum-inspired classical algorithms (tensor networks, QAOA-inspired)
• Quantum machine learning on NISQ devices (variational circuits)
• Quantum random number generation for AI training

Mid-term (2027-2030):
• Quantum advantage in optimization (drug discovery, materials science)
• Quantum kernels for ML outperform classical kernels
• Hybrid quantum-classical neural networks

Long-term (2030+):
• Fault-tolerant quantum AI
• Quantum neural networks with exponential parameter spaces
• Quantum-native language models

The first movers who build the interaction layer NOW will define how humans interact with quantum systems for decades.`,
    meshMapping: `TARX is positioned at the convergence point:

• The mesh already does AI inference (model routing, distributed compute)
• Adding quantum operations on top creates a hybrid AI-quantum substrate
• Each mesh node can switch between classical AI and quantum roles
• The human interaction layer (this app) is the control plane

First-mover advantage: Build the UX for quantum-AI interaction before the hardware catches up. When fault-tolerant quantum arrives, TARX already has the interface.`,
  },
];

const DIFFICULTY_STYLE = {
  beginner: "bg-success/20 text-success",
  intermediate: "bg-warning/20 text-warning",
  advanced: "bg-danger/20 text-danger",
};

export default function LearnPage() {
  const [selected, setSelected] = useState<string>(LESSONS[0].id);
  const [showMesh, setShowMesh] = useState(false);

  const lesson = LESSONS.find((l) => l.id === selected)!;

  return (
    <div className="flex h-full">
      <div className="w-72 border-r border-border overflow-auto">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-semibold">Learn Quantum</h1>
          <p className="text-xs text-foreground/40 mt-0.5">
            Interactive quantum concepts mapped to TARX mesh
          </p>
        </div>

        <div className="divide-y divide-border/50">
          {LESSONS.map((l) => (
            <button
              key={l.id}
              onClick={() => { setSelected(l.id); setShowMesh(false); }}
              className={`w-full text-left p-3 hover:bg-surface-hover transition-colors ${
                selected === l.id ? "bg-surface-hover" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground/80">{l.title}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_STYLE[l.difficulty]}`}>
                  {l.difficulty}
                </span>
              </div>
              <span className="text-[10px] text-foreground/30">{l.category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs text-foreground/30">{lesson.category}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${DIFFICULTY_STYLE[lesson.difficulty]}`}>
              {lesson.difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-6">{lesson.title}</h2>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setShowMesh(false)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                !showMesh ? "bg-accent/20 text-accent-light" : "text-foreground/40 hover:text-foreground"
              }`}
            >
              Theory
            </button>
            <button
              onClick={() => setShowMesh(true)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                showMesh ? "bg-accent/20 text-accent-light" : "text-foreground/40 hover:text-foreground"
              }`}
            >
              TARX Mesh Mapping
            </button>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6">
            <pre className="whitespace-pre-wrap font-sans text-sm text-foreground/80 leading-relaxed">
              {showMesh ? lesson.meshMapping : lesson.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
