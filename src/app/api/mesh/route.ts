import { NextResponse } from "next/server";

const MESH_URL = process.env.TARX_MESH_URL || "http://localhost:11436";

export async function GET() {
  try {
    const res = await fetch(`${MESH_URL}/api/v1/status`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Mesh returned ${res.status}`);
    const data = await res.json();
    return NextResponse.json({ status: "connected", mesh: data });
  } catch {
    return NextResponse.json(
      { status: "disconnected", error: "Mesh node unreachable" },
      { status: 503 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (action === "query") {
      const res = await fetch(`${MESH_URL}/api/v1/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });
      const data = await res.json();
      return NextResponse.json({ result: data });
    }

    if (action === "peers") {
      const res = await fetch(`${MESH_URL}/api/v1/peers`, {
        signal: AbortSignal.timeout(3000),
      });
      const data = await res.json();
      return NextResponse.json({ peers: data });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json(
      { error: "Mesh operation failed" },
      { status: 500 }
    );
  }
}
