// app/(tabs)/hall.js
import { useRouter } from "expo-router";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Button from "../../components/Button";
import { images } from "../../config/images";

export default function HeroHallScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={images.backgrounds.heroHall}
      style={styles.bg}
      imageStyle={{ opacity: 0.9 }}
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Hero Hall</Text>
        <Text style={styles.subtitle}>
          Create new heroes, upgrade your roster, and prepare for training.
        </Text>

        <Button
          title="Create New Hero"
          onPress={() => router.push("/create-hero")}
        />
        <Button
          title="Choose Active Hero"
          onPress={() => router.push("/hero-select")}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    color: "white",
    opacity: 0.8,
    marginBottom: 16,
  },
});

