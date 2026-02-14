import { NextRequest, NextResponse } from "next/server";
import { query, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/vehicles/[id]/availability
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const slots = await query(
    `SELECT * FROM vehicle_availability WHERE "vehicleId" = $1 ORDER BY "startDate"`,
    [id]
  );
  return NextResponse.json(slots);
}

// POST /api/vehicles/[id]/availability — Block/unblock dates
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();

    const rows = await query(`SELECT * FROM vehicle WHERE id = $1`, [id]);
    const vehicle = rows[0] as Record<string, unknown> | undefined;
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicule introuvable" }, { status: 404 });
    }
    if (vehicle.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const body = await req.json();
    const { startDate, endDate, action } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({ error: "Dates requises" }, { status: 400 });
    }

    if (action === "unblock") {
      await query(
        `DELETE FROM vehicle_availability WHERE "vehicleId" = $1 AND "startDate" = $2 AND "endDate" = $3 AND reason = 'blocked'`,
        [id, startDate, endDate]
      );
    } else {
      const slotId = generateId();
      await query(
        `INSERT INTO vehicle_availability (id, "vehicleId", "startDate", "endDate", reason) VALUES ($1, $2, $3, $4, 'blocked')`,
        [slotId, id, startDate, endDate]
      );
    }

    const slots = await query(
      `SELECT * FROM vehicle_availability WHERE "vehicleId" = $1 ORDER BY "startDate"`,
      [id]
    );

    return NextResponse.json(slots);
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
