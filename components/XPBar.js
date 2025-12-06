// components/XPBar.js
import { View } from "react-native";

export default function XPBar({ xp = 0, xpCap = 1000 }) {
  const progress = Math.min(xp / xpCap, 1);

  return (
    <View
      style={{
        width: "100%",
        height: 12,
        backgroundColor: "#ddd",
        borderRadius: 6,
        overflow: "hidden",
        marginVertical: 10,
      }}
    >
      <View
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          backgroundColor: "#4caf50",
        }}
      />
    </View>
  );
}
