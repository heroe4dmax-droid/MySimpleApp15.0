import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function RBTIndex() {
  const router = useRouter();

  const modules = [
    { id: "1", title: "3-Term Contingency" },
    { id: "2", title: "Data Collection" },
    { id: "3", title: "Assessments" },
    { id: "4", title: "Plans" },
    { id: "5", title: "Verbal Operants" },
    { id: "6", title: "Ethics" },
    { id: "7", title: "Exam Tips" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RBT Training</Text>

      {modules.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={styles.button}
          onPress={() => router.push(`/(tabs)/training/rbt/${m.id}`)}
        >
          <Text style={styles.buttonText}>{m.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, marginBottom: 20 },
  button: {
    padding: 15,
    backgroundColor: "#444",
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: { color: "white", fontSize: 18 },
});
