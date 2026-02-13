import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";

// GET /api/favorites — List user's favorites
export async function GET() {
  try {
    const session = await getSessionOrThrow();
    const db = getDb();

    const favorites = db.prepare(
      `SELECT f.*, v.name, v.type, v.pricePerDay, v.photos, v.address, v.isActive
       FROM favorite f
       JOIN vehicle v ON f.vehicleId = v.id
       WHERE f.userId = ?
       ORDER BY f.createdAt DESC`
    ).all(session.user.id) as Array<Record<string, unknown>>;

    const result = favorites.map((f) => ({
      ...f,
      photos: JSON.parse((f.photos as string) || "[]"),
    }));

    return NextResponse.json(result);
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}

// POST /api/favorites — Toggle favorite
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const { vehicleId } = await req.json();

    if (!vehicleId) {
      return NextResponse.json({ error: "vehicleId requis" }, { status: 400 });
    }

    const db = getDb();
    const existing = db.prepare(
      "SELECT id FROM favorite WHERE userId = ? AND vehicleId = ?"
    ).get(session.user.id, vehicleId) as { id: string } | undefined;

    if (existing) {
      db.prepare("DELETE FROM favorite WHERE id = ?").run(existing.id);
      return NextResponse.json({ favorited: false });
    } else {
      const id = generateId();
      db.prepare(
        "INSERT INTO favorite (id, userId, vehicleId) VALUES (?, ?, ?)"
      ).run(id, session.user.id, vehicleId);
      return NextResponse.json({ favorited: true }, { status: 201 });
    }
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
