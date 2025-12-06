// services/heroService.js
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../config/firebase";

import { calculateXPNeeded, getXPReward } from "../utils/xpSystem";

const DEFAULT_STATS = {
  intellect: 0,
  wisdom: 0,
  discipline: 0,
};

// --------------------------------------
// Helpers
// --------------------------------------
function withDefaultStats(hero) {
  return {
    ...hero,
    stats: {
      intellect:
        typeof hero.stats?.intellect === "number"
          ? hero.stats.intellect
          : 0,
      wisdom:
        typeof hero.stats?.wisdom === "number" ? hero.stats.wisdom : 0,
      discipline:
        typeof hero.stats?.discipline === "number"
          ? hero.stats.discipline
          : 0,
    },
  };
}

// --------------------------------------
// HERO CRUD
// --------------------------------------
export async function createHero(userId, heroClass, heroName) {
  const heroRef = doc(collection(db, "users", userId, "heroes"));

  await setDoc(heroRef, {
    name: heroName,
    classId: heroClass,
    level: 1,
    xp: 0,
    stats: { ...DEFAULT_STATS },
    createdAt: Date.now(),
  });

  await updateDoc(doc(db, "users", userId), {
    activeHeroId: heroRef.id,
  });

  return heroRef.id;
}

export async function getHero(userId, heroId) {
  const snap = await getDoc(doc(db, "users", userId, "heroes", heroId));
  if (!snap.exists()) return null;

  return withDefaultStats({ id: snap.id, ...snap.data() });
}

export async function getAllHeroes(userId) {
  const snap = await getDocs(collection(db, "users", userId, "heroes"));
  const heroes = [];

  snap.forEach((docSnap) => {
    heroes.push(
      withDefaultStats({ id: docSnap.id, ...docSnap.data() })
    );
  });

  return heroes;
}

// --------------------------------------
// ⚠️ LEGACY XP (KEEP TEMPORARILY)
// --------------------------------------
/**
 * @deprecated Use giveHeroXP instead.
 * This exists ONLY to avoid breaking old code.
 */
export async function giveXP(userId, heroId, moduleType, difficulty = "easy") {
  const xpGain = getXPReward(moduleType, difficulty);
  return giveHeroXP(userId, heroId, xpGain, {
    source: "legacy",
    moduleType,
    difficulty,
  });
}

// --------------------------------------
// ✅ MAIN XP FUNCTION (TRANSACTION SAFE)
// --------------------------------------
/**
 * JSON-driven XP award
 *
 * @param {string} userId
 * @param {string} heroId
 * @param {number} xpGain
 * @param {object} meta (optional)
 */
export async function giveHeroXP(
  userId,
  heroId,
  xpGain,
  meta = {}
) {
  if (!xpGain || xpGain <= 0) return null;

  const ref = doc(db, "users", userId, "heroes", heroId);

  const result = await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Hero not found");

    const hero = snap.data();
    let newXP = hero.xp + xpGain;
    let newLevel = hero.level;
    let xpCap = calculateXPNeeded(hero.level);

    while (newXP >= xpCap) {
      newXP -= xpCap;
      newLevel++;
      xpCap = calculateXPNeeded(newLevel);
    }

    tx.update(ref, {
      xp: newXP,
      level: newLevel,
      lastXPEvent: {
        amount: xpGain,
        ...meta,
        at: Date.now(),
      },
    });

    return withDefaultStats({
      id: heroId,
      ...hero,
      xp: newXP,
      level: newLevel,
    });
  });

  return result;
}
