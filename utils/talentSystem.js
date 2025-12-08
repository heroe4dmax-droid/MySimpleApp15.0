export function canUnlockTalent(talent, hero) {
  if (hero.talents.includes(talent.id)) return false;
  if (hero.talentPoints < talent.cost) return false;

  if (talent.requires?.length) {
    if (!talent.requires.every(r => hero.talents.includes(r))) {
      return false;
    }
  }

  return true;
}
