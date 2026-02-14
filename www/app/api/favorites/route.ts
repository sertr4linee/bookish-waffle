import { NextRequest, NextResponse } from "next/server";
import { query, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";

// GET /api/favorites — List user's favorites
export async function GET() {
  try {
    const session = await getSessionOrThrow();

    const favorites = await query(
      `SELECT f.*, v.name, v.type, v."pricePerDay", v.photos, v.address, v."isActive"
       FROM favorite f
       JOIN vehicle v ON f."vehicleId" = v.id
       WHERE f."userId" = $1
       ORDER BY f."createdAt" DESC`,
      [session.user.id]
    ) as Array<Record<string, unknown>>;

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

    const existingRows = await query(
      `SELECT id FROM favorite WHERE "userId" = $1 AND "vehicleId" = $2`,
      [session.user.id, vehicleId]
    );
    const existing = existingRows[0] as { id: string } | undefined;

    if (existing) {
      await query(`DELETE FROM favorite WHERE id = $1`, [existing.id]);
      return NextResponse.json({ favorited: false });
    } else {
      const id = generateId();
      await query(
        `INSERT INTO favorite (id, "userId", "vehicleId") VALUES ($1, $2, $3)`,
        [id, session.user.id, vehicleId]
      );
      return NextResponse.json({ favorited: true }, { status: 201 });
    }
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
