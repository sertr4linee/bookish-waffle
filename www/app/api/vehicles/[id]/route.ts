import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { vehicleSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/vehicles/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const rows = await query(`SELECT * FROM vehicle WHERE id = $1`, [id]);
  const vehicle = rows[0] as Record<string, unknown> | undefined;

  if (!vehicle) {
    return NextResponse.json({ error: "Vehicule introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    ...vehicle,
    photos: JSON.parse((vehicle.photos as string) || "[]"),
  });
}

// PUT /api/vehicles/[id]
export async function PUT(req: NextRequest, { params }: RouteParams) {
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
    const parsed = vehicleSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data;
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`"${key}" = $${paramIndex++}`);
        values.push(value);
      }
    }

    if (body.isActive !== undefined) {
      fields.push(`"isActive" = $${paramIndex++}`);
      values.push(body.isActive);
    }

    if (fields.length > 0) {
      fields.push(`"updatedAt" = NOW()`);
      values.push(id);
      await query(`UPDATE vehicle SET ${fields.join(", ")} WHERE id = $${paramIndex}`, values);
    }

    const updatedRows = await query(`SELECT * FROM vehicle WHERE id = $1`, [id]);
    const updated = updatedRows[0] as Record<string, unknown>;
    return NextResponse.json({
      ...updated,
      photos: JSON.parse((updated.photos as string) || "[]"),
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}

// DELETE /api/vehicles/[id]
export async function DELETE(_req: NextRequest, { params }: RouteParams) {
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

    await query(`DELETE FROM vehicle WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
