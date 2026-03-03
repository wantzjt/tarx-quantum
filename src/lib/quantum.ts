/**
 * TARX Quantum — Core types and mesh-quantum mapping
 *
 * Architecture: 1:1 mapping of mesh nodes to qubits.
 * - Each mesh node IS a qubit (not simulating one)
 * - Peer connections ARE entanglement channels
 * - Mesh queries ARE quantum gate operations
 * - Network state IS the quantum state
 */

// A qubit is a mesh node. Period.
export interface Qubit {
  nodeId: string;
  address: string;
  state: QubitState;
  coherenceTime: number; // ms — how long the node maintains state fidelity
  gateLatency: number;   // ms — time to execute an operation on this node
  peerLinks: string[];   // entangled peer node IDs
  capabilities: string[];
}

export interface QubitState {
  alpha: [number, number]; // complex amplitude [real, imaginary] for |0⟩
  beta: [number, number];  // complex amplitude [real, imaginary] for |1⟩
  measured: boolean;
  value?: 0 | 1;
}

export interface QuantumGate {
  type: GateType;
  targets: string[];       // node IDs
  controls?: string[];     // node IDs for controlled gates
  parameters?: number[];   // rotation angles etc.
}

export type GateType =
  | "H"      // Hadamard — puts node into superposition
  | "X"      // Pauli-X — flips node state
  | "Y"      // Pauli-Y — rotation
  | "Z"      // Pauli-Z — phase flip
  | "CNOT"   // Controlled-NOT — requires peer link (entanglement channel)
  | "CZ"     // Controlled-Z — phase entanglement
  | "RX"     // X-rotation by angle
  | "RY"     // Y-rotation by angle
  | "RZ"     // Z-rotation by angle
  | "SWAP"   // Swap two node states
  | "T"      // T-gate (pi/8)
  | "S"      // S-gate (pi/4)
  | "MEASURE"; // Collapse and read

export interface QuantumCircuit {
  id: string;
  name: string;
  qubits: string[];   // node IDs participating
  gates: QuantumGate[];
  createdAt: string;
  status: "draft" | "queued" | "executing" | "completed" | "failed";
  results?: MeasurementResult[];
}

export interface MeasurementResult {
  nodeId: string;
  value: 0 | 1;
  probability: number;
  timestamp: string;
}

export interface QuantumJob {
  id: string;
  circuit: QuantumCircuit;
  submittedAt: string;
  startedAt?: string;
  completedAt?: string;
  status: "queued" | "running" | "completed" | "failed" | "cancelled";
  shots: number;         // number of times to execute
  results?: Record<string, number>; // bitstring → count
  error?: string;
}

// Mesh → Quantum mapping helpers
export function meshNodeToQubit(node: { id: string; address?: string; capabilities?: string[] }): Qubit {
  return {
    nodeId: node.id,
    address: node.address || "localhost:11436",
    state: { alpha: [1, 0], beta: [0, 0], measured: false }, // initialized to |0⟩
    coherenceTime: 1000,
    gateLatency: 5,
    peerLinks: [],
    capabilities: node.capabilities || [],
  };
}

export function formatState(state: QubitState): string {
  if (state.measured) return `|${state.value}⟩`;
  const a = Math.sqrt(state.alpha[0] ** 2 + state.alpha[1] ** 2);
  const b = Math.sqrt(state.beta[0] ** 2 + state.beta[1] ** 2);
  if (a > 0.99) return "|0⟩";
  if (b > 0.99) return "|1⟩";
  if (Math.abs(a - b) < 0.05) return "|+⟩";
  return `${a.toFixed(2)}|0⟩ + ${b.toFixed(2)}|1⟩`;
}

export function gateSymbol(type: GateType): string {
  const symbols: Record<GateType, string> = {
    H: "H", X: "X", Y: "Y", Z: "Z",
    CNOT: "CX", CZ: "CZ", SWAP: "SW",
    RX: "Rx", RY: "Ry", RZ: "Rz",
    T: "T", S: "S", MEASURE: "M",
  };
  return symbols[type];
}

// Pre-built circuits for common patterns
export const PRESET_CIRCUITS = {
  bell: {
    name: "Bell State (EPR Pair)",
    description: "Create maximum entanglement between two mesh nodes",
    gates: [
      { type: "H" as GateType, targets: ["$0"] },
      { type: "CNOT" as GateType, targets: ["$1"], controls: ["$0"] },
    ],
    minQubits: 2,
  },
  ghz: {
    name: "GHZ State",
    description: "Greenberger-Horne-Zeilinger state — multi-node entanglement",
    gates: [
      { type: "H" as GateType, targets: ["$0"] },
      { type: "CNOT" as GateType, targets: ["$1"], controls: ["$0"] },
      { type: "CNOT" as GateType, targets: ["$2"], controls: ["$0"] },
    ],
    minQubits: 3,
  },
  grover2: {
    name: "Grover Search (2-qubit)",
    description: "Quantum search across 2 mesh nodes",
    gates: [
      { type: "H" as GateType, targets: ["$0"] },
      { type: "H" as GateType, targets: ["$1"] },
      { type: "CZ" as GateType, targets: ["$1"], controls: ["$0"] },
      { type: "H" as GateType, targets: ["$0"] },
      { type: "H" as GateType, targets: ["$1"] },
      { type: "X" as GateType, targets: ["$0"] },
      { type: "X" as GateType, targets: ["$1"] },
      { type: "CZ" as GateType, targets: ["$1"], controls: ["$0"] },
      { type: "X" as GateType, targets: ["$0"] },
      { type: "X" as GateType, targets: ["$1"] },
      { type: "H" as GateType, targets: ["$0"] },
      { type: "H" as GateType, targets: ["$1"] },
    ],
    minQubits: 2,
  },
  qft: {
    name: "Quantum Fourier Transform",
    description: "QFT across mesh nodes — basis for Shor's algorithm",
    gates: [
      { type: "H" as GateType, targets: ["$0"] },
      { type: "CZ" as GateType, targets: ["$0"], controls: ["$1"], parameters: [Math.PI / 2] },
      { type: "H" as GateType, targets: ["$1"] },
      { type: "SWAP" as GateType, targets: ["$0", "$1"] },
    ],
    minQubits: 2,
  },
  teleport: {
    name: "Quantum Teleportation",
    description: "Transfer quantum state between two distant mesh nodes via entanglement",
    gates: [
      { type: "H" as GateType, targets: ["$1"] },
      { type: "CNOT" as GateType, targets: ["$2"], controls: ["$1"] },
      { type: "CNOT" as GateType, targets: ["$1"], controls: ["$0"] },
      { type: "H" as GateType, targets: ["$0"] },
      { type: "MEASURE" as GateType, targets: ["$0"] },
      { type: "MEASURE" as GateType, targets: ["$1"] },
      { type: "CNOT" as GateType, targets: ["$2"], controls: ["$1"] },
      { type: "CZ" as GateType, targets: ["$2"], controls: ["$0"] },
    ],
    minQubits: 3,
  },
};
