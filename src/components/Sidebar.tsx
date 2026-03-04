"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/chat", label: "Chat → Quantum", icon: "⟩" },
  { href: "/jobs", label: "Jobs", icon: "▦" },
  { href: "/learn", label: "Learn", icon: "△" },
  { href: "/roadmap", label: "Roadmap", icon: "◇" },
  { href: "/mesh", label: "Mesh Nodes", icon: "⬡" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="p-4 border-b border-border">
        <h1 className="text-lg font-bold tracking-tight">
          <span className="text-accent-light">TARX</span>{" "}
          <span className="text-foreground/60">Quantum</span>
        </h1>
        <p className="text-xs text-foreground/40 mt-0.5 font-mono">
          Quantum Engine
        </p>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${
                active
                  ? "bg-accent/20 text-accent-light font-medium"
                  : "text-foreground/60 hover:text-foreground hover:bg-surface-hover"
              }`}
            >
              <span className="text-xs w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-foreground/40">
          <span className="w-2 h-2 rounded-full bg-success quantum-pulse" />
          <span className="font-mono">mesh:11436</span>
        </div>
        <p className="text-[10px] text-foreground/25 mt-1 font-mono">
          v1.0.0 — TARX Quantum Engine
        </p>
      </div>
    </aside>
  );
}
