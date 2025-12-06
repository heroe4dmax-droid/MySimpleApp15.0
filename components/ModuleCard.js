// components/ModuleCard.js
import { Text, TouchableOpacity } from "react-native";

export default function ModuleCard({ title, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        marginVertical: 8,
        backgroundColor: "#eee",
        borderRadius: 10,
      }}
    >
      <Text style={{ fontSize: 18 }}>{title}</Text>
    </TouchableOpacity>
  );
}

