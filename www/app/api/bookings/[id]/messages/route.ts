import { NextRequest, NextResponse } from "next/server";
import { getDb, generateId } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { messageSchema } from "@/lib/validators";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/bookings/[id]/messages
export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const session = await getSessionOrThrow();
    const db = getDb();

    // Verify access
    const booking = db.prepare("SELECT * FROM booking WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!booking) {
      return NextResponse.json({ error: "Reservation introuvable" }, { status: 404 });
    }
    if (booking.customerId !== session.user.id && booking.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Non autorise" }, { status: 403 });
    }

    const messages = db.prepare(
      `SELECT m.*, u.name as senderName
       FROM message m
       JOIN user u ON m.senderId = u.id
       WHERE m.bookingId = ?
       ORDER BY m.createdAt ASC`
    ).all(id);

    // Mark messages as read
    db.prepare(
      "UPDATE message SET isRead = 1 WHERE bookingId = ? AND senderId != ?"
    ).run(id, session.user.id);

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
    const db = getDb();

    // Verify access
    const booking = db.prepare("SELECT * FROM booking WHERE id = ?").get(id) as Record<string, unknown> | undefined;
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
    db.prepare(
      "INSERT INTO message (id, bookingId, senderId, content) VALUES (?, ?, ?, ?)"
    ).run(msgId, id, session.user.id, parsed.data.content);

    const message = db.prepare(
      `SELECT m.*, u.name as senderName
       FROM message m
       JOIN user u ON m.senderId = u.id
       WHERE m.id = ?`
    ).get(msgId);

    return NextResponse.json(message, { status: 201 });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
