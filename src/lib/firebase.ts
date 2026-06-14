import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

// Suppress known Firebase GRPC background connection errors in Next.js Server Components
const originalConsoleError = console.error;
console.error = (...args) => {
  const msg = args.map(a => (a && typeof a === 'object' && a.message) ? a.message : String(a)).join(' ');
  if (
    msg.includes("GRPC error has no .code") || 
    msg.includes("GrpcConnection RPC") ||
    msg.includes("@firebase/firestore")
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app;
let firestoreDb;

// Prevent duplicate initialization in Next.js hot-reload environments
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app);
} else {
  app = getApps()[0];
  firestoreDb = getFirestore(app);
}

export const firestore = firestoreDb;
