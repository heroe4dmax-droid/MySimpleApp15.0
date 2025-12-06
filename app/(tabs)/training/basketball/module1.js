import { ScrollView, Text } from "react-native";

export default function BasketballModule1() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 1 – Foundations & History</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Origins of Basketball</Text>
      <Text>
        • Invented by James Naismith in 1891{"\n"}
        • Created as an indoor sport for conditioning{"\n"}
        • Original rules: 13 rules, no dribbling
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Modern Basketball</Text>
      <Text>
        • NBA structure{"\n"}
        • College basketball (NCAA){"\n"}
        • International (FIBA) differences
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Fundamental Concepts</Text>
      <Text>
        • Court layout{"\n"}
        • Ball movement{"\n"}
        • Spacing{"\n"}
        • Roles: guard, wing, forward, center
      </Text>
    </ScrollView>
  );
}
