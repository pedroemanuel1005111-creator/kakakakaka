import { NextResponse } from "next/server";
import { sseClients } from "@/lib/sse";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Vercel: mantém a função SSE viva por até 60s (máx. do plano Hobby).
// Quando expira, o cliente reconecta automaticamente (EventSource + retry).
// O fallback de polling nos componentes garante sincronia contínua.
export const maxDuration = 60;

export async function GET() {
  const encoder = new TextEncoder();
  let ctrl: ReadableStreamDefaultController | null = null;
  let heartbeatId: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      ctrl = controller;
      sseClients.add(controller);

      // Boas-vindas
      controller.enqueue(
        encoder.encode(`event: connected\ndata: {"ok":true}\n\n`)
      );

      // Heartbeat a cada 25s para manter a conexão viva em proxies/CDNs
      heartbeatId = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          clearInterval(heartbeatId);
          sseClients.delete(controller);
        }
      }, 25_000);
    },
    cancel() {
      clearInterval(heartbeatId);
      if (ctrl) sseClients.delete(ctrl);
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
