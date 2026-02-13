import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { consentSchema } from "@/lib/validators";

// POST /api/consent — Record consent acceptance
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const body = await req.json();
    const parsed = consentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const db = getDb();
    const id = generateId();

    db.prepare(
      "INSERT INTO consent (id, userId, type, version) VALUES (?, ?, ?, ?)"
    ).run(id, session.user.id, parsed.data.type, parsed.data.version);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
