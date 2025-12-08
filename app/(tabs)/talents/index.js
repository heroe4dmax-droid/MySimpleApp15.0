import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { RBT_TALENTS } from "../../../config/talents/rbtTalents";
import { canUnlockTalent } from "../../../utils/talentSystem";

export default function TalentTree({ hero }) {
  const branches = ["assessment", "intervention", "ethics"];

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>
        Talent Points: {hero.talentPoints}
      </Text>

      {branches.map(branch => (
        <View key={branch} style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {branch.toUpperCase()}
          </Text>

          {RBT_TALENTS
            .filter(t => t.branch === branch)
            .sort((a, b) => a.tier - b.tier)
            .map(talent => {
              const unlocked = hero.talents.includes(talent.id);
              const canUnlock = canUnlockTalent(talent, hero);

              return (
                <TouchableOpacity
                  key={talent.id}
                  disabled={!canUnlock}
                  style={{
                    padding: 12,
                    marginVertical: 6,
                    backgroundColor: unlocked
                      ? "#4caf50"
                      : canUnlock
                      ? "#2196f3"
                      : "#999",
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {talent.title}
                  </Text>
                  <Text style={{ color: "#eee" }}>
                    {talent.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </View>
      ))}
    </ScrollView>
  );
}
