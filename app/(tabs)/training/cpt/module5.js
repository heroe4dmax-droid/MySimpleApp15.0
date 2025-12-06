import { ScrollView, Text } from "react-native";

export default function CPTModule5() {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26 }}>Module 5 – Nutrition</Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Macronutrients</Text>
      <Text>
        • Protein – muscle repair and growth{"\n"}
        • Carbohydrates – primary energy{"\n"}
        • Fats – hormones, brain function
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Micronutrients</Text>
      <Text>
        • Vitamins{"\n"}
        • Minerals{"\n"}
        • Hydration
      </Text>

      <Text style={{ marginTop: 15, fontSize: 18 }}>Meal Planning</Text>
      <Text>
        • Caloric balance (deficit, maintenance, surplus){"\n"}
        • Pre-workout fuel{"\n"}
        • Post-workout recovery{"\n"}
        • Consistency & habit formation
      </Text>
    </ScrollView>
  );
}
