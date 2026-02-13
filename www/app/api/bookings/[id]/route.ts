import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/bookings/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();
    const db = getDb();

    const booking = db.prepare(
      `SELECT b.*, v.name as vehicleName, v.photos as vehiclePhotos, v.type as vehicleType, v.address as vehicleAddress
       FROM booking b
       JOIN vehicle v ON b.vehicleId = v.id
       WHERE b.id = ?`
    ).get(id) as Record<string, unknown> | undefined;

    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }

    // Only owner or customer can see
    if (booking.customerId !== session.user.id && booking.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    return NextResponse.json({
      ...booking,
      vehiclePhotos: JSON.parse((booking.vehiclePhotos as string) || "[]"),
    });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}

// PUT /api/bookings/[id] — Update status
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();
    const db = getDb();
    const { status } = await req.json();

    const booking = db.prepare("SELECT * FROM booking WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }

    const isOwner = booking.ownerId === session.user.id;
    const isCustomer = booking.customerId === session.user.id;

    if (!isOwner && !isCustomer) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    // Validate status transitions
    const currentStatus = booking.status as string;
    const validTransitions: Record<string, { allowed: string[]; by: string[] }> = {
      pending: { allowed: ["confirmed", "cancelled"], by: isOwner ? ["confirmed", "cancelled"] : ["cancelled"] },
      confirmed: { allowed: ["cancelled", "completed"], by: isOwner ? ["cancelled", "completed"] : ["cancelled"] },
    };

    const transition = validTransitions[currentStatus];
    if (!transition || !transition.by.includes(status)) {
      return NextResponse.json({ error: "Transition de statut non autorisee" }, { status: 400 });
    }

    db.prepare("UPDATE booking SET status = ?, updatedAt = datetime('now') WHERE id = ?").run(status, id);

    // If cancelled, remove the availability block
    if (status === "cancelled") {
      db.prepare(
        "DELETE FROM vehicle_availability WHERE vehicleId = ? AND startDate = ? AND endDate = ? AND reason = 'booked'"
      ).run(booking.vehicleId, booking.startDate, booking.endDate);
    }

    const updated = db.prepare("SELECT * FROM booking WHERE id = ?").get(id);
    return NextResponse.json(updated);
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
