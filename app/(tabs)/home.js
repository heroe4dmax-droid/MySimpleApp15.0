// app/(tabs)/home.js

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../config/firebase";

import { getHero } from "../../services/heroService";
import { getUser } from "../../services/userService";

import HeroAvatar from "../../components/HeroAvatar";
import HeroStats from "../../components/HeroStats";
import TrainingCard from "../../components/TrainingCard";
import XPBar from "../../components/XPBar";

import { images } from "../../config/images";
import { TRAINING_ACCESS } from "../../config/trainingAccess";

export default function HomeScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [hero, setHero] = useState(null);
  const [allowedModules, setAllowedModules] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const userData = await getUser(user.uid);
        setUserDoc(userData);

        // If user has an active hero, load it
        if (userData?.activeHeroId) {
          const heroData = await getHero(user.uid, userData.activeHeroId);

          // 🚨 FIX: If hero has no name, force naming screen
          if (!heroData?.name || heroData.name.trim().length === 0) {
            router.replace(`/name-hero/${userData.activeHeroId}`);
            return; // stop here
          }

          // Build hero object with ID
          const heroObj = { id: userData.activeHeroId, ...heroData };
          setHero(heroObj);

          // Filter allowed training modules
          const heroClassId = heroObj.classId;
          const access = TRAINING_ACCESS[heroClassId] || [];
          setAllowedModules(access);
        }
      } catch (err) {
        console.log("Home load error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // ---- LOADING UI ----
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading your hero...</Text>
      </View>
    );
  }

  // ---- ERROR LOADING USER ----
  if (!userDoc) {
    return (
      <View style={styles.center}>
        <Text>Could not load user.</Text>
      </View>
    );
  }

  // ---- HERO AVATAR PICKER ----
  const avatarSource =
    hero?.classId === "behaviorTactician"
      ? images.avatars.tactician
      : hero?.classId === "cptHero"
      ? images.avatars.cpt
      : hero?.classId === "basketballSage"
      ? images.avatars.basketball
      : images.avatars.default;

  // ---- MAIN UI ----
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Welcome, {userDoc.name}</Text>

      {/* ---- HERO CARD ---- */}
      {hero ? (
        <View style={styles.card}>
          <HeroAvatar avatar={avatarSource} name={hero.name} size={110} />
          <HeroStats
            level={hero.level}
            classId={hero.classId}
            xp={hero.xp}
            xpCap={1000}
          />
          <XPBar xp={hero.xp} xpCap={1000} />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>No active hero selected</Text>
          <Text style={{ marginBottom: 10 }}>
            Create or choose a hero to begin your journey.
          </Text>
          <Text
            style={styles.link}
            onPress={() => router.push("/hero-select")}
          >
            Go to Hero Select
          </Text>
        </View>
      )}

      {/* ---- TRAINING SECTION ---- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Training</Text>

        {/* RBT Training */}
        {allowedModules.includes("rbt") && (
          <TrainingCard
            title="RBT Training"
            description="Behavior Tactician modules"
            onPress={() => router.push("/(tabs)/training/rbt")}
          />
        )}

        {/* CPT Training */}
        {allowedModules.includes("cpt") && (
          <TrainingCard
            title="CPT Training"
            description="Certified Personal Trainer path"
            onPress={() => router.push("/(tabs)/training/cpt")}
          />
        )}

        {/* Basketball Sage Training */}
        {allowedModules.includes("basketball") && (
          <TrainingCard
            title="Basketball Sage Training"
            description="Basketball coach development"
            onPress={() => router.push("/(tabs)/training/basketball")}
          />
        )}
      </View>
    </ScrollView>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#F4F4F4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  link: {
    color: "#007AFF",
    fontWeight: "500",
  },
});
