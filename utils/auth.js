// utils/auth.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export async function registerUser(name, email, password) {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", userCred.user.uid), {
    name,
    email,
    createdAt: Date.now(),
    activeHeroId: null,
  });

  return userCred.user;
}

export async function loginUser(email, password) {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return res.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export function getCurrentUser() {
  return auth.currentUser;
}
