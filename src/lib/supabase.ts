/**
 * Shared Supabase client with keep-alive and auto-retry.
 *
 * Supabase free-tier projects pause after a period of inactivity,
 * causing the very first request to return a network error ("fetch failed").
 * This module:
 *   1. Exports a singleton Supabase client (avoids re-creating per request).
 *   2. Provides `supabaseUpload()` — a wrapper that automatically retries
 *      once after a short delay if the first attempt throws a fetch error,
 *      giving the project time to wake up.
 *   3. Provides `pingSupabase()` — a lightweight health-check that can be
 *      called from a cron route to keep the project alive.
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// ─── Singleton ────────────────────────────────────────────────────────────────

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error(
        "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
      );
    }

    _client = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return _client;
}

// ─── Sleep helper ─────────────────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Keep-alive ping ──────────────────────────────────────────────────────────

/**
 * Sends a cheap "ping" to Supabase storage to wake up the project.
 * Call this from a scheduled cron route (e.g. /api/cron/supabase-ping).
 */
export async function pingSupabase(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    // Listing the root of the 'avatars' bucket is cheap and requires no data.
    const { error } = await supabase.storage.from("avatars").list("", { limit: 1 });
    if (error) {
      console.warn("[Supabase Ping] Ping returned error:", error.message);
      return false;
    }
    console.log("[Supabase Ping] OK — project is awake.");
    return true;
  } catch (err: any) {
    console.warn("[Supabase Ping] Fetch failed (project may be paused):", err.message);
    return false;
  }
}

// ─── Upload with retry ────────────────────────────────────────────────────────

interface UploadOptions {
  bucket: string;
  path: string;
  body: Buffer | Uint8Array | Blob;
  contentType: string;
  /** How many times to retry on network failure. Default: 2 */
  retries?: number;
  /** Delay in ms between retries. Default: 4000 */
  retryDelayMs?: number;
}

/**
 * Upload a file to Supabase Storage with automatic retry on network errors.
 * If the project is paused, the first request wakes it up; the retry then
 * succeeds once the project is back online (usually within 3-5 seconds).
 *
 * @returns The public URL of the uploaded file.
 * @throws  If all retry attempts fail.
 */
export async function supabaseUpload({
  bucket,
  path,
  body,
  contentType,
  retries = 3,
  retryDelayMs = 6000,
}: UploadOptions): Promise<string> {
  const supabase = getSupabaseClient();

  // ── Pre-flight ping: wake up the project before the first upload attempt ──
  // This adds ~1s overhead on cold starts but prevents the first attempt from
  // timing out entirely when the project is paused.
  try {
    const { error: pingError } = await supabase.storage.from(bucket).list("", { limit: 1 });
    if (pingError) {
      console.warn("[Supabase Upload] Pre-flight ping returned error:", pingError.message, "— will retry upload anyway.");
      await sleep(retryDelayMs);
    } else {
      console.log("[Supabase Upload] Pre-flight ping OK — project is awake.");
    }
  } catch {
    console.warn("[Supabase Upload] Pre-flight ping threw — project may be waking up. Waiting before upload…");
    await sleep(retryDelayMs);
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`[Supabase Upload] Attempt ${attempt}/${retries + 1} — bucket: ${bucket}, path: ${path}`);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, body, { contentType, upsert: true });

      if (uploadError) {
        throw new Error("Supabase upload failed: " + uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      const publicUrl = publicUrlData.publicUrl;

      console.log(`[Supabase Upload] ✓ Uploaded to ${publicUrl}`);
      return publicUrl;
    } catch (err: any) {
      lastError = err;

      // Detect all known "project paused / waking up" error signatures
      const msg: string = (err.message ?? "").toLowerCase();
      const isRetryable =
        msg.includes("fetch failed") ||
        msg.includes("network") ||
        msg.includes("timed out") ||
        msg.includes("timeout") ||
        msg.includes("connection") ||
        msg.includes("econnrefused") ||
        msg.includes("enotfound") ||
        msg.includes("socket") ||
        msg.includes("paused") ||
        msg.includes("starting up") ||
        err.code === "ECONNREFUSED" ||
        err.code === "ENOTFOUND" ||
        err.code === "ETIMEDOUT";

      if (isRetryable && attempt <= retries) {
        console.warn(
          `[Supabase Upload] Retryable error on attempt ${attempt}: "${err.message}". ` +
          `Supabase may still be waking up. Retrying in ${retryDelayMs}ms…`
        );
        await sleep(retryDelayMs);
        continue;
      }

      // Non-retryable error or retries exhausted
      break;
    }
  }

  throw lastError ?? new Error("Supabase upload failed after all retries.");
}
