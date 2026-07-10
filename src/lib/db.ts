import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  deleteDoc,
  runTransaction,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore/lite";
import { firestore } from "./firebase";

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────

export interface Intern {
  id: string;
  fullName: string;
  email: string;
  university: string;
  trackSelected: 'PYTHON' | 'UI_UX' | 'CPP' | 'WEB_DEV' | 'REACT' | 'NEXT_JS' | 'MERN';
  rollNumber: string;
  applicationTimestamp: string;
  status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  submissionData: null | {
    submissionTimestamp: string;
    githubRepositoryUrl: string;
    liveDeploymentUrl?: string;
    figmaProjectUrl?: string;
    studentNotes: string;
    completedTaskCount: number;
    completedTasks: number[];
  };
}

export interface Certificate {
  certificateNumber: string;
  associatedRollNumber: string;
  recipientName: string;
  trackTitle: string;
  issuanceDate: string;
  isValid: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  contentMarkdown: string;
  excerpt: string;
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
  tags: string[];
  publishedAt: string;
  isFeatured: boolean;
}

export interface ClientMessage {
  id: string;
  clientName: string;
  clientEmail: string;
  organization: string;
  serviceType: string;
  budget: string;
  message: string;
  timestamp: string;
  status: 'UNREAD' | 'READ' | 'RESPONDED';
}

// ─────────────────────────────────────────────
//  Collection names
// ─────────────────────────────────────────────

const COLLECTIONS = {
  INTERNS: "interns",
  CERTIFICATES: "certificates",
  POSTS: "posts",
  MESSAGES: "messages",
  COUNTERS: "counters",
} as const;

const COUNTER_DOC = "global";

// ─────────────────────────────────────────────
//  Seed initial blog posts (runs once)
// ─────────────────────────────────────────────

const INITIAL_POSTS: BlogPost[] = [
  {
    id: "post-1",
    title: "Next.js 15 & Serverless Edge: Orchestrating Decoupled Architecture",
    slug: "nextjs-15-serverless-edge-decoupled-architecture",
    excerpt: "How to architecture high-throughput full-stack endpoints with sub-50ms Edge compute times and zero infrastructure costs.",
    contentMarkdown: `## Decoupling Serverless Functions from Rendering Engines

In traditional serverless applications, the user's client request waits synchronously for slow back-end operations to finish. This creates a double penalty:
1. **LCP & UX Degradation:** The client experiences high-latency white screens.
2. **Compute Cost Exhaustion:** The serverless function remains warm and active, eating into execution budgets.

### The SAMStack Philosophy: Decoupled Queueing

At **SAMStack Tech**, we resolve this by enforcing a zero-wait execution cycle. When an intern applies, we process the metadata and database entries synchronously in under **10ms**, and immediately dispatch an asynchronous trigger to Firebase in the background.

\`\`\`javascript
// Immediate edge return context
const rollNumber = await db.interns.create({ ...profile });

// Asynchronous Firestore log (Fire and Forget)
db.messages.create({ ...auditPayload }).catch(console.error);

return NextResponse.json({ rollNumber }, { status: 201 });
\`\`\`

By offloading PDF rendering and SMTP mailing to a decoupled cloud service, our Edge handlers remain lightning fast, achieving perfect LCP scores while maintaining $0 operational costs.`,
    author: {
      name: "Suleman Zaheer",
      role: "Founder & Lead Engineer",
      avatarUrl: "/avatars/suleman.jpg"
    },
    tags: ["NEXTJS", "DEVOPS", "SERVERLESS"],
    publishedAt: "2026-05-15T08:00:00.000Z",
    isFeatured: true
  },
  {
    id: "post-2",
    title: "The Anatomy of Obsidian Aesthetics: Designing Dark-Luxury UI Panels",
    slug: "anatomy-of-obsidian-aesthetics-dark-luxury-ui",
    excerpt: "A deep dive into professional contrast, glassmorphism filters, variable HSL spacing, and layout scaling rules.",
    contentMarkdown: `## Core Luxury Design Principles

Elite software studios require elite brand validation. The aesthetic standard of your portals directly correlates to the premium value your enterprise provides. We avoid generic, high-brightness primary colors, opting instead for deep obsidian base scales, fine light-border layouts, and dynamic neon cybernetic accents.

### Color Coordinate Reference Systems

To establish proper dark luxury, avoid absolute flat black (\`#000000\`). We utilize a deep, layered sapphire-obsidian slate palette:

*   **Primary Background:** \`#0b0f19\` (Deep Midnight Slate)
*   **Card Containers:** \`rgba(17, 24, 39, 0.65)\` (Glassmorphism overlay)
*   **Borders:** \`1px solid rgba(255, 255, 255, 0.08)\` (Faint white outline)
*   **Cyber Highlight:** \`#06b6d4\` (Neon Cyan glow)

### The Magic of Glassmorphism

Standard cards feel heavy. Glass containers feel alive because they allow background textures to bleed through. Accomplish this dynamically using pure CSS properties:

\`\`\`css
.luxury-card {
  background: rgba(17, 24, 39, 0.65);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-card:hover {
  border-color: rgba(6, 182, 212, 0.4);
  box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
  transform: translateY(-2px);
}
\`\`\`

Applying smooth CSS transformations and subtle cyan-glowing shadows on hover elements provides candidates with micro-feedback mechanisms that feel premium, fluid, and robust.`,
    author: {
      name: "Suleman Zaheer",
      role: "Founder & Lead Engineer",
      avatarUrl: "/avatars/suleman.jpg"
    },
    tags: ["UI_UX", "CSS", "BRANDING"],
    publishedAt: "2026-05-16T12:00:00.000Z",
    isFeatured: false
  }
];

