import { TALENT_EFFECTS } from "../config/talentEffects";

export function canAccessModule(module, hero) {
  if (!module) return false;

  if (module.starter === true) return true;
  if (!hero) return false;

  if (module.requirements?.completedModules?.length) {
    if (
      !module.requirements.completedModules.every((id) =>
        hero.completedModules.includes(id)
      )
    )
      return false;
  }

  if (module.requirements?.stats) {
    for (const stat in module.requirements.stats) {
      let effective = hero.stats?.[stat] ?? 0;

      hero.talents?.forEach((t) => {
        const effect = TALENT_EFFECTS[t];
        if (effect?.requirementModifier?.stat === stat) {
          effective += effect.requirementModifier.bonus;
        }
      });

      if (effective < module.requirements.stats[stat]) return false;
    }
  }

  return true;
}
