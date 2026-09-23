import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireMasterSession } from "@/lib/auth/server";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

function unauthorizedResponse(error: unknown) {
  if (error instanceof Error && error.message === "Forbidden") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}

export async function POST(request: Request) {
  try {
    await requireMasterSession();
  } catch (error) {
    return unauthorizedResponse(error);
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid upload." }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided." }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { message: "Please upload a JPEG, PNG, WebP, or GIF image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { message: "Image must be 5 MB or smaller." },
      { status: 400 },
    );
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = sanitizeFilename(
    file.name.replace(/\.[^.]+$/, "") || "event-photo",
  );
  const filename = `${Date.now()}-${baseName}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`events/${filename}`, file, { access: "public" });
    return NextResponse.json({ url: blob.url });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "events");
  await mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/events/${filename}` });
}
