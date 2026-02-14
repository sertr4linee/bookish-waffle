import { NextRequest, NextResponse } from "next/server";
import { query, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { vehicleSchema } from "@/lib/validators";
import { haversineDistance } from "@/lib/here-maps";

// GET /api/vehicles — List/search vehicles
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const type = params.get("type");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");
  const lat = params.get("lat");
  const lng = params.get("lng");
  const radius = params.get("radius");
  const ownerId = params.get("ownerId");
  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  let q = `SELECT * FROM vehicle WHERE "isActive" = TRUE`;
  const queryParams: unknown[] = [];
  let paramIndex = 1;

  if (ownerId) {
    q = `SELECT * FROM vehicle WHERE "ownerId" = $${paramIndex++}`;
    queryParams.push(ownerId);
  }

  if (type) {
    q += ` AND type = $${paramIndex++}`;
    queryParams.push(type);
  }
  if (minPrice) {
    q += ` AND "pricePerDay" >= $${paramIndex++}`;
    queryParams.push(Number(minPrice));
  }
  if (maxPrice) {
    q += ` AND "pricePerDay" <= $${paramIndex++}`;
    queryParams.push(Number(maxPrice));
  }

  if (lat && lng && radius) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = Number(radius);
    const latDelta = radiusNum / 111;
    const lngDelta = radiusNum / (111 * Math.cos(latNum * Math.PI / 180));
    q += ` AND lat BETWEEN $${paramIndex++} AND $${paramIndex++} AND lng BETWEEN $${paramIndex++} AND $${paramIndex++}`;
    queryParams.push(latNum - latDelta, latNum + latDelta, lngNum - lngDelta, lngNum + lngDelta);
  }

  q += ` ORDER BY "createdAt" DESC`;

  let vehicles = await query(q, queryParams) as Array<Record<string, unknown>>;

  if (lat && lng && radius) {
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = Number(radius);
    vehicles = vehicles.filter((v) =>
      haversineDistance(latNum, lngNum, v.lat as number, v.lng as number) <= radiusNum
    );
  }

  if (startDate && endDate) {
    const unavailable = await query(
      `SELECT DISTINCT "vehicleId" FROM vehicle_availability
       WHERE "startDate" <= $1 AND "endDate" >= $2`,
      [endDate, startDate]
    ) as Array<{ vehicleId: string }>;
    const unavailableIds = new Set(unavailable.map((u) => u.vehicleId));
    vehicles = vehicles.filter((v) => !unavailableIds.has(v.id as string));
  }

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

    const id = generateId();
    const data = parsed.data;

    await query(
      `INSERT INTO vehicle (id, "ownerId", name, type, description, "pricePerDay", address, lat, lng, "accessMethod")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [id, session.user.id, data.name, data.type, data.description, data.pricePerDay, data.address, data.lat ?? null, data.lng ?? null, data.accessMethod]
    );

    const rows = await query(`SELECT * FROM vehicle WHERE id = $1`, [id]);
    return NextResponse.json(rows[0], { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
