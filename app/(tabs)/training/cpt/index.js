// app/(tabs)/training/cpt/index.js
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity } from "react-native";

export default function CPTTraining() {
  const router = useRouter();

  const modules = [
    { id: 1, title: "Module 1 – Anatomy & Physiology" },
    { id: 2, title: "Module 2 – Assessments" },
    { id: 3, title: "Module 3 – Program Design" },
    { id: 4, title: "Module 4 – Exercise Library" },
    { id: 5, title: "Module 5 – Nutrition" },
    { id: 6, title: "Module 6 – Professionalism & Safety" },
  ];

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24 }}>CPT Training</Text>

      {modules.map((m) => (
        <TouchableOpacity
          key={m.id}
          onPress={() => router.push(`/(tabs)/training/cpt/module${m.id}`)}
          style={{ paddingVertical: 12 }}
        >
          <Text>{m.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
