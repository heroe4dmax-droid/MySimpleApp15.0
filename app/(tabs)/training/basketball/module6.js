import { ScrollView, Text } from "react-native";

export default function BasketballModule6() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 6 – Practice Planning</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Practice Structure</Text>
      <Text>
        • Warm-up{"\n"}
        • Ball-handling series{"\n"}
        • Shooting progression{"\n"}
        • Small-sided games{"\n"}
        • Conditioning{"\n"}
        • Cool-down
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Training Focus</Text>
      <Text>
        • Skill development{"\n"}
        • Tactical development{"\n"}
        • Game-like situations{"\n"}
        • Positional breakdowns
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Weekly Planning</Text>
      <Text>
        • Volume management{"\n"}
        • Rest and recovery{"\n"}
        • Film study{"\n"}
        • Performance tracking
      </Text>
    </ScrollView>
  );
}
