"use client";

import { useState } from "react";
import { PRESET_CIRCUITS, type GateType, gateSymbol } from "@/lib/quantum";

interface Job {
  id: string;
  name: string;
  qubits: number;
  gates: number;
  shots: number;
  status: "queued" | "running" | "completed" | "failed";
  submittedAt: string;
  duration?: string;
  results?: Record<string, number>;
}

const MOCK_JOBS: Job[] = [
  {
    id: "qj-001",
    name: "Bell State",
    qubits: 2,
    gates: 2,
    shots: 1024,
    status: "completed",
    submittedAt: "2026-03-03T22:30:00Z",
    duration: "0.3s",
    results: { "00": 512, "11": 512 },
  },
  {
    id: "qj-002",
    name: "Grover Search",
    qubits: 4,
    gates: 12,
    shots: 2048,
    status: "running",
    submittedAt: "2026-03-03T22:42:00Z",
  },
  {
    id: "qj-003",
    name: "QFT 8-qubit",
    qubits: 8,
    gates: 28,
    shots: 4096,
    status: "queued",
    submittedAt: "2026-03-03T22:43:00Z",
  },
  {
    id: "qj-004",
    name: "VQE H2 Molecule",
    qubits: 4,
    gates: 42,
    shots: 8192,
    status: "completed",
    submittedAt: "2026-03-03T22:10:00Z",
    duration: "1.2s",
    results: { "0011": 4100, "1100": 3900, "0110": 192 },
  },
  {
    id: "qj-005",
    name: "Teleportation",
    qubits: 3,
    gates: 8,
    shots: 512,
    status: "failed",
    submittedAt: "2026-03-03T21:50:00Z",
    duration: "0.1s",
  },
];

const STATUS_STYLES = {
  queued: "bg-foreground/10 text-foreground/50",
  running: "bg-warning/20 text-warning",
  completed: "bg-success/20 text-success",
  failed: "bg-danger/20 text-danger",
};

function ResultsBar({ results }: { results: Record<string, number> }) {
  const total = Object.values(results).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...Object.values(results));

  return (
    <div className="mt-3 space-y-1.5">
      {sorted.map(([bitstring, count]) => (
        <div key={bitstring} className="flex items-center gap-2">
          <span className="font-mono text-xs text-accent-light w-16">|{bitstring}⟩</span>
          <div className="flex-1 h-4 bg-background rounded overflow-hidden">
            <div
              className="h-full bg-accent/40 rounded transition-all"
              style={{ width: `${(count / maxVal) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-foreground/40 w-20 text-right">
            {count} ({((count / total) * 100).toFixed(1)}%)
          </span>
        </div>
      ))}
    </div>
  );
}

export default function JobsPage() {
  const [jobs] = useState(MOCK_JOBS);
  const [selected, setSelected] = useState<string | null>(null);
  const [showNewJob, setShowNewJob] = useState(false);

  const selectedJob = jobs.find((j) => j.id === selected);

  return (
    <div className="flex h-full">
      <div className="w-96 border-r border-border overflow-auto">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Quantum Jobs</h1>
            <p className="text-xs text-foreground/40">{jobs.length} total</p>
          </div>
          <button
            onClick={() => setShowNewJob(!showNewJob)}
            className="px-3 py-1.5 bg-accent text-white rounded text-xs font-medium hover:bg-accent/80 transition-colors"
          >
            + New Job
          </button>
        </div>

        {showNewJob && (
          <div className="p-4 border-b border-border bg-surface-hover space-y-3">
            <p className="text-xs text-foreground/60 font-medium">Quick Launch</p>
            {Object.entries(PRESET_CIRCUITS).map(([key, circuit]) => (
              <button
                key={key}
                className="w-full text-left px-3 py-2 bg-surface border border-border rounded text-sm hover:border-accent/50 transition-colors"
                onClick={() => setShowNewJob(false)}
              >
                <span className="text-foreground/80">{circuit.name}</span>
                <span className="text-xs text-foreground/30 ml-2">{circuit.minQubits}+ qubits</span>
                <p className="text-xs text-foreground/40 mt-0.5">{circuit.description}</p>
              </button>
            ))}
          </div>
        )}

        <div className="divide-y divide-border/50">
          {jobs.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelected(job.id)}
              className={`w-full text-left p-4 hover:bg-surface-hover transition-colors ${
                selected === job.id ? "bg-surface-hover" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/80">{job.name}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[job.status]}`}>
                  {job.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-foreground/30">
                <span className="font-mono">{job.id}</span>
                <span>{job.qubits}q / {job.gates}g</span>
                <span>{job.shots} shots</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {selectedJob ? (
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold">{selectedJob.name}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLES[selectedJob.status]}`}>
                  {selectedJob.status}
                </span>
              </div>
              <p className="text-sm text-foreground/40 font-mono mt-1">{selectedJob.id}</p>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-surface border border-border rounded-lg p-3">
                <p className="text-xs text-foreground/40">Qubits</p>
                <p className="text-lg font-bold font-mono text-accent-light">{selectedJob.qubits}</p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-3">
                <p className="text-xs text-foreground/40">Gates</p>
                <p className="text-lg font-bold font-mono">{selectedJob.gates}</p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-3">
                <p className="text-xs text-foreground/40">Shots</p>
                <p className="text-lg font-bold font-mono">{selectedJob.shots.toLocaleString()}</p>
              </div>
              <div className="bg-surface border border-border rounded-lg p-3">
                <p className="text-xs text-foreground/40">Duration</p>
                <p className="text-lg font-bold font-mono">{selectedJob.duration || "—"}</p>
              </div>
            </div>

            {selectedJob.results && (
              <div className="bg-surface border border-border rounded-lg p-4">
                <h3 className="text-sm font-medium text-foreground/60 mb-2">Measurement Results</h3>
                <ResultsBar results={selectedJob.results} />
              </div>
            )}

            {selectedJob.status === "failed" && (
              <div className="bg-danger/10 border border-danger/20 rounded-lg p-4">
                <p className="text-sm text-danger font-medium">Execution Failed</p>
                <p className="text-xs text-danger/60 mt-1">
                  Entanglement channel between node-005 and node-012 lost coherence during teleportation protocol. Peer link dropped mid-circuit.
                </p>
              </div>
            )}

            <div className="text-xs text-foreground/30">
              Submitted: {new Date(selectedJob.submittedAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-foreground/20 text-sm">
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
}
