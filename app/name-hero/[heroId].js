// app/name-hero/[heroId].js

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import Button from "../../components/Button";

export default function NameHero() {
  const { heroId } = useLocalSearchParams();
  const router = useRouter();

  const [heroName, setHeroName] = useState("");
  const [loading, setLoading] = useState(true);

  // ❌ BLOCK ANDROID BACK BUTTON (cannot escape)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true // block navigation
    );
    return () => backHandler.remove();
  }, []);

  // Load hero and check if name already exists
  useEffect(() => {
    const loadHero = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid, "heroes", heroId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        router.replace("/hero-select");
        return;
      }

      const hero = snap.data();

      // If hero already has a name, skip this screen
      if (hero.name && hero.name.trim().length > 0) {
        router.replace("/hero-select");
        return;
      }

      setLoading(false);
    };

    loadHero();
  }, []);

  const saveName = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const cleanName = heroName.trim();
    if (!cleanName) return; // prevent empty names

    try {
      await updateDoc(doc(db, "users", user.uid, "heroes", heroId), {
        name: cleanName,
      });

      router.replace("/hero-select");
    } catch (err) {
      console.log("Error naming hero:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name Your Hero</Text>

      <TextInput
        placeholder="Enter hero name..."
        value={heroName}
        onChangeText={setHeroName}
        style={styles.input}
        maxLength={20} // optional limit
      />

      <Button title="Save Name" onPress={saveName} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#EEE",
    padding: 14,
    fontSize: 18,
    borderRadius: 12,
    marginBottom: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
