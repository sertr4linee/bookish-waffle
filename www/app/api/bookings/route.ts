import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { bookingSchema } from "@/lib/validators";
import { differenceInDays } from "date-fns";

// GET /api/bookings — List bookings (role=owner or role=customer)
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    const role = req.nextUrl.searchParams.get("role") || "customer";
    const db = getDb();

    const column = role === "owner" ? "ownerId" : "customerId";
    const bookings = db.prepare(
      `SELECT b.*, v.name as vehicleName, v.photos as vehiclePhotos, v.type as vehicleType
       FROM booking b
       JOIN vehicle v ON b.vehicleId = v.id
       WHERE b.${column} = ?
       ORDER BY b.createdAt DESC`
    ).all(session.user.id) as Array<Record<string, unknown>>;

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
    const db = getDb();

    // Get vehicle
    const vehicle = db.prepare("SELECT * FROM vehicle WHERE id = ? AND isActive = 1").get(vehicleId) as Record<string, unknown> | undefined;
    if (!vehicle) {
      return NextResponse.json({ error: "Vehicule introuvable ou inactif" }, { status: 404 });
    }

    // Can't book own vehicle
    if (vehicle.ownerId === session.user.id) {
      return NextResponse.json({ error: "Vous ne pouvez pas reserver votre propre vehicule" }, { status: 400 });
    }

    // Check availability
    const conflict = db.prepare(
      `SELECT id FROM vehicle_availability
       WHERE vehicleId = ? AND startDate <= ? AND endDate >= ?`
    ).get(vehicleId, endDate, startDate);

    if (conflict) {
      return NextResponse.json({ error: "Le vehicule n'est pas disponible pour ces dates" }, { status: 409 });
    }

    // Calculate price
    const days = differenceInDays(new Date(endDate), new Date(startDate));
    if (days <= 0) {
      return NextResponse.json({ error: "La date de fin doit etre apres la date de debut" }, { status: 400 });
    }
    const totalPrice = days * (vehicle.pricePerDay as number);

    // Create booking
    const bookingId = generateId();
    const availabilityId = generateId();

    const insertBooking = db.prepare(
      `INSERT INTO booking (id, vehicleId, customerId, ownerId, startDate, endDate, totalPrice, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`
    );

    const insertAvailability = db.prepare(
      `INSERT INTO vehicle_availability (id, vehicleId, startDate, endDate, reason)
       VALUES (?, ?, ?, ?, 'booked')`
    );

    const transaction = db.transaction(() => {
      insertBooking.run(bookingId, vehicleId, session.user.id, vehicle.ownerId, startDate, endDate, totalPrice);
      insertAvailability.run(availabilityId, vehicleId, startDate, endDate);
    });

    transaction();

    const booking = db.prepare("SELECT * FROM booking WHERE id = ?").get(bookingId);
    return NextResponse.json(booking, { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
