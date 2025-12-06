// app/(tabs)/create-hero/index.js

import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";

import { auth, db } from "../../config/firebase";
import { HERO_CLASSES } from "../../config/heroClasses";

export default function CreateHero() {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(false);

  async function createHero() {
    if (!selectedClass) return;

    setLoading(true);

    const user = auth.currentUser;
    if (!user) return;

    // Unique hero ID (simple, effective)
    const heroId = Date.now().toString();

    // Create hero in Firestore with NO NAME (WoW style)
    await setDoc(doc(db, "users", user.uid, "heroes", heroId), {
      heroId,
      name: "", // <-- empty name so user MUST name hero next
      classId: selectedClass.id,
      level: 1,
      xp: 0,
      createdAt: Date.now(),
    });

    // Set this hero as active hero
    await setDoc(
      doc(db, "users", user.uid),
      { activeHeroId: heroId },
      { merge: true }
    );

    // Force user to name their hero (no back button)
    router.replace(`/name-hero/${heroId}`);
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Choose Your Hero Class
      </Text>

      {HERO_CLASSES.map((hero) => (
        <TouchableOpacity
          key={hero.id}
          onPress={() => setSelectedClass(hero)}
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor:
              selectedClass?.id === hero.id ? "#d0d8ff" : "#f0f0f0",
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={hero.avatar}
              style={{ width: 60, height: 60, marginRight: 16 }}
            />
            <View>
              <Text style={{ fontSize: 20 }}>{hero.name}</Text>
              <Text style={{ opacity: 0.7 }}>{hero.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {selectedClass && (
        <TouchableOpacity
          onPress={createHero}
          style={{
            backgroundColor: "#007bff",
            padding: 15,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
              Create {selectedClass.name}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
