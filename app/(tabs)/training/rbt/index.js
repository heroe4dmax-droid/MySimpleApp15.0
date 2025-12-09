import { ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

const MODULES = [
  { id: "1", title: "Module 1 – 3-Term Contingency" },
  { id: "2", title: "Module 2 – Behavior Reduction Plans" },
  { id: "3", title: "Module 3 – Skill Acquisition Programs" },
  { id: "4", title: "Module 4 – Data Collection & Measurement" },
  { id: "5", title: "Module 5 – Ethics & Professional Conduct" },
  { id: "6", title: "Module 6 – Exam Preparation & Test Strategy" },
];

export default function RBTTrainingScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>RBT Training</Text>

      {MODULES.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.moduleCard}
          onPress={() => router.push(`/training/rbt/${m.id}`)}
        >
          <Text style={styles.moduleText}>{m.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },

  moduleCard: {
    backgroundColor: "#3f3f3f",
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
  },
  moduleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
