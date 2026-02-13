import { NextRequest, NextResponse } from "next/server";
import { geocode, autocomplete } from "@/lib/here-maps";

// GET /api/geocode — Proxy for HERE API (keeps key server-side)
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const query = params.get("q");
  const mode = params.get("mode") || "autocomplete";

  if (!query) {
    return NextResponse.json({ error: "Parametre 'q' requis" }, { status: 400 });
  }

  if (mode === "geocode") {
    const result = await geocode(query);
    return NextResponse.json(result ?? { error: "Aucun resultat" });
  }

  const results = await autocomplete(query);
  return NextResponse.json(results);
}
