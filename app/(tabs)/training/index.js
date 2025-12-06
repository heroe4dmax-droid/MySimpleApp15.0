import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function TrainingIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Training</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(tabs)/training/rbt")}
      >
        <Text style={styles.buttonText}>RBT Training</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 26, marginBottom: 20 },
  button: {
    padding: 15,
    backgroundColor: "#333",
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: "white", fontSize: 18 },
});
