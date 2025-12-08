import { formatTitle } from "./formatters";

export function getTalentLockReasons(talent, hero) {
  const reasons = [];

  if (hero.talents.includes(talent.id)) {
    return [{ message: "Already unlocked" }];
  }

  if (hero.talentPoints < talent.cost) {
    reasons.push({
      message: `Requires ${talent.cost} talent point(s)`,
    });
  }

  if (talent.requires?.length) {
    talent.requires.forEach(req => {
      if (!hero.talents.includes(req)) {
        reasons.push({
          message: `Requires ${formatTitle(req)}`,
        });
      }
    });
  }

  return reasons;
}
