import { ScrollView, Text } from "react-native";

export default function BasketballModule5() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 5 – Coaching Psychology</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Motivation</Text>
      <Text>
        • Positive reinforcement{"\n"}
        • Intrinsic vs extrinsic motivation{"\n"}
        • Player confidence building
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Communication</Text>
      <Text>
        • Clear expectations{"\n"}
        • Feedback timing{"\n"}
        • Emotional regulation{"\n"}
        • Teaching vs yelling
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Team Culture</Text>
      <Text>
        • Leadership roles{"\n"}
        • Accountability{"\n"}
        • Trust building{"\n"}
        • Consistency in standards
      </Text>
    </ScrollView>
  );
}
