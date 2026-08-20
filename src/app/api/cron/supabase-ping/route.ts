/**
 * GET /api/cron/supabase-ping
 *
 * A lightweight keep-alive endpoint for the Supabase free-tier project.
 * Supabase pauses free projects after ~1 week of inactivity, causing
 * "fetch failed" errors on the first upload after a quiet period.
 *
 * This route performs a cheap storage list (1 item) to wake the project.
 *
 * Schedule this via an external cron service (e.g. cron-job.org, GitHub Actions,
 * or Vercel Cron) to run every 3-5 days to prevent the project from pausing.
 *
 * Secure with CRON_SECRET env var — set it to any random secret string.
 * The caller must send: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { pingSupabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  // Security: check bearer token to prevent abuse
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const start = Date.now();
  const alive = await pingSupabase();
  const latencyMs = Date.now() - start;

  if (!alive) {
    return NextResponse.json(
      {
        ok: false,
        message: "Supabase ping failed — project may still be waking up. Try again in 30s.",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Supabase is awake and responding.",
    latencyMs,
    timestamp: new Date().toISOString(),
  });
}
