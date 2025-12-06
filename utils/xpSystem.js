// utils/xpSystem.js

// XP needed per level (scales up)
export function calculateXPNeeded(level) {
  return 1000 + level * 250; // example: level 1 → 1250, level 2 → 1500...
}

// XP awarded for completing modules
export const xpRewards = {
  rbt: 300,
  cpt: 300,
  basketball: 300,
};

// XP multipliers
export const xpMultiplier = {
  easy: 1,
  medium: 1.5,
  hard: 2,
};

// Helper function
export function getXPReward(type, difficulty = "easy") {
  const base = xpRewards[type] || 100;
  return Math.floor(base * xpMultiplier[difficulty]);
}
