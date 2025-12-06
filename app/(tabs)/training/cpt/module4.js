import { ScrollView, Text } from "react-native";

export default function CPTModule4() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 4 – Exercise Library</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Movement Categories</Text>
      <Text>
        • Squat patterns{"\n"}
        • Hinge patterns{"\n"}
        • Push (horizontal/vertical){"\n"}
        • Pull (horizontal/vertical){"\n"}
        • Lunge{"\n"}
        • Rotation / anti-rotation
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Example Exercises</Text>
      <Text>
        • Squat, lunge, deadlift{"\n"}
        • Bench press, push-up{"\n"}
        • Pull-ups, rows{"\n"}
        • Planks, carries{"\n"}
        • Machine variations
      </Text>
    </ScrollView>
  );
}
