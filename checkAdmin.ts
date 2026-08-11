import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local before requiring modules
config({ path: resolve(process.cwd(), '.env.local') });

// Use require so that process.env is populated before execution
const { adminAuth, adminDb } = require('./src/lib/firebase-admin');

async function checkAdmin() {
  const email = 'samstacktechs@gmail.com';
  const password = 'Salman123@';
  
  try {
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(email);
      console.log('User exists in Firebase Auth:', userRecord.uid);
      await adminAuth.updateUser(userRecord.uid, { password });
      console.log('Password updated.');
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        console.log('User not found in Auth. Creating...');
        userRecord = await adminAuth.createUser({
          email,
          password,
          emailVerified: true,
        });
        console.log('Created user:', userRecord.uid);
      } else {
        throw e;
      }
    }

    // Check Firestore
    const dbUser = await adminDb.collection('users').doc(userRecord.uid).get();
    if (!dbUser.exists) {
      console.log('User not found in Firestore. Creating admin record...');
      await adminDb.collection('users').doc(userRecord.uid).set({
        email,
        full_name: 'Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
      });
      console.log('Firestore admin created.');
    } else {
      console.log('User exists in Firestore:', dbUser.data());
      if (dbUser.data()?.role !== 'admin') {
         await adminDb.collection('users').doc(userRecord.uid).update({ role: 'admin' });
         console.log('Updated role to admin');
      }
    }
    
    console.log('Admin check complete.');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdmin();
