// components/TrainingCard.js
import { Text, TouchableOpacity } from "react-native";

export default function TrainingCard({ title, description, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        marginVertical: 10,
        backgroundColor: "#f4f4f4",
        borderRadius: 12,
      }}
    >
      <Text style={{ fontSize: 20 }}>{title}</Text>
      {description && (
        <Text style={{ opacity: 0.6 }}>{description}</Text>
      )}
    </TouchableOpacity>
  );
}
