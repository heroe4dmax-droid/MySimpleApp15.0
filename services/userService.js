// services/userService.js
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export async function getUser(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function updateUser(userId, data) {
  await updateDoc(doc(db, "users", userId), data);
}

export async function setActiveHero(userId, heroId) {
  await updateDoc(doc(db, "users", userId), {
    activeHeroId: heroId,
  });
}

export async function initializeUser(userId, name, email) {
  await setDoc(doc(db, "users", userId), {
    name,
    email,
    createdAt: Date.now(),
    activeHeroId: null,
  });
}
