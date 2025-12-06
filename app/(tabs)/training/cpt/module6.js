import { ScrollView, Text } from "react-native";

export default function CPTModule6() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 6 – Professionalism & Safety</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Professional Standards</Text>
      <Text>
        • Client confidentiality{"\n"}
        • Scope of practice{"\n"}
        • Referring out when needed{"\n"}
        • Communication and coaching cues
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Safety Concepts</Text>
      <Text>
        • Warm-ups and cool-downs{"\n"}
        • Proper spotting{"\n"}
        • Injury prevention{"\n"}
        • Proper footwear & equipment use
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Client Management</Text>
      <Text>
        • Goal setting{"\n"}
        • Behavior change strategies{"\n"}
        • Motivation & adherence{"\n"}
        • Progress tracking
      </Text>
    </ScrollView>
  );
}
