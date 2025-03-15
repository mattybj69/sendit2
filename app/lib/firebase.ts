import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAuyOZ56X24y1YLnC-7UgLxKoKbp0YLwD8",
  authDomain: "sendit-a9cd9.firebaseapp.com",
  projectId: "sendit-a9cd9",
  storageBucket: "sendit-a9cd9.firebasestorage.app",
  messagingSenderId: "579961704130",
  appId: "1:579961704130:web:b3e4aa0b47184359d7355b",
  measurementId: "G-ZQLS21VC19"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then(yes => yes && (analytics = getAnalytics(app)));
}

export { auth, db, analytics }; 