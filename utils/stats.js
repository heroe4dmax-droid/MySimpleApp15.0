// utils/stats.js

export function calculateHeroStats(heroClass, level) {
  const base = heroClass.baseStats;

  return {
    strength: base.strength + level * 1,
    agility: base.agility + level * 1,
    intelligence: base.intelligence + level * 1,
    stamina: base.stamina ? base.stamina + level * 1 : 5 + level,
    coordination: base.coordination ? base.coordination + level * 1 : 5 + level,
  };
}

// Text formatting for UI
export function formatStats(stats) {
  return `
Strength: ${stats.strength}
Agility: ${stats.agility}
Intelligence: ${stats.intelligence}
Stamina: ${stats.stamina}
Coordination: ${stats.coordination}
`;
}
