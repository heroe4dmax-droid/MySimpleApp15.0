// app/(tabs)/training/UniversalTrainingScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../config/firebase";
import { getUser } from "../../../services/userService";
import { getHero, giveHeroXP } from "../../../services/heroService";

// ✅ Static JSON imports (Metro-safe)
import module1 from "../../../config/trainingModules/rbt/module1.json";
import module2 from "../../../config/trainingModules/rbt/module2.json";
import module3 from "../../../config/trainingModules/rbt/module3.json";
import module4 from "../../../config/trainingModules/rbt/module4.json";
import module5 from "../../../config/trainingModules/rbt/module5.json";
import module6 from "../../../config/trainingModules/rbt/module6.json";
import module7 from "../../../config/trainingModules/rbt/module7.json";

const MODULE_MAP = {
  "1": module1,
  "2": module2,
  "3": module3,
  "4": module4,
  "5": module5,
  "6": module6,
  "7": module7,
};

// ✅ New standardized difficulties
const DIFFICULTIES = [
  { key: "novice" },
  { key: "standard" },
  { key: "expert" },
];

export default function UniversalTrainingScreen() {
  const { moduleId } = useLocalSearchParams();
  const router = useRouter();
  const moduleData = MODULE_MAP[moduleId];

  const [userId, setUserId] = useState(null);
  const [heroId, setHeroId] = useState(null);
  const [hero, setHero] = useState(null);
  const [loadingHero, setLoadingHero] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setHero(null);
        setLoadingHero(false);
        return;
      }

      try {
        setUserId(user.uid);
        const userDoc = await getUser(user.uid);
        const activeHeroId = userDoc?.activeHeroId;

        if (!activeHeroId) {
          setHero(null);
          setLoadingHero(false);
          return;
        }

        const heroData = await getHero(user.uid, activeHeroId);
        setHero(heroData);
        setHeroId(activeHeroId);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingHero(false);
      }
    });

    return () => unsub();
  }, []);

  if (!moduleData) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Module not found.</Text>
      </View>
    );
  }

  if (loadingHero) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading hero...</Text>
      </View>
    );
  }

  const heroStats = hero?.stats ?? {
    intellect: 0,
    wisdom: 0,
    discipline: 0,
  };

  const heroLevel = hero?.level ?? 1;

  const meetsReq = (req = {}) =>
    heroStats.intellect >= (req.intellect ?? 0) &&
    heroStats.wisdom >= (req.wisdom ?? 0) &&
    heroStats.discipline >= (req.discipline ?? 0);

  const handleClaimXP = async (difficulty) => {
    if (!userId || !heroId || !hero) {
      Alert.alert("No hero selected");
      return;
    }

    const xpGain = moduleData.xpRewards?.[difficulty] ?? 0;
    const statReq = moduleData.statRequirements?.[difficulty] ?? {};
    const minLevel = moduleData.unlock?.minHeroLevel ?? 1;

    if (!meetsReq(statReq) || heroLevel < minLevel) {
      Alert.alert("Locked", "Requirements not met");
      return;
    }

    try {
      setClaiming(true);
      const updatedHero = await giveHeroXP(userId, heroId, xpGain);
      setHero(updatedHero);
      Alert.alert("XP Gained", `+${xpGain} XP`);
    } catch {
      Alert.alert("Error", "XP could not be awarded");
    } finally {
      setClaiming(false);
    }
  };

  const renderReqText = (req = {}) =>
    `INT ${req.intellect ?? 0} · WIS ${req.wisdom ?? 0} · DISC ${req.discipline ?? 0}`;

  const hasFlashcards =
    moduleData.flashcards &&
    Object.keys(moduleData.flashcards).length > 0;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{moduleData.title}</Text>
      <Text style={styles.subtitle}>Module {moduleId}</Text>

      {/* HERO PANEL */}
      {hero ? (
        <View style={styles.heroPanel}>
          <Text style={styles.heroName}>{hero.name}</Text>
          <Text>Level {hero.level}</Text>
          <Text>XP: {hero.xp}</Text>
          <View style={styles.statsRow}>
            <Text>INT {heroStats.intellect}</Text>
            <Text>WIS {heroStats.wisdom}</Text>
            <Text>DISC {heroStats.discipline}</Text>
          </View>
        </View>
      ) : (
        <Text>No active hero selected.</Text>
      )}

      {/* DIFFICULTIES */}
      {DIFFICULTIES.map(({ key }) => {
        const summary = moduleData.summaries?.[key];
        const xp = moduleData.xpRewards?.[key];
        const req = moduleData.statRequirements?.[key];
        const label = moduleData.difficultyLabels?.[key];
        const locked =
          !meetsReq(req) ||
          heroLevel < (moduleData.unlock?.minHeroLevel ?? 1);

        const expandedCard = expanded === key;

        return (
          <View key={key} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => setExpanded(expandedCard ? null : key)}
            >
              <Text style={styles.cardTitle}>
                {label} {locked ? "🔒" : "🔓"}
              </Text>
              <Text>{expandedCard ? "▲" : "▼"}</Text>
            </TouchableOpacity>

            {expandedCard && (
              <View style={styles.cardBody}>
                <Text>{summary}</Text>
                <Text style={styles.reqText}>
                  Req: {renderReqText(req)}
                </Text>

                <TouchableOpacity
                  disabled={locked || claiming}
                  onPress={() => handleClaimXP(key)}
                  style={[
                    styles.claimButton,
                    locked && styles.buttonDisabled,
                  ]}
                >
                  <Text style={styles.claimText}>
                    {locked ? "Locked" : `Complete (+${xp} XP)`}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      })}

      {/* SECTIONS */}
      <Text style={styles.sectionHeader}>Sections</Text>
      {moduleData.sections?.map((s) => (
        <View key={s.id} style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>{s.title}</Text>
          <Text style={styles.sectionReqText}>
            Req: {renderReqText(s.statRequirements)}
          </Text>
          <Text>{s.content}</Text>
        </View>
      ))}

      {/* FLASHCARDS */}
      {hasFlashcards && (
        <TouchableOpacity
          style={styles.flashcardButton}
          onPress={() =>
            router.push(`/training/rbt/${moduleId}/flashcards`)
          }
        >
          <Text style={styles.flashcardText}>📚 Study Flashcards</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "red", fontSize: 18 },

  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginBottom: 20 },

  heroPanel: {
    padding: 14,
    backgroundColor: "#eef2ff",
    borderRadius: 12,
    marginBottom: 20,
  },

  heroName: { fontSize: 18, fontWeight: "bold" },
  statsRow: { flexDirection: "row", justifyContent: "space-between" },

  card: {
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: "#e5e7eb",
  },
  cardHeader: {
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: { fontWeight: "bold", fontSize: 16 },

  cardBody: { padding: 14 },
  reqText: { fontSize: 12, marginVertical: 6, color: "#666" },

  claimButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9ca3af" },
  claimText: { color: "white", fontWeight: "bold" },

  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 14,
  },
  sectionCard: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    marginBottom: 10,
  },
  sectionTitle: { fontWeight: "bold" },
  sectionReqText: { fontSize: 12, color: "#666" },

  flashcardButton: {
    marginVertical: 30,
    padding: 14,
    backgroundColor: "#10b981",
    borderRadius: 10,
    alignItems: "center",
  },
  flashcardText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
