import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log("🔥 Firebase: Config loaded:", {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ Present" : "❌ Missing",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "✅ Present" : "❌ Missing",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "✅ Present" : "❌ Missing",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? "✅ Present" : "❌ Missing",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? "✅ Present" : "❌ Missing",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? "✅ Present" : "❌ Missing",
});

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("🔥 Firebase: App initialized successfully");

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
console.log("🔥 Firebase: Auth service initialized");

export default app;
