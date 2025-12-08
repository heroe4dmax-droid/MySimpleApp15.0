// app/(tabs)/home.js

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
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

  const mountedRef = useRef(true);

  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [hero, setHero] = useState(null);
  const [allowedModules, setAllowedModules] = useState([]);

  useEffect(() => {
    mountedRef.current = true;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!mountedRef.current) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const userData = await getUser(user.uid);
        if (!mountedRef.current) return;

        setUserDoc(userData ?? null);

        // ✅ Only load hero if one is selected
        if (!userData?.activeHeroId) {
          setHero(null);
          setAllowedModules([]);
          return;
        }

        const heroData = await getHero(user.uid, userData.activeHeroId);
        if (!mountedRef.current) return;

        if (!heroData) {
          setHero(null);
          setAllowedModules([]);
          return;
        }

        // ✅ Force naming if needed
        if (!heroData.name || heroData.name.trim().length === 0) {
          router.replace(`/name-hero/${userData.activeHeroId}`);
          return;
        }

        const heroObj = {
          id: userData.activeHeroId,
          ...heroData,
        };

        setHero(heroObj);

        const access =
          TRAINING_ACCESS?.[heroObj.classId] ?? [];
        setAllowedModules(access);
      } catch (err) {
        console.log("Home load error:", err);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      unsub();
    };
  }, []);

  // ---------------- Loading ----------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading your hero...</Text>
      </View>
    );
  }

  // ---------------- No user ----------------
  if (!userDoc) {
    return (
      <View style={styles.center}>
        <Text>Could not load user data.</Text>
      </View>
    );
  }

  // ---------------- Avatar ----------------
  const avatarSource =
    hero?.classId === "behaviorTactician"
      ? images.avatars.tactician
      : hero?.classId === "cptHero"
      ? images.avatars.cpt
      : hero?.classId === "basketballSage"
      ? images.avatars.basketball
      : images.avatars.default;

  // ---------------- UI ----------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>
        Welcome, {userDoc.name || "Hero"}
      </Text>

      {/* HERO CARD */}
      {hero ? (
        <View style={styles.card}>
          <HeroAvatar
            avatar={avatarSource}
            name={hero.name}
            size={110}
          />
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
          <Text style={styles.sectionTitle}>
            No active hero selected
          </Text>
          <Text style={{ marginBottom: 12 }}>
            Create or select a hero to begin training.
          </Text>
          <Text
            style={styles.link}
            onPress={() => router.push("/hero-select")}
          >
            Go to Hero Select
          </Text>
        </View>
      )}

      {/* TRAINING */}
      {!!hero && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Training
          </Text>

          {allowedModules.includes("rbt") && (
            <TrainingCard
              title="RBT Training"
              description="Behavior Tactician modules"
              onPress={() =>
                router.push("/(tabs)/training/rbt")
              }
            />
          )}

          {allowedModules.includes("cpt") && (
            <TrainingCard
              title="CPT Training"
              description="Certified Personal Trainer path"
              onPress={() =>
                router.push("/(tabs)/training/cpt")
              }
            />
          )}

          {allowedModules.includes("basketball") && (
            <TrainingCard
              title="Basketball Sage Training"
              description="Basketball coach development"
              onPress={() =>
                router.push("/(tabs)/training/basketball")
              }
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

// ---------------- Styles ----------------
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
