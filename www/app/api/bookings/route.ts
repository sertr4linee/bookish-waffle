import { NextRequest, NextResponse } from "next/server";
import { query, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { bookingSchema } from "@/lib/validators";
import { differenceInDays } from "date-fns";

// GET /api/bookings — List bookings (role=owner or role=customer)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const role = req.nextUrl.searchParams.get("role") || "customer";

    const column = role === "owner" ? "ownerId" : "customerId";
    const bookings = await query(
      `SELECT b.*, v.name as "vehicleName", v.photos as "vehiclePhotos", v.type as "vehicleType"
       FROM booking b
       JOIN vehicle v ON b."vehicleId" = v.id
       WHERE b."${column}" = $1
       ORDER BY b."createdAt" DESC`,
      [session.user.id]
    ) as Array<Record<string, unknown>>;

    const result = bookings.map((b) => ({
      ...b,
      vehiclePhotos: JSON.parse((b.vehiclePhotos as string) || "[]"),
    }));

    return NextResponse.json(result);
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}

// POST /api/bookings — Create booking
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const { vehicleId, startDate, endDate } = parsed.data;

    const vehicleRows = await query(
      `SELECT * FROM vehicle WHERE id = $1 AND "isActive" = TRUE`,
      [vehicleId]
    );
    const vehicle = vehicleRows[0] as Record<string, unknown> | undefined;
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicule introuvable ou inactif" }, { status: 404 });
    }

    if (vehicle.ownerId === session.user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas reserver votre propre vehicule" }, { status: 400 });
    }

    const conflictRows = await query(
      `SELECT id FROM vehicle_availability
       WHERE "vehicleId" = $1 AND "startDate" <= $2 AND "endDate" >= $3`,
      [vehicleId, endDate, startDate]
    );

    if (conflictRows.length > 0) {
      return NextResponse.json({ error: "Le vehicule n'est pas disponible pour ces dates" }, { status: 409 });
    }

    const days = differenceInDays(new Date(endDate), new Date(startDate));
    if (days <= 0) {
      return NextResponse.json({ error: "La date de fin doit etre apres la date de debut" }, { status: 400 });
    }
    const totalPrice = days * (vehicle.pricePerDay as number);

    const bookingId = generateId();
    const availabilityId = generateId();

    await query(
      `INSERT INTO booking (id, "vehicleId", "customerId", "ownerId", "startDate", "endDate", "totalPrice", status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')`,
      [bookingId, vehicleId, session.user.id, vehicle.ownerId, startDate, endDate, totalPrice]
    );

    await query(
      `INSERT INTO vehicle_availability (id, "vehicleId", "startDate", "endDate", reason)
       VALUES ($1, $2, $3, $4, 'booked')`,
      [availabilityId, vehicleId, startDate, endDate]
    );

    const bookingRows = await query(`SELECT * FROM booking WHERE id = $1`, [bookingId]);
    return NextResponse.json(bookingRows[0], { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
