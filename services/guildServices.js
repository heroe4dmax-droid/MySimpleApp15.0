// services/guildService.js
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import guildRanks from "../config/guildRanks.json";

export function getRankFromXP(xp) {
  let currentRank = guildRanks.ranks[0];

  guildRanks.ranks.forEach((rank) => {
    if (xp >= rank.xpRequired) {
      currentRank = rank;
    }
  });

  return currentRank;
}

export async function getGuildStatus(userId) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;

  const data = snap.data();
  const xp = data.guildXP || 0;
  return {
    currentRank: getRankFromXP(xp),
    xp,
  };
}

export async function addGuildXP(userId, amount) {
  const ref = doc(db, "users", userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  const data = snap.data();
  const newXP = (data.guildXP || 0) + amount;

  await updateDoc(ref, {
    guildXP: newXP,
  });

  return getRankFromXP(newXP);
}
