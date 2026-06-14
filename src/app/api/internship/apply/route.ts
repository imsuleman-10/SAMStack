import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tracks } from "@/lib/curriculum";
import { generateOfferLetterPDF } from "@/lib/pdfTemplates";
import { sendOfferLetterEmail } from "@/lib/mailer";

const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // 5 applications per minute per IP

export async function POST(request: NextRequest) {
  try {
    // Basic IP Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "unknown-ip";
    console.log('FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    const now = Date.now();
    const clientData = rateLimit.get(ip);
    
    if (clientData && now - clientData.timestamp < RATE_LIMIT_WINDOW) {
      if (clientData.count >= MAX_REQUESTS) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
      }
      clientData.count += 1;
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    const body = await request.json();
    const { fullName, email, track, university } = body;

    // Validate inputs
    if (!fullName || !fullName.trim()) {
      return NextResponse.json({ error: "Candidate full name is required." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid candidate email address is required." }, { status: 400 });
    }
    if (!track) {
      return NextResponse.json({ error: "A valid specialization track must be selected." }, { status: 400 });
    }

    const uppercaseTrack = track.toUpperCase();
    const validTracks = ["PYTHON", "UI_UX", "CPP", "WEB_DEV", "REACT", "NEXT_JS", "MERN"];
    if (!validTracks.includes(uppercaseTrack)) {
      return NextResponse.json({ error: `Selected track '${track}' is invalid.` }, { status: 400 });
    }

    // Attempt to register candidate in database
    const result = await db.interns.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      trackSelected: uppercaseTrack as any,
      university: (university || "Not Specified").trim()
    });

    if (!result) {
      return NextResponse.json({ error: "Failed to create candidate profile. Please try again." }, { status: 500 });
    }

    const trackTitle = tracks[uppercaseTrack as keyof typeof tracks]?.title || uppercaseTrack;

    console.log(`[FIREBASE] APPLICANT_REGISTERED: ${result.rollNumber} — ${result.fullName} (${trackTitle})`);

    // Asynchronously generate and send offer letter
    const processOfferLetter = async () => {
      try {
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const pdfBuffer = await generateOfferLetterPDF({
          fullName: result.fullName,
          rollNumber: result.rollNumber,
          track: trackTitle,
          date: dateStr,
        });

        await sendOfferLetterEmail(
          result.email,
          result.fullName,
          result.rollNumber,
          trackTitle,
          pdfBuffer
        );
        console.log(`[MAILER] Offer letter sent to ${result.email}`);
      } catch (err) {
        console.error(`[MAILER] Failed to send offer letter to ${result.email}`, err);
      }
    };

    // Process offer letter synchronously to ensure it completes before Next.js terminates the execution context
    await processOfferLetter();

    // Immediately return 201 to the client
    return NextResponse.json({
      success: true,
      message: "Application registered successfully.",
      rollNumber: result.rollNumber,
      fullName: result.fullName,
      email: result.email,
      track: result.trackSelected,
      status: result.status,
      appliedAt: result.applicationTimestamp
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("API error during application registration:", error);
    require('fs').writeFileSync('debug_error.log', String(error) + '\n' + (error as any).stack);
    return NextResponse.json({ error: "Internal server error occurred while processing application.", details: String(error) }, { status: 500 });
  }
}
