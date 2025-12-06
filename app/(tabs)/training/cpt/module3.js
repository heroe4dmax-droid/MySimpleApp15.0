import { ScrollView, Text } from "react-native";

export default function CPTModule3() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 3 – Program Design</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Training Variables</Text>
      <Text>
        • Reps{"\n"}
        • Sets{"\n"}
        • Tempo{"\n"}
        • Intensity{"\n"}
        • Rest intervals
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Training Phases</Text>
      <Text>
        • Stability{"\n"}
        • Strength endurance{"\n"}
        • Hypertrophy{"\n"}
        • Max strength{"\n"}
        • Power
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Progression Models</Text>
      <Text>
        • Linear progression{"\n"}
        • Undulating progression{"\n"}
        • Periodization
      </Text>
    </ScrollView>
  );
}
