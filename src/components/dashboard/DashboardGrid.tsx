"use client";

import { useState, useEffect } from "react";

interface MeshNode {
  id: string;
  status: "online" | "busy" | "offline";
  qubitState: "|0⟩" | "|1⟩" | "|+⟩" | "|−⟩";
  fidelity: number;
  load: number;
}

function generateNodes(count: number): MeshNode[] {
  const states: MeshNode["qubitState"][] = ["|0⟩", "|1⟩", "|+⟩", "|−⟩"];
  const statuses: MeshNode["status"][] = ["online", "busy", "offline"];
  return Array.from({ length: count }, (_, i) => ({
    id: `node-${String(i).padStart(3, "0")}`,
    status: statuses[Math.floor(Math.random() * 2.3)] as MeshNode["status"],
    qubitState: states[Math.floor(Math.random() * states.length)],
    fidelity: 0.92 + Math.random() * 0.079,
    load: Math.random() * 100,
  }));
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 quantum-glow">
      <p className="text-xs text-foreground/40 uppercase tracking-wider">{label}</p>
      <p className={`text-2xl font-bold mt-1 font-mono ${color || "text-accent-light"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-foreground/30 mt-1">{sub}</p>}
    </div>
  );
}

function QubitGrid({ nodes }: { nodes: MeshNode[] }) {
  const statusColor = {
    online: "bg-success",
    busy: "bg-warning",
    offline: "bg-danger/40",
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-foreground/60 mb-3">Mesh Node Grid</h3>
      <div className="grid grid-cols-8 gap-1.5">
        {nodes.slice(0, 64).map((node) => (
          <div
            key={node.id}
            className="group relative"
            title={`${node.id}: ${node.qubitState} (${(node.fidelity * 100).toFixed(1)}%)`}
          >
            <div className={`w-full aspect-square rounded-sm ${statusColor[node.status]} opacity-70 hover:opacity-100 transition-opacity cursor-pointer`} />
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3 text-[10px] text-foreground/40">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-success" /> Online</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-warning" /> Busy</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-danger/40" /> Offline</span>
      </div>
    </div>
  );
}

function RecentJobs() {
  const jobs = [
    { id: "qj-001", circuit: "Route Optimization", qubits: 3, status: "completed", time: "0.9s" },
    { id: "qj-002", circuit: "Grover Search", qubits: 4, status: "running", time: "—" },
    { id: "qj-003", circuit: "Binary Allocation", qubits: 8, status: "queued", time: "—" },
    { id: "qj-004", circuit: "Quantum Clustering", qubits: 4, status: "completed", time: "0.8s" },
  ];

  const statusStyle = {
    completed: "text-success",
    running: "text-warning",
    queued: "text-foreground/30",
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <h3 className="text-sm font-medium text-foreground/60 mb-3">Recent Jobs</h3>
      <div className="space-y-2">
        {jobs.map((job) => (
          <div key={job.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-foreground/30">{job.id}</span>
              <span className="text-foreground/80">{job.circuit}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-foreground/30 font-mono">{job.qubits}q</span>
              <span className={`text-xs font-medium ${statusStyle[job.status as keyof typeof statusStyle]}`}>
                {job.status}
              </span>
              <span className="text-xs text-foreground/20 font-mono w-8 text-right">{job.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardGrid() {
  const [nodes, setNodes] = useState<MeshNode[]>([]);

  useEffect(() => {
    setNodes(generateNodes(64));
    const interval = setInterval(() => {
      setNodes(generateNodes(64));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineCount = nodes.filter((n) => n.status === "online").length;
  const busyCount = nodes.filter((n) => n.status === "busy").length;
  const avgFidelity = nodes.length
    ? nodes.reduce((a, n) => a + n.fidelity, 0) / nodes.length
    : 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Active Solvers" value={String(nodes.length)} sub="mesh nodes online" />
        <StatCard label="Online" value={String(onlineCount)} sub={`${busyCount} busy`} color="text-success" />
        <StatCard label="Engine Reliability" value={`${(avgFidelity * 100).toFixed(1)}%`} sub="solver accuracy" color="text-warning" />
        <StatCard label="Jobs Solved" value="4" sub="today" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <QubitGrid nodes={nodes} />
        <RecentJobs />
      </div>
    </div>
  );
}
