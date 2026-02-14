import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getSessionOrThrow } from "@/lib/auth-helpers";
import { uploadImage } from "@/lib/cloudinary";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/vehicles/[id]/photos — Upload photos
export async function POST(req: NextRequest, { params }: RouteParams) {
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

    const formData = await req.formData();
    const files = formData.getAll("photos") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "Aucune photo fournie" }, { status: 400 });
    }

    const currentPhotos: string[] = JSON.parse((vehicle.photos as string) || "[]");

    if (currentPhotos.length + files.length > 10) {
      return NextResponse.json({ error: "Maximum 10 photos par vehicule" }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const url = await uploadImage(buffer);
      uploadedUrls.push(url);
    }

    const allPhotos = [...currentPhotos, ...uploadedUrls];
    await query(
      `UPDATE vehicle SET photos = $1, "updatedAt" = NOW() WHERE id = $2`,
      [JSON.stringify(allPhotos), id]
    );

    return NextResponse.json({ photos: allPhotos });
  } catch (e) {
    if ((e as Error).message === "Unauthorized") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }
    throw e;
  }
}
