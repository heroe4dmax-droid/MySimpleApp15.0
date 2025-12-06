import { ScrollView, Text } from "react-native";

export default function BasketballModule4() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 4 – Defensive Systems</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Individual Defense</Text>
      <Text>
        • Stance{"\n"}
        • Slides{"\n"}
        • Closeouts{"\n"}
        • Containment{"\n"}
        • On-ball & off-ball positioning
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Team Defensive Systems</Text>
      <Text>
        • Man-to-man{"\n"}
        • Zone defense (2-3, 3-2, 1-3-1){"\n"}
        • Switches{"\n"}
        • Hedge & recover{"\n"}
        • Drop coverage{"\n"}
        • Full-court press
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Communication</Text>
      <Text>
        • Calling screens{"\n"}
        • Weak/strong side calls{"\n"}
        • Rotation signals{"\n"}
        • Defensive assignments
      </Text>
    </ScrollView>
  );
}
