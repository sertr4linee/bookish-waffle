import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionOrThrow, getSessionOrNull } from "@/lib/auth-helpers";
import { vehicleSchema } from "@/lib/validators";
import { haversineDistance } from "@/lib/here-maps";

// GET /api/vehicles — List/search vehicles
export async function GET(req: NextRequest) {
  const db = getDb();
  const params = req.nextUrl.searchParams;

  const type = params.get("type");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const lat = params.get("lat");
  const lng = params.get("lng");
  const radius = params.get("radius"); // km
  const ownerId = params.get("ownerId");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  let query = "SELECT * FROM vehicle WHERE isActive = 1";
  const queryParams: unknown[] = [];

  if (ownerId) {
    query = "SELECT * FROM vehicle WHERE ownerId = ?";
    queryParams.push(ownerId);
  }

  if (type) {
    query += " AND type = ?";
    queryParams.push(type);
  }
  if (minPrice) {
    query += " AND pricePerDay >= ?";
    queryParams.push(Number(minPrice));
  }
  if (maxPrice) {
    query += " AND pricePerDay <= ?";
    queryParams.push(Number(maxPrice));
  }

  // Bounding box pre-filter for geo search
  if (lat && lng && radius) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = Number(radius);
    const latDelta = radiusNum / 111;
    const lngDelta = radiusNum / (111 * Math.cos(latNum * Math.PI / 180));
    query += " AND lat BETWEEN ? AND ? AND lng BETWEEN ? AND ?";
    queryParams.push(latNum - latDelta, latNum + latDelta, lngNum - lngDelta, lngNum + lngDelta);
  }

  query += " ORDER BY createdAt DESC";

  let vehicles = db.prepare(query).all(...queryParams) as Array<Record<string, unknown>>;

  // Haversine post-filter
  if (lat && lng && radius) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = Number(radius);
    vehicles = vehicles.filter((v) =>
      haversineDistance(latNum, lngNum, v.lat as number, v.lng as number) <= radiusNum
    );
  }

  // Filter by date availability
  if (startDate && endDate) {
    const unavailable = db.prepare(
      `SELECT DISTINCT vehicleId FROM vehicle_availability
       WHERE startDate <= ? AND endDate >= ?`
    ).all(endDate, startDate) as Array<{ vehicleId: string }>;
    const unavailableIds = new Set(unavailable.map((u) => u.vehicleId));
    vehicles = vehicles.filter((v) => !unavailableIds.has(v.id as string));
  }

  // Parse photos JSON
  const result = vehicles.map((v) => ({
    ...v,
    photos: JSON.parse((v.photos as string) || "[]"),
  }));

  return NextResponse.json(result);
}

// POST /api/vehicles — Create vehicle
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionOrThrow();
    if ((session.user as Record<string, unknown>).userType !== "owner") {
      return NextResponse.json({ error: "Seuls les proprietaires peuvent creer des vehicules" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = vehicleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const db = getDb();
    const id = generateId();
    const data = parsed.data;

    db.prepare(
      `INSERT INTO vehicle (id, ownerId, name, type, description, pricePerDay, address, lat, lng, accessMethod)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      session.user.id,
      data.name,
      data.type,
      data.description,
      data.pricePerDay,
      data.address,
      data.lat ?? null,
      data.lng ?? null,
      data.accessMethod,
    );

    const vehicle = db.prepare("SELECT * FROM vehicle WHERE id = ?").get(id);
    return NextResponse.json(vehicle, { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
