import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/bookings/[id]
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();

    const rows = await query(
      `SELECT b.*, v.name as "vehicleName", v.photos as "vehiclePhotos", v.type as "vehicleType", v.address as "vehicleAddress"
       FROM booking b
       JOIN vehicle v ON b."vehicleId" = v.id
       WHERE b.id = $1`,
      [id]
    );
    const booking = rows[0] as Record<string, unknown> | undefined;

    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }

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
    const { status } = await req.json();

    const rows = await query(`SELECT * FROM booking WHERE id = $1`, [id]);
    const booking = rows[0] as Record<string, unknown> | undefined;
    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }

    const isOwner = booking.ownerId === session.user.id;
    const isCustomer = booking.customerId === session.user.id;

    if (!isOwner && !isCustomer) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const currentStatus = booking.status as string;
    const validTransitions: Record<string, { allowed: string[]; by: string[] }> = {
      pending: { allowed: ["confirmed", "cancelled"], by: isOwner ? ["confirmed", "cancelled"] : ["cancelled"] },
      confirmed: { allowed: ["cancelled", "completed"], by: isOwner ? ["cancelled", "completed"] : ["cancelled"] },
    };

    const transition = validTransitions[currentStatus];
    if (!transition || !transition.by.includes(status)) {
      return NextResponse.json({ error: "Transition de statut non autorisee" }, { status: 400 });
    }

    await query(
      `UPDATE booking SET status = $1, "updatedAt" = NOW() WHERE id = $2`,
      [status, id]
    );

    if (status === "cancelled") {
      await query(
        `DELETE FROM vehicle_availability WHERE "vehicleId" = $1 AND "startDate" = $2 AND "endDate" = $3 AND reason = 'booked'`,
        [booking.vehicleId, booking.startDate, booking.endDate]
      );
    }

    const updatedRows = await query(`SELECT * FROM booking WHERE id = $1`, [id]);
    return NextResponse.json(updatedRows[0]);
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
