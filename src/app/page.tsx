import { DashboardGrid } from "@/components/dashboard/DashboardGrid";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          Quantum Dashboard
        </h1>
        <p className="text-sm text-foreground/50 mt-1">
          Quantum-class computing on sovereign mesh infrastructure
        </p>
      </header>
      <DashboardGrid />
    </div>
  );
}
