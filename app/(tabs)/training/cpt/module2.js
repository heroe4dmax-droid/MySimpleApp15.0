import { ScrollView, Text } from "react-native";

export default function CPTModule2() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 2 – Assessments</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Assessment Types</Text>
      <Text>
        • PAR-Q (readiness){"\n"}
        • Health history questionnaire{"\n"}
        • Lifestyle assessment{"\n"}
        • Posture analysis{"\n"}
        • Movement screens (OHSA, push, pull, squat)
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Performance Tests</Text>
      <Text>
        • Strength tests{"\n"}
        • Endurance tests{"\n"}
        • Flexibility tests{"\n"}
        • VO2 estimations
      </Text>
    </ScrollView>
  );
}
