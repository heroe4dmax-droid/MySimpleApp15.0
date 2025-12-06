import { ScrollView, Text } from "react-native";

export default function BasketballModule3() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 3 – Offensive Systems</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Basic Offensive Actions</Text>
      <Text>
        • Pick and roll{"\n"}
        • Dribble handoff (DHO){"\n"}
        • Off-ball screens{"\n"}
        • Cuts: flare, curl, backdoor
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Offensive Styles</Text>
      <Text>
        • Motion offense{"\n"}
        • 5-out spacing{"\n"}
        • Triangle offense{"\n"}
        • Pace and space{"\n"}
        • Isolation sets
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Modern NBA Offense</Text>
      <Text>
        • High pick-and-roll dominance{"\n"}
        • Stretch bigs{"\n"}
        • 3-point prioritization{"\n"}
        • Positionless basketball
      </Text>
    </ScrollView>
  );
}
