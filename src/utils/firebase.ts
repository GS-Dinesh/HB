import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8RVBp-T0eir7dbbB7ZiNF-QkEdLU4z6k",
  authDomain: "habit-tracker-6e1f2.firebaseapp.com",
  projectId: "habit-tracker-6e1f2",
  storageBucket: "habit-tracker-6e1f2.firebasestorage.app",
  messagingSenderId: "377279757782",
  appId: "1:377279757782:web:dbfdae44ec3bf396487877",
  measurementId: "G-RHER7V26P8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore Storage Helpers
export async function saveUserData(uid: string, data: any): Promise<void> {
  const docRef = doc(db, "user_progress", uid);
  await setDoc(docRef, data);
}

export async function fetchUserData(uid: string): Promise<any | null> {
  const docRef = doc(db, "user_progress", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data();
  }
  return null;
}

export { signInWithPopup, signOut };
