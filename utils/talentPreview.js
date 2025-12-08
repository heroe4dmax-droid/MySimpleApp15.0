export function getModulesUnlockedByTalent(talentId, modules) {
  return modules.filter(m =>
    m.requirements?.talents?.anyOf?.includes(talentId)
  );
}
