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
import {
  getHero,
  giveHeroXP,
  completeModule,
} from "../../../services/heroService";

// ✅ Static module imports (Metro-safe)
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

const DIFFICULTIES = ["novice", "standard", "expert"];

export default function UniversalTrainingScreen() {
  const { moduleId } = useLocalSearchParams();
  const router = useRouter();

  const moduleData = MODULE_MAP[moduleId];
  const fullModuleId = `rbt_${moduleId}`;

  const [userId, setUserId] = useState(null);
  const [heroId, setHeroId] = useState(null);
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);

  const [completedTiers, setCompletedTiers] = useState([]);
  const [noviceSectionsRead, setNoviceSectionsRead] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [claiming, setClaiming] = useState(false);

  // -------------------------
  // LOAD USER + HERO
  // -------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const userDoc = await getUser(user.uid);
      if (!userDoc?.activeHeroId) {
        setLoading(false);
        return;
      }

      const heroData = await getHero(user.uid, userDoc.activeHeroId);

      setUserId(user.uid);
      setHeroId(userDoc.activeHeroId);
      setHero(heroData);
      setLoading(false);
    });

    return unsub;
  }, []);

  if (!moduleData) {
    return (
      <View style={styles.center}>
        <Text>Module not found.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 8 }}>Loading...</Text>
      </View>
    );
  }

  const heroStats = hero?.stats ?? {
    intellect: 0,
    wisdom: 0,
    discipline: 0,
  };

  const meetsReq = (req = {}) =>
    heroStats.intellect >= (req.intellect ?? 0) &&
    heroStats.wisdom >= (req.wisdom ?? 0) &&
    heroStats.discipline >= (req.discipline ?? 0);

  // -------------------------
  // CLAIM XP FOR TIER
  // -------------------------
  async function handleClaimXP(difficulty) {
    if (!userId || !heroId) return;

    const xpGain = moduleData.xpRewards?.[difficulty] ?? 0;
    const statReq = moduleData.statRequirements?.[difficulty] ?? {};

    if (!meetsReq(statReq)) {
      Alert.alert("Locked", "Requirements not met");
      return;
    }

    try {
      setClaiming(true);
      const updatedHero = await giveHeroXP(userId, heroId, xpGain);
      setHero(updatedHero);

      setCompletedTiers((prev) =>
        prev.includes(difficulty) ? prev : [...prev, difficulty]
      );
    } catch {
      Alert.alert("Error", "XP could not be awarded");
    } finally {
      setClaiming(false);
    }
  }

  // -------------------------
  // MODULE COMPLETION
  // -------------------------
  const canCompleteModule =
    completedTiers.includes("novice") && noviceSectionsRead;

  async function handleCompleteModule() {
    await completeModule({
      userId,
      heroId,
      moduleId: fullModuleId,
      statRewards: { intellect: 1 },
      talentPointsReward: 1,
    });

    router.back();
  }

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{moduleData.title}</Text>
      <Text style={styles.subtitle}>Module {moduleId}</Text>

      {DIFFICULTIES.map((difficulty) => {
        const req = moduleData.statRequirements?.[difficulty];
        const xp = moduleData.xpRewards?.[difficulty];
        const locked = req && !meetsReq(req);

        const noviceBlocked =
          difficulty === "novice" && !noviceSectionsRead;

        return (
          <View key={difficulty} style={styles.card}>
            <Text style={styles.cardTitle}>
              {difficulty.toUpperCase()}
            </Text>

            {/* ✅ ACCORDION NOVICE CONTENT */}
            {difficulty === "novice" && (
              <View style={styles.sectionBox}>
                {moduleData.sections?.map((section) => {
                  const isOpen = openSection === section.id;

                  return (
                    <View key={section.id} style={styles.sectionCard}>
                      <TouchableOpacity
                        onPress={() =>
                          setOpenSection(isOpen ? null : section.id)
                        }
                      >
                        <Text style={styles.sectionTitle}>
                          {section.title} {isOpen ? "▲" : "▼"}
                        </Text>
                      </TouchableOpacity>

                      {isOpen && (
                        <View style={{ marginTop: 6 }}>
                          {Array.isArray(section.content) ? (
                            section.content.map((line, idx) => (
                              <Text
                                key={idx}
                                style={styles.sectionContent}
                              >
                                • {line}
                              </Text>
                            ))
                          ) : (
                            <Text style={styles.sectionContent}>
                              {section.content || "Content coming soon."}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={[
                    styles.readButton,
                    noviceSectionsRead && styles.buttonDisabled,
                  ]}
                  disabled={noviceSectionsRead}
                  onPress={() => setNoviceSectionsRead(true)}
                >
                  <Text style={styles.readButtonText}>
                    {noviceSectionsRead
                      ? "Novice Content Read ✅"
                      : "Mark Sections as Read"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              disabled={locked || claiming || noviceBlocked}
              onPress={() => handleClaimXP(difficulty)}
              style={[
                styles.claimButton,
                (locked || noviceBlocked) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.claimText}>
                {noviceBlocked
                  ? "Read sections to unlock"
                  : `Earn +${xp} XP`}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity
        disabled={!canCompleteModule}
        onPress={handleCompleteModule}
        style={[
          styles.completeButton,
          !canCompleteModule && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.claimText}>
          Complete Module ✅
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// -------------------------
// STYLES
// -------------------------
const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },

  title: { fontSize: 28, fontWeight: "bold" },
  subtitle: { marginBottom: 20 },

  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardTitle: { fontWeight: "bold", marginBottom: 8 },

  claimButton: {
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  completeButton: {
    marginTop: 24,
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#9ca3af" },
  claimText: { color: "white", fontWeight: "bold" },

  sectionBox: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    padding: 12,
  },
  sectionCard: { marginBottom: 12 },
  sectionTitle: { fontWeight: "bold" },
  sectionContent: { marginBottom: 4, color: "#374151" },

  readButton: {
    marginTop: 12,
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  readButtonText: { color: "white", fontWeight: "600" },
});
