// components/HeroCard.js
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function HeroCard({ name, classId, level, onPress, avatar }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        padding: 15,
        backgroundColor: "#f4f4f4",
        marginVertical: 10,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        source={avatar}
        style={{
          width: 60,
          height: 60,
          borderRadius: 30,
          marginRight: 15,
        }}
      />

      <View>
        <Text style={{ fontSize: 18, fontWeight: "600" }}>{name}</Text>
        <Text style={{ opacity: 0.6 }}>{classId}</Text>
        <Text style={{ opacity: 0.6 }}>Level {level}</Text>
      </View>
    </TouchableOpacity>
  );
}