async function seedPostsIfNeeded() {
  const colRef = collection(firestore, COLLECTIONS.POSTS);
  const snap = await getDocs(colRef);
  if (!snap.empty) return;

  for (const post of INITIAL_POSTS) {
    await setDoc(doc(firestore, COLLECTIONS.POSTS, post.id), post);
  }
}

// ─────────────────────────────────────────────
//  Counter helper (atomic roll number sequence)
// ─────────────────────────────────────────────

async function getNextSequence(): Promise<number> {
  const counterRef = doc(firestore, COLLECTIONS.COUNTERS, COUNTER_DOC);
  const nextSeq = await runTransaction(firestore, async (tx) => {
    const snap = await tx.get(counterRef);
    const current = snap.exists() ? (snap.data().lastAssignedSequence as number) : 0;
    const next = current + 1;
    tx.set(counterRef, { lastAssignedSequence: next }, { merge: true });
    return next;
  });
  return nextSeq;
}

// ─────────────────────────────────────────────
//  DB Access Methods — same interface as before
// ─────────────────────────────────────────────

export const db = {
  interns: {
    async list(): Promise<Intern[]> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.INTERNS));
      return snap.docs.map(d => d.data() as Intern);
    },

    async get(id: string): Promise<Intern | null> {
      // Try by document ID first
      const byId = await getDoc(doc(firestore, COLLECTIONS.INTERNS, id));
      if (byId.exists()) return byId.data() as Intern;

      // Fall back to querying by rollNumber
      const q = query(
        collection(firestore, COLLECTIONS.INTERNS),
        where("rollNumber", "==", id)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as Intern;
    },

    async getByEmailAndRoll(email: string, rollNumber: string): Promise<Intern | null> {
      const q = query(
        collection(firestore, COLLECTIONS.INTERNS),
        where("email", "==", email.toLowerCase()),
        where("rollNumber", "==", rollNumber)
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as Intern;
    },

    async create(intern: Omit<Intern, 'id' | 'applicationTimestamp' | 'rollNumber' | 'status' | 'submissionData'>): Promise<Intern> {
      const sequence = await getNextSequence();
      const rollNumber = `SAM-2026-${String(sequence).padStart(4, '0')}`;
      const id = `intern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const newIntern: Intern = {
        ...intern,
        id,
        email: intern.email.toLowerCase(),
        rollNumber,
        applicationTimestamp: new Date().toISOString(),
        status: 'APPLIED',
        submissionData: null,
      };

      await setDoc(doc(firestore, COLLECTIONS.INTERNS, id), newIntern);
      return newIntern;
    },

    async updateStatus(id: string, status: 'APPLIED' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'): Promise<boolean> {
      // Resolve document ID
      const intern = await db.interns.get(id);
      if (!intern) return false;
      await updateDoc(doc(firestore, COLLECTIONS.INTERNS, intern.id), { status });
      return true;
    },

    async submitWork(id: string, submission: Record<string, unknown>): Promise<boolean> {
      const intern = await db.interns.get(id);
      if (!intern) return false;
      await updateDoc(doc(firestore, COLLECTIONS.INTERNS, intern.id), {
        status: 'SUBMITTED',
        submissionData: submission,
      });
      return true;
    },

    async delete(id: string): Promise<boolean> {
      const intern = await db.interns.get(id);
      if (!intern) return false;
      await deleteDoc(doc(firestore, COLLECTIONS.INTERNS, intern.id));
      return true;
    },

    async purgeAll(): Promise<boolean> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.INTERNS));
      const certSnap = await getDocs(collection(firestore, COLLECTIONS.CERTIFICATES));
      const counterRef = doc(firestore, COLLECTIONS.COUNTERS, COUNTER_DOC);

      await runTransaction(firestore, async (tx) => {
        snap.docs.forEach(d => tx.delete(d.ref));
        certSnap.docs.forEach(d => tx.delete(d.ref));
        tx.set(counterRef, { lastAssignedSequence: 0 });
      });
      return true;
    }
  },

  certificates: {
    async list(): Promise<Certificate[]> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.CERTIFICATES));
      return snap.docs.map(d => d.data() as Certificate);
    },

    async get(certificateNumber: string): Promise<Certificate | null> {
      const q = query(
        collection(firestore, COLLECTIONS.CERTIFICATES),
        where("certificateNumber", "==", certificateNumber.toUpperCase())
      );
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return snap.docs[0].data() as Certificate;
    },

    async create(certificate: Omit<Certificate, 'issuanceDate' | 'isValid'>): Promise<Certificate> {
      // Check for duplicate (by roll number)
      const q = query(
        collection(firestore, COLLECTIONS.CERTIFICATES),
        where("associatedRollNumber", "==", certificate.associatedRollNumber)
      );
      const existing = await getDocs(q);
      if (!existing.empty) return existing.docs[0].data() as Certificate;

      const newCert: Certificate = {
        ...certificate,
        certificateNumber: certificate.certificateNumber.toUpperCase(),
        issuanceDate: new Date().toISOString(),
        isValid: true,
      };

      await setDoc(
        doc(firestore, COLLECTIONS.CERTIFICATES, newCert.certificateNumber),
        newCert
      );
      return newCert;
    }
  },

  posts: {
    async list(): Promise<BlogPost[]> {
      try {
        await seedPostsIfNeeded();
        const snap = await getDocs(collection(firestore, COLLECTIONS.POSTS));
        return snap.docs.map(d => d.data() as BlogPost);
      } catch (error) {
        console.warn("Falling back to local INITIAL_POSTS due to Firebase error.");
        return INITIAL_POSTS;
      }
    },

    async getBySlug(slug: string): Promise<BlogPost | null> {
      try {
        await seedPostsIfNeeded();
        const q = query(
          collection(firestore, COLLECTIONS.POSTS),
          where("slug", "==", slug)
        );
        const snap = await getDocs(q);
        if (snap.empty) return null;
        return snap.docs[0].data() as BlogPost;
      } catch (error) {
        console.warn("Falling back to local INITIAL_POSTS for slug due to Firebase error.");
        return INITIAL_POSTS.find(p => p.slug === slug) || null;
      }
    }
  },

  messages: {
    async list(): Promise<ClientMessage[]> {
      const snap = await getDocs(collection(firestore, COLLECTIONS.MESSAGES));
      return snap.docs.map(d => d.data() as ClientMessage);
    },

    async create(message: Omit<ClientMessage, 'id' | 'timestamp' | 'status'>): Promise<ClientMessage> {
      const newMessage: ClientMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        timestamp: new Date().toISOString(),
        status: 'UNREAD',
      };
      await setDoc(doc(firestore, COLLECTIONS.MESSAGES, newMessage.id), newMessage);
      return newMessage;
    },

    async updateStatus(id: string, status: 'UNREAD' | 'READ' | 'RESPONDED'): Promise<boolean> {
      const ref = doc(firestore, COLLECTIONS.MESSAGES, id);
      const snap = await getDoc(ref);
      if (!snap.exists()) return false;
      await updateDoc(ref, { status });
      return true;
    }
  }
};
