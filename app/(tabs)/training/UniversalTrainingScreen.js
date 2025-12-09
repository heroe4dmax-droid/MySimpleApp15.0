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

// ✅ RBT MODULE IMPORTS (1–6)
import module1 from "../../../config/trainingModules/rbt/module1.json";
import module2 from "../../../config/trainingModules/rbt/module2.json";
import module3 from "../../../config/trainingModules/rbt/module3.json";
import module4 from "../../../config/trainingModules/rbt/module4.json";
import module5 from "../../../config/trainingModules/rbt/module5.json";
import module6 from "../../../config/trainingModules/rbt/module6.json";

// ✅ CENTRALIZED MODULE MAP
const MODULE_MAP = {
  "1": module1,
  "2": module2,
  "3": module3,
  "4": module4,
  "5": module5,
  "6": module6,
};

const TIERS = ["novice", "standard", "expert"];

export default function UniversalTrainingScreen() {
  const { moduleId } = useLocalSearchParams();
  const router = useRouter();

  const moduleData = MODULE_MAP[moduleId];
  const fullModuleId = `rbt_${moduleId}`;

  const [hero, setHero] = useState(null);
  const [userId, setUserId] = useState(null);
  const [heroId, setHeroId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ TRACK PROGRESSION
  const [completedTiers, setCompletedTiers] = useState([]);
  const [readTiers, setReadTiers] = useState({});
  const [openTier, setOpenTier] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) return setLoading(false);

      const userDoc = await getUser(user.uid);
      if (!userDoc?.activeHeroId) return setLoading(false);

      const heroData = await getHero(user.uid, userDoc.activeHeroId);

      setUserId(user.uid);
      setHeroId(userDoc.activeHeroId);
      setHero(heroData);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!moduleData) {
    return (
      <View style={styles.center}>
        <Text>Module not found.</Text>
      </View>
    );
  }

  // ✅ TIER UNLOCK LOGIC
  function tierLocked(tier) {
    if (tier === "novice") return false;
    if (tier === "standard") return !completedTiers.includes("novice");
    if (tier === "expert") return !completedTiers.includes("standard");
    return true;
  }

  async function handleClaimXP(tier) {
    if (completedTiers.includes(tier)) {
      Alert.alert("Already completed", "XP already claimed for this tier.");
      return;
    }

    if (!readTiers[tier]) {
      Alert.alert("Read Required", "Please read all sections first.");
      return;
    }

    const xp = moduleData.xpRewards?.[tier] ?? 0;
    const updatedHero = await giveHeroXP(userId, heroId, xp);
    setHero(updatedHero);
    setCompletedTiers((prev) => [...prev, tier]);
  }

  const canCompleteModule =
    completedTiers.includes("novice") &&
    completedTiers.includes("standard") &&
    completedTiers.includes("expert");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{moduleData.title}</Text>

      {TIERS.map((tier) => {
        const sections = moduleData.sections?.[tier] ?? [];
        const locked = tierLocked(tier);
        const completed = completedTiers.includes(tier);

        return (
          <View key={tier} style={styles.card}>
            <TouchableOpacity
              onPress={() => setOpenTier(openTier === tier ? null : tier)}
            >
              <Text style={styles.cardTitle}>
                {tier.toUpperCase()} {openTier === tier ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {openTier === tier && (
              <View style={styles.sectionBox}>
                {sections.map((section) => {
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

                      {isOpen &&
                        section.content.map((line, idx) => (
                          <Text key={idx} style={styles.sectionContent}>
                            • {line}
                          </Text>
                        ))}
                    </View>
                  );
                })}

                <TouchableOpacity
                  style={styles.readButton}
                  onPress={() =>
                    setReadTiers((p) => ({ ...p, [tier]: true }))
                  }
                >
                  <Text style={styles.readButtonText}>
                    Mark {tier} as Read
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              disabled={locked || completed}
              onPress={() => handleClaimXP(tier)}
              style={[
                styles.claimButton,
                (locked || completed) && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.claimText}>
                {locked
                  ? "Locked"
                  : completed
                  ? "Completed ✓"
                  : `Earn +${moduleData.xpRewards[tier]} XP`}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity
        disabled={!canCompleteModule}
        onPress={() =>
          completeModule({ userId, heroId, moduleId: fullModuleId })
        }
        style={[
          styles.completeButton,
          !canCompleteModule && styles.buttonDisabled,
        ]}
      >
        <Text style={styles.claimText}>Complete Module ✅</Text>
      </TouchableOpacity>
    </ScrollView>
  );
  
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },

  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  sectionBox: {
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  sectionCard: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
  },
  sectionContent: {
    color: "#374151",
    marginLeft: 6,
  },

  claimButton: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  readButton: {
    marginTop: 10,
    backgroundColor: "#10b981",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButton: {
    marginTop: 20,
    backgroundColor: "#10b981",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  claimText: {
    color: "#fff",
    fontWeight: "bold",
  },
  readButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});