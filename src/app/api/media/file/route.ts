/**
 * Serve arquivos enviados para /tmp na Vercel (uploads temporários).
 * Em ambiente local os arquivos ficam em public/uploads e são servidos
 * diretamente pelo Next.js — esta rota é usada apenas na Vercel.
 */
import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name") || "";

    // Segurança: impede path traversal
    if (!name || name.includes("..") || name.includes("/")) {
      return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    }

    const isVercel = process.env.VERCEL === "1";
    const dir = isVercel
      ? "/tmp/uploads"
      : path.join(process.cwd(), "public", "uploads");

    const filePath = path.join(dir, name);
    const buffer = await readFile(filePath);

    const ext = path.extname(name).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Arquivo não encontrado (uploads na Vercel são temporários — use URL externa)" },
      { status: 404 }
    );
  }
}
