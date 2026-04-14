import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCBntos1AmuP9ZdLWSU-3DpcuOhoEA6bus",
  authDomain: "edushield-979f8.firebaseapp.com",
  projectId: "edushield-979f8",
  storageBucket: "edushield-979f8.firebasestorage.app",
  messagingSenderId: "319712327032",
  appId: "1:319712327032:web:5368c78578d28cdd10848d",
  measurementId: "G-V9CH53TFHR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { app, analytics };
