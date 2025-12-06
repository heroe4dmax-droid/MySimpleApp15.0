// utils/heroUtils.js
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

import { calculateXPNeeded } from "./xpSystem";

export async function createHero(userId, heroClassId, name = "New Hero") {
  const heroRef = doc(collection(db, "users", userId, "heroes"));

  await setDoc(heroRef, {
    name,
    classId: heroClassId,
    level: 1,
    xp: 0,
    createdAt: Date.now(),
  });

  await updateDoc(doc(db, "users", userId), {
    activeHeroId: heroRef.id,
  });

  return heroRef.id;
}

export async function getHeroes(userId) {
  const snap = await getDocs(collection(db, "users", userId, "heroes"));
  let heroes = [];
  snap.forEach((d) => heroes.push({ id: d.id, ...d.data() }));
  return heroes;
}

export async function getHero(userId, heroId) {
  const ref = doc(db, "users", userId, "heroes", heroId);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function setActiveHero(userId, heroId) {
  await updateDoc(doc(db, "users", userId), {
    activeHeroId: heroId,
  });
}

export async function giveHeroXP(userId, heroId, amount) {
  const ref = doc(db, "users", userId, "heroes", heroId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const hero = snap.data();
  let newXP = hero.xp + amount;
  let newLevel = hero.level;
  let xpCap = calculateXPNeeded(hero.level);

  while (newXP >= xpCap) {
    newXP -= xpCap;
    newLevel++;
    xpCap = calculateXPNeeded(newLevel);
  }

  await updateDoc(ref, {
    xp: newXP,
    level: newLevel,
  });

  return { xp: newXP, level: newLevel };
}
