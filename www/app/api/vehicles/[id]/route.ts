import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { vehicleSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/vehicles/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const db = getDb();
  const vehicle = db.prepare("SELECT * FROM vehicle WHERE id = ?").get(id) as Record<string, unknown> | undefined;

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
    const db = getDb();

    const vehicle = db.prepare("SELECT * FROM vehicle WHERE id = ?").get(id) as Record<string, unknown> | undefined;
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

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    // Handle isActive toggle separately
    if (body.isActive !== undefined) {
      fields.push("isActive = ?");
      values.push(body.isActive ? 1 : 0);
    }

    if (fields.length > 0) {
      fields.push("updatedAt = datetime('now')");
      values.push(id);
      db.prepare(`UPDATE vehicle SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    }

    const updated = db.prepare("SELECT * FROM vehicle WHERE id = ?").get(id) as Record<string, unknown>;
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
    const db = getDb();

    const vehicle = db.prepare("SELECT * FROM vehicle WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicule introuvable" }, { status: 404 });
    }
    if (vehicle.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    db.prepare("DELETE FROM vehicle WHERE id = ?").run(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
