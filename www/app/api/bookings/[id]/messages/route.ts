import { NextRequest, NextResponse } from "next/server";
import { query, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { messageSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/bookings/[id]/messages
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();

    const bookingRows = await query(`SELECT * FROM booking WHERE id = $1`, [id]);
    const booking = bookingRows[0] as Record<string, unknown> | undefined;
    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }
    if (booking.customerId !== session.user.id && booking.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const messages = await query(
      `SELECT m.*, u.name as "senderName"
       FROM message m
       JOIN "user" u ON m."senderId" = u.id
       WHERE m."bookingId" = $1
       ORDER BY m."createdAt" ASC`,
      [id]
    );

    await query(
      `UPDATE message SET "isRead" = TRUE WHERE "bookingId" = $1 AND "senderId" != $2`,
      [id, session.user.id]
    );

    return NextResponse.json(messages);
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}

// POST /api/bookings/[id]/messages
export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();

    const bookingRows = await query(`SELECT * FROM booking WHERE id = $1`, [id]);
    const booking = bookingRows[0] as Record<string, unknown> | undefined;
    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }
    if (booking.customerId !== session.user.id && booking.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = messageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const msgId = generateId();
    await query(
      `INSERT INTO message (id, "bookingId", "senderId", content) VALUES ($1, $2, $3, $4)`,
      [msgId, id, session.user.id, parsed.data.content]
    );

    const msgRows = await query(
      `SELECT m.*, u.name as "senderName"
       FROM message m
       JOIN "user" u ON m."senderId" = u.id
       WHERE m.id = $1`,
      [msgId]
    );

    return NextResponse.json(msgRows[0], { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
