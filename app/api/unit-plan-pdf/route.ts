import os from "os";
import { NextRequest, NextResponse } from "next/server";
import { renderPdf, type RenderOptions } from "@/lib/server/pdf-renderer";
import { RenderLimiter } from "@/lib/server/pdf-queue";
import { buildExamSheetHtml } from "@/lib/exporters/exam-sheet/html/build-exam-sheet-html";
import { buildExamStatsHtml } from "@/tools/exam-stats/pdf/build-exam-stats-html";
import { buildUnitPlanHtml } from "@/tools/unit-plan/pdf/build-unit-plan-html";
import { buildCertificateHtml } from "@/tools/certificate/pdf/build-certificate-html";
import { buildGradingSheetHtml } from "@/tools/grading-sheet/pdf/build-grading-sheet-html";
import { buildGradeBookHtml } from "@/tools/grade-book/pdf/build-grade-book-html";
import { buildAttendanceHtml } from "@/tools/attendance-sheet/pdf/build-attendance-html";
import { buildDailyAttendanceHtml } from "@/tools/daily-attendance/pdf/build-daily-attendance-html";
import { buildCahierTextesHtml } from "@/tools/cahier-textes/pdf/build-cahier-textes-html";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Secure PDF endpoint.
 *
 * The client NEVER sends HTML — only `{ tool, payload }` structured data.
 * The server picks a trusted template, HTML-escapes every user-supplied
 * string, builds the HTML itself, and renders it with a hardened headless
 * browser (see lib/server/pdf-renderer.ts). This removes HTML/script
 * injection and SSRF entirely. Abuse is bounded by rate limiting, a body-size
 * cap, and a concurrency limit.
 */

const MAX_BODY_BYTES = 512 * 1024; // structured payloads are tiny
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 30; // requests per window per IP

// Simultaneous Chromium renders. Keep this matched to the server's CPU/RAM —
// too high thrashes the machine. Adapts to CPU count, override via env on the
// production server (e.g. PDF_MAX_CONCURRENT=8 on an 8-core box).
const MAX_CONCURRENT = Math.min(
  Math.max(Number(process.env.PDF_MAX_CONCURRENT) || os.cpus().length, 4),
  8
);
// Requests allowed to wait for a slot before we shed load. Sized to comfortably
// absorb a burst of ~50 simultaneous users (they wait a few seconds, not fail).
const MAX_QUEUE = 100;
// Max time a request waits in the queue before giving up with 503.
const ACQUIRE_TIMEOUT_MS = 25_000;

const CERT_TYPES = new Set(["excellence", "encouragement", "merit"]);

const rateBuckets = new Map<string, { count: number; reset: number }>();
const limiter = new RenderLimiter(MAX_CONCURRENT, MAX_QUEUE);
// Chromium is warmed up at server boot via instrumentation.ts.

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now > bucket.reset) {
    rateBuckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_MAX;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Recursively HTML-escape every string in the payload; leave numbers/bools. */
function deepEscape(value: unknown): unknown {
  if (typeof value === "string") return escapeHtml(value);
  if (Array.isArray(value)) return value.map(deepEscape);
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = deepEscape(v);
    return out;
  }
  return value;
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "too many requests" }, { status: 429 });
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "payload too large" }, { status: 413 });
  }

  let body: { tool?: unknown; payload?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const tool = body.tool;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = deepEscape(body.payload) as any;
  if (typeof tool !== "string" || !payload || typeof payload !== "object") {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }

  // Wait for a render slot (bounded queue); shed load only if the queue is full
  // or the wait exceeds ACQUIRE_TIMEOUT_MS.
  const admitted = await limiter.acquire(ACQUIRE_TIMEOUT_MS);
  if (!admitted) {
    return NextResponse.json({ error: "server busy, retry shortly" }, { status: 503 });
  }

  try {
    let html: string;
    let opts: RenderOptions = {};

    switch (tool) {
      case "exam-sheet":
        html = buildExamSheetHtml(payload);
        break;
      case "exam-stats": {
        const indices = Array.isArray(payload.indices)
          ? payload.indices.filter((i: unknown) => i === 0 || i === 1 || i === 2)
          : [];
        html = buildExamStatsHtml(payload.data, indices);
        break;
      }
      case "unit-plan":
        html = buildUnitPlanHtml(payload);
        break;
      case "certificate":
        if (!CERT_TYPES.has(payload.type)) payload.type = "excellence";
        html = buildCertificateHtml(payload);
        opts = { landscape: true, noMargin: true };
        break;
      case "grading-sheet":
        html = buildGradingSheetHtml(payload.data, payload.config);
        opts = { cssMargins: true };
        break;
      case "grade-book":
        html = buildGradeBookHtml(payload.entries, payload.config);
        opts = { cssMargins: true };
        break;
      case "attendance":
        html = buildAttendanceHtml(payload.classes, payload.config);
        opts = { landscape: true, cssMargins: true };
        break;
      case "daily-attendance":
        html = buildDailyAttendanceHtml(payload.classes, payload.config);
        opts = { cssMargins: true };
        break;
      case "cahier-textes":
        html = buildCahierTextesHtml(payload.config);
        opts = { cssMargins: true };
        break;
      default:
        return NextResponse.json({ error: "unknown tool" }, { status: 400 });
    }

    const pdf = await renderPdf(html, opts);
    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=document.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "pdf generation failed" }, { status: 500 });
  } finally {
    limiter.release();
  }
}
