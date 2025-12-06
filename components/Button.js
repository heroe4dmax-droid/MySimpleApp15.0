// components/Button.js
import { Text, TouchableOpacity } from "react-native";

export default function Button({ title, onPress, color = "#007AFF" }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 20,
        backgroundColor: color,
        borderRadius: 10,
        marginVertical: 10,
      }}
    >
      <Text style={{ color: "white", fontSize: 18, textAlign: "center" }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
