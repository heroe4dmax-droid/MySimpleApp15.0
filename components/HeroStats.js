// components/HeroStats.js
import { Text, View } from "react-native";

export default function HeroStats({ level, classId, xp, xpCap }) {
  return (
    <View style={{ paddingVertical: 10 }}>
      <Text style={{ fontSize: 20 }}>Level {level}</Text>
      <Text style={{ opacity: 0.6 }}>Class: {classId}</Text>
      <Text style={{ opacity: 0.6 }}>
        XP: {xp} / {xpCap}
      </Text>
    </View>
  );
}
