import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { requireAuth, isAuthError } from '@/lib/session';
import { FS } from '@/lib/firestore-schema';
import { generateOfferLetterPDF } from '@/lib/pdfTemplates';
import { sendOfferLetterEmail } from '@/lib/mailer';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const auth = await requireAuth(req, ["admin", "staff"]);
  if (isAuthError(auth)) return auth;
  const { session } = auth;

  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Firebase admin not initialized' }, { status: 500 });
    }

    const { email, password, fullName, gender, track } = await req.json();

    if (!email || !password || !fullName || !gender || !track) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Create user in Firebase Auth
    let userRecord;
    try {
      userRecord = await adminAuth.createUser({
        email: normalizedEmail,
        password,
        displayName: fullName,
        emailVerified: true,
      });
    } catch (authError: any) {
      if (authError.code === 'auth/email-already-exists') {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
      }
      throw authError;
    }

    // 2. Set Custom Claims
    await adminAuth.setCustomUserClaims(userRecord.uid, { role: 'intern' });
    const now = new Date().toISOString();

    // 3. Save to Users Collection
    try {
      await adminDb.collection(FS.USERS).doc(userRecord.uid).set({
        id: userRecord.uid,
        full_name: fullName.trim(),
        email: normalizedEmail,
        gender,
        role: 'intern',
        status: 'active',
        visibility: 'public',
        created_at: now,
        updated_at: now,
      });
    } catch (firestoreError) {
      await adminAuth.deleteUser(userRecord.uid).catch(() => {});
      throw firestoreError;
    }

    // 4. Save to Intern Profiles
    const rollNumber = `SAM-${crypto.randomBytes(2).toString('hex').toUpperCase()}-${crypto.randomInt(1000, 10000)}`;
    
    await adminDb.collection(FS.INTERN_PROFILES).doc(userRecord.uid).set({
      user_id: userRecord.uid,
      track_selected: track,
      roll_number: rollNumber,
      certificate_status: null,
      offer_letter_sent: false,
      created_at: now,
      updated_at: now,
    });

    // 5. Automatic Mentor Assignment Logic
    try {
      let mentorName = '';
      const g = gender.toLowerCase();
      const t = track.toLowerCase();

      if (g === 'female') {
        mentorName = 'Suleman Zaheer';
      } else {
        if (t.includes('backend')) {
          mentorName = 'Syed Abdullah';
        } else {
          mentorName = 'Saqib Javed';
        }
      }

      const mentorQuery = await adminDb
        .collection(FS.USERS)
        .where('role', '==', 'mentor')
        .where('full_name', '==', mentorName)
        .get();

      let mentorId = '';
      if (!mentorQuery.empty) mentorId = mentorQuery.docs[0].id;

      if (mentorId) {
        await adminDb.collection(FS.MENTOR_ASSIGNMENTS).add({
          mentor_id: mentorId,
          intern_id: userRecord.uid,
          assigned_by: session.id, // Assigned by the admin who created them
          status: 'active',
          assigned_at: now,
          created_at: now,
          updated_at: now,
        });
      }
    } catch (assignmentError) {
      console.warn('Auto mentor assignment failed:', assignmentError);
    }

    // 6. Generate Offer Letter PDF
    const dateStr = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const pdfBuffer = await generateOfferLetterPDF({ fullName, rollNumber, track, date: dateStr });

    // 7. Send Email
    try {
      await sendOfferLetterEmail(email, fullName, rollNumber, track, pdfBuffer);
      await adminDb.collection(FS.INTERN_PROFILES).doc(userRecord.uid).update({
        offer_letter_sent: true,
      });
    } catch (emailError) {
      console.error('Failed to send offer letter email:', emailError);
    }

    // 8. Log the audit action
    await adminDb.collection(FS.AUDIT_LOGS).add({
      actor_id: session.id,
      action: 'CREATE_USER',
      target_user_id: userRecord.uid,
      metadata: { method: 'admin_add_intern_api' },
      created_at: now,
    }).catch(() => {});

    return NextResponse.json({ success: true, message: 'Intern created successfully', uid: userRecord.uid });

  } catch (error: any) {
    console.error('Admin Intern Create Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
