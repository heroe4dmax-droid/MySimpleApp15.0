import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../config/firebase";

const DEFAULT_STATS = {
  intellect: 0,
  wisdom: 0,
  discipline: 0,
};

function normalizeHero(hero) {
  return {
    ...hero,
    stats: { ...DEFAULT_STATS, ...(hero.stats || {}) },
    completedModules: hero.completedModules || [],
    talents: hero.talents || [],
    talentPoints: hero.talentPoints || 0,
  };
}

export async function getHero(userId, heroId) {
  const snap = await getDoc(doc(db, "users", userId, "heroes", heroId));
  if (!snap.exists()) return null;
  return normalizeHero({ id: snap.id, ...snap.data() });
}

export async function giveHeroXP(userId, heroId, xpGain) {
  if (!xpGain || xpGain <= 0) return null;

  const ref = doc(db, "users", userId, "heroes", heroId);

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Hero not found");

    const hero = normalizeHero(snap.data());
    tx.update(ref, { xp: (hero.xp || 0) + xpGain });

    return { ...hero, xp: (hero.xp || 0) + xpGain };
  });
}

export async function completeModule({
  userId,
  heroId,
  moduleId,
  statRewards = {},
  talentPointsReward = 0,
}) {
  const ref = doc(db, "users", userId, "heroes", heroId);

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists()) throw new Error("Hero not found");

    const hero = normalizeHero(snap.data());
    if (hero.completedModules.includes(moduleId)) return;

    const updatedStats = { ...hero.stats };
    Object.keys(statRewards).forEach((k) => {
      updatedStats[k] += statRewards[k];
    });

    tx.update(ref, {
      completedModules: [...hero.completedModules, moduleId],
      stats: updatedStats,
      talentPoints: hero.talentPoints + talentPointsReward,
    });
  });
}
