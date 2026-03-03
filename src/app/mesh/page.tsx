"use client";

import { useState, useEffect } from "react";
import { formatState, type QubitState } from "@/lib/quantum";

interface MeshQubit {
  id: string;
  address: string;
  port: number;
  status: "online" | "busy" | "offline" | "calibrating";
  state: QubitState;
  coherenceMs: number;
  peers: string[];
  lastPing: number;
  capabilities: string[];
}

function generateMeshQubits(count: number): MeshQubit[] {
  const statuses: MeshQubit["status"][] = ["online", "busy", "calibrating", "offline"];
  return Array.from({ length: count }, (_, i) => {
    const isOnline = Math.random() > 0.15;
    const isBusy = isOnline && Math.random() > 0.6;
    const isCalibrating = isOnline && !isBusy && Math.random() > 0.85;
    const status = !isOnline ? "offline" : isCalibrating ? "calibrating" : isBusy ? "busy" : "online";

    const states: [number, number][] = [[1, 0], [0, 0]];
    if (isBusy) {
      const angle = Math.random() * Math.PI;
      states[0] = [Math.cos(angle / 2), 0];
      states[1] = [Math.sin(angle / 2), 0];
    }

    const peerCount = 1 + Math.floor(Math.random() * 4);
    const peers = Array.from({ length: peerCount }, () =>
      `node-${String(Math.floor(Math.random() * count)).padStart(3, "0")}`
    ).filter((p) => p !== `node-${String(i).padStart(3, "0")}`);

    return {
      id: `node-${String(i).padStart(3, "0")}`,
      address: `10.0.${Math.floor(i / 256)}.${i % 256}`,
      port: 11436,
      status,
      state: { alpha: states[0], beta: states[1], measured: false },
      coherenceMs: 500 + Math.random() * 1500,
      peers,
      lastPing: Date.now() - Math.floor(Math.random() * 5000),
      capabilities: ["gate_h", "gate_x", "gate_cnot", "measure"],
    };
  });
}

const STATUS_COLOR = {
  online: "bg-success",
  busy: "bg-warning",
  calibrating: "bg-accent",
  offline: "bg-danger/40",
};

const STATUS_LABEL = {
  online: "Ready",
  busy: "Executing",
  calibrating: "Calibrating",
  offline: "Offline",
};

export default function MeshPage() {
  const [qubits, setQubits] = useState<MeshQubit[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setQubits(generateMeshQubits(32));
    const interval = setInterval(() => {
      setQubits(generateMeshQubits(32));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const selectedQubit = qubits.find((q) => q.id === selected);
  const online = qubits.filter((q) => q.status !== "offline").length;

  return (
    <div className="flex h-full">
      <div className="w-80 border-r border-border overflow-auto">
        <div className="p-4 border-b border-border">
          <h1 className="text-lg font-semibold">Mesh Nodes</h1>
          <p className="text-xs text-foreground/40 mt-0.5">
            {online}/{qubits.length} nodes online — each node = 1 qubit
          </p>
        </div>

        <div className="divide-y divide-border/30">
          {qubits.map((q) => (
            <button
              key={q.id}
              onClick={() => setSelected(q.id)}
              className={`w-full text-left px-4 py-2.5 hover:bg-surface-hover transition-colors ${
                selected === q.id ? "bg-surface-hover" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[q.status]}`} />
                  <span className="font-mono text-sm text-foreground/70">{q.id}</span>
                </div>
                <span className="font-mono text-xs text-accent-light">
                  {formatState(q.state)}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-foreground/30 ml-4">
                <span>{q.address}:{q.port}</span>
                <span>{q.peers.length} peers</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {selectedQubit ? (
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold font-mono">{selectedQubit.id}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[selectedQubit.status]}`} />
                <span className="text-sm text-foreground/50">{STATUS_LABEL[selectedQubit.status]}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-foreground/40">Qubit State</p>
                <p className="text-2xl font-bold font-mono text-accent-light mt-1">
                  {formatState(selectedQubit.state)}
                </p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-foreground/40">Coherence Time</p>
                <p className="text-2xl font-bold font-mono mt-1">
                  {selectedQubit.coherenceMs.toFixed(0)}<span className="text-sm text-foreground/30">ms</span>
                </p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-4">
                <p className="text-xs text-foreground/40">Peer Links</p>
                <p className="text-2xl font-bold font-mono mt-1">{selectedQubit.peers.length}</p>
                <p className="text-xs text-foreground/30">entanglement channels</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground/60 mb-3">Network</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-foreground/30">Address:</span>{" "}
                  <span className="font-mono text-foreground/70">{selectedQubit.address}:{selectedQubit.port}</span>
                </div>
                <div>
                  <span className="text-foreground/30">Last Ping:</span>{" "}
                  <span className="font-mono text-foreground/70">{Date.now() - selectedQubit.lastPing}ms ago</span>
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground/60 mb-3">
                Entangled Peers ({selectedQubit.peers.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedQubit.peers.map((peer) => (
                  <button
                    key={peer}
                    onClick={() => setSelected(peer)}
                    className="px-2.5 py-1 bg-accent/10 text-accent-light rounded font-mono text-xs hover:bg-accent/20 transition-colors"
                  >
                    {peer}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground/60 mb-3">Gate Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedQubit.capabilities.map((cap) => (
                  <span
                    key={cap}
                    className="px-2 py-1 bg-surface-hover text-foreground/50 rounded text-xs font-mono"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4">
              <h3 className="text-sm font-medium text-foreground/60 mb-3">Bloch Sphere (α, β)</h3>
              <div className="font-mono text-sm space-y-1">
                <div>
                  <span className="text-foreground/30">α = </span>
                  <span className="text-foreground/70">
                    {selectedQubit.state.alpha[0].toFixed(4)} + {selectedQubit.state.alpha[1].toFixed(4)}i
                  </span>
                </div>
                <div>
                  <span className="text-foreground/30">β = </span>
                  <span className="text-foreground/70">
                    {selectedQubit.state.beta[0].toFixed(4)} + {selectedQubit.state.beta[1].toFixed(4)}i
                  </span>
                </div>
                <div className="text-foreground/20 text-xs mt-2">
                  |α|² + |β|² = {(
                    selectedQubit.state.alpha[0] ** 2 +
                    selectedQubit.state.alpha[1] ** 2 +
                    selectedQubit.state.beta[0] ** 2 +
                    selectedQubit.state.beta[1] ** 2
                  ).toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-foreground/20 text-sm">
            Select a mesh node to inspect its qubit state
          </div>
        )}
      </div>
    </div>
  );
}
