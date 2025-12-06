// app/(tabs)/training/basketball/index.js
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function BasketballTraining() {
  const router = useRouter();

  const modules = [
    { id: 1, title: "Module 1 – Foundations & History" },
    { id: 2, title: "Module 2 – Player Development" },
    { id: 3, title: "Module 3 – Offensive Systems" },
    { id: 4, title: "Module 4 – Defensive Systems" },
    { id: 5, title: "Module 5 – Coaching Psychology" },
    { id: 6, title: "Module 6 – Practice Planning" },
  ];

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>Basketball Sage Training</Text>

      {modules.map((m) => (
        <TouchableOpacity
          key={m.id}
          onPress={() => router.push(`/(tabs)/training/basketball/module${m.id}`)}
          style={{ paddingVertical: 12 }}
        >
          <Text>{m.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
