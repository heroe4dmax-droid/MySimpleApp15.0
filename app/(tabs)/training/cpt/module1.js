import { ScrollView, Text } from "react-native";

export default function CPTModule1() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 1 – Anatomy & Physiology</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Major Systems</Text>
      <Text>
        • Muscular system{"\n"}
        • Skeletal system{"\n"}
        • Cardiovascular system{"\n"}
        • Respiratory system{"\n"}
        • Nervous system (CNS/PNS)
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Key Concepts</Text>
      <Text>
        • Agonist, antagonist, synergist muscles{"\n"}
        • Planes of motion: sagittal, frontal, transverse{"\n"}
        • Muscle fiber types: Type I, Type II{"\n"}
        • Kinetic chain (muscles + joints + nerves)
      </Text>
    </ScrollView>
  );
}
