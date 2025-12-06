// services/trainingService.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { formatDate } from "../utils/dateUtils";
import { giveXP } from "./heroService";

export async function completeTrainingModule(userId, heroId, type, moduleId) {
  const ref = doc(db, "users", userId, "heroes", heroId, "training", `${type}_${moduleId}`);

  // Mark module as completed
  await setDoc(ref, {
    moduleId,
    type,
    completedAt: Date.now(),
    formattedDate: formatDate(Date.now()),
  });

  // Award XP
  const result = await giveXP(userId, heroId, type, "medium");

  return {
    completed: true,
    xpReward: result,
  };
}

export async function getTrainingStatus(userId, heroId, type, moduleId) {
  const ref = doc(db, "users", userId, "heroes", heroId, "training", `${type}_${moduleId}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function getAllTrainingRecords(userId, heroId) {
  // You can expand this if you want a full list of completed modules
}
