import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { FS } from "@/lib/firestore-schema";

export const dynamic = 'force-dynamic';

export async function POST() {
  if (!adminDb) return NextResponse.json({ error: "no db" });
  
  const snap = await adminDb.collection("mentor_assignments").get();
  
  const usersSnap = await adminDb.collection("users").get();
  const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() } as Record<string, any>));
  
  if (snap.empty) {
    // Seed an assignment
    const mentor = users.find(u => u.role === "mentor" && u.email === "sulemanzaheer09@gmail.com");
    const intern = users.find(u => u.role === "intern");
    const admin = users.find(u => u.role === "admin");
    
    if (mentor && intern && admin) {
      const newRef = adminDb.collection("mentor_assignments").doc();
      const now = new Date().toISOString();
      await newRef.set({
        id: newRef.id,
        mentor_id: mentor.id,
        intern_id: intern.id,
        assigned_by: admin.id,
        status: "active",
        assigned_at: now,
        ended_at: null,
        created_at: now,
        updated_at: now,
      });
    }
  }

  const finalSnap = await adminDb.collection("mentor_assignments").get();
  return NextResponse.json({
    assignments: finalSnap.docs.map(d => d.data())
  });
}
