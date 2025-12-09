import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../../../../../config/firebase";
import { getUser } from "../../../../../services/userService";
import { getHero, giveHeroXP } from "../../../../../services/heroService";

// ✅ MODULE IMPORTS (LOCKED TO 1–6)
import module1 from "../../../../../config/trainingModules/rbt/module1.json";
import module2 from "../../../../../config/trainingModules/rbt/module2.json";
import module3 from "../../../../../config/trainingModules/rbt/module3.json";
import module4 from "../../../../../config/trainingModules/rbt/module4.json";
import module5 from "../../../../../config/trainingModules/rbt/module5.json";
import module6 from "../../../../../config/trainingModules/rbt/module6.json";

const MODULE_MAP = {
  "1": module1,
  "2": module2,
  "3": module3,
  "4": module4,
  "5": module5,
  "6": module6,
};

const TIERS = ["novice", "standard", "expert"];

export default function Flashcards() {
  const { moduleId } = useLocalSearchParams();
  const router = useRouter();
  const moduleData = MODULE_MAP[moduleId];

  const [revealed, setRevealed] = useState({});
  const [completedTiers, setCompletedTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState("novice");

  const [userId, setUserId] = useState(null);
  const [hero, setHero] = useState(null);
  const [heroId, setHeroId] = useState(null);

  // --------------------------------------------------
  // LOAD HERO
  // --------------------------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setUserId(user.uid);
      const userDoc = await getUser(user.uid);
      if (!userDoc?.activeHeroId) return;

      const heroData = await getHero(user.uid, userDoc.activeHeroId);
      setHero(heroData);
      setHeroId(userDoc.activeHeroId);
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

  // --------------------------------------------------
  // TIER LOCKING (PROGRESSION FIRST)
  // --------------------------------------------------
  function isTierLocked(tier) {
    if (tier === "novice") return false;
    if (tier === "standard") return !completedTiers.includes("novice");
    if (tier === "expert") return !completedTiers.includes("standard");
    return true;
  }

  const tierLocked = isTierLocked(selectedTier);

  // --------------------------------------------------
  // CARDS + XP
  // --------------------------------------------------
  const cards = moduleData.flashcards?.[selectedTier] ?? [];
  const perCardXP = moduleData.flashcardXP?.perCard ?? {};
  const tierXP = moduleData.flashcardXP?.[selectedTier] ?? 0;

  // --------------------------------------------------
  // REVEAL CARD (ONE-TIME XP)
  // --------------------------------------------------
  async function handleReveal(card) {
    if (revealed[card.id]) return;

    setRevealed((p) => ({ ...p, [card.id]: true }));

    const xp = perCardXP[card.type] ?? 0;
    if (xp > 0 && userId && heroId) {
      await giveHeroXP(userId, heroId, xp);
    }
  }

  // --------------------------------------------------
  // COMPLETE TIER
  // --------------------------------------------------
  const allRevealed =
    cards.length > 0 && cards.every((c) => revealed[c.id]);

  async function handleCompleteTier() {
    if (!allRevealed) {
      Alert.alert("Not yet", "Reveal all cards first.");
      return;
    }

    if (completedTiers.includes(selectedTier)) {
      Alert.alert("Completed", "Tier already completed.");
      return;
    }

    if (tierXP > 0 && userId && heroId) {
      await giveHeroXP(userId, heroId, tierXP);
    }

    setCompletedTiers((p) => [...p, selectedTier]);
    Alert.alert("Tier Complete ✅", `+${tierXP} XP`);
  }

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container}>
        <Text style={styles.moduleTitle}>{moduleData.title}</Text>
        <Text style={styles.moduleSubtitle}>Module {moduleId}</Text>

        {/* TIER SELECT */}
        <View style={styles.tierRow}>
          {TIERS.map((tier) => {
            const active = tier === selectedTier;
            return (
              <TouchableOpacity
                key={tier}
                style={[
                  styles.tierButton,
                  active && styles.tierButtonActive,
                ]}
                onPress={() => setSelectedTier(tier)}
              >
                <Text
                  style={[
                    styles.tierButtonText,
                    active && styles.tierButtonTextActive,
                  ]}
                >
                  {tier.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LOCKED */}
        {tierLocked && (
          <View style={styles.lockedBox}>
            <Text style={styles.lockedText}>🔒 Tier Locked</Text>
            <Text style={styles.lockedSub}>
              Complete previous tier first
            </Text>
          </View>
        )}

        {!tierLocked &&
          cards.map((card) => {
            const isRevealed = !!revealed[card.id];
            return (
              <View key={card.id} style={styles.card}>
                <Text style={styles.cardId}>
                  #{card.id} · {card.type?.toUpperCase()}
                </Text>

                <Text style={styles.questionText}>{card.question}</Text>

                {card.options?.map((opt, idx) => (
                  <Text key={idx} style={styles.optionText}>
                    {String.fromCharCode(65 + idx)}. {opt}
                  </Text>
                ))}

                <TouchableOpacity
                  style={styles.revealButton}
                  onPress={() => handleReveal(card)}
                >
                  <Text style={styles.revealButtonText}>
                    {isRevealed ? "Revealed" : "Show Answer"}
                  </Text>
                </TouchableOpacity>

                {isRevealed && (
                  <View style={styles.answerBlock}>
                    <Text style={styles.answerLabel}>Answer</Text>
                    <Text style={styles.answerText}>
                      {card.answer ??
                        card.options?.[card.correctOptionIndex]}
                    </Text>
                    {card.explanation && (
                      <Text style={styles.explanationText}>
                        {card.explanation}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}

        {!tierLocked && cards.length > 0 && (
          <TouchableOpacity
            style={[
              styles.completeButton,
              (!allRevealed ||
                completedTiers.includes(selectedTier)) &&
                styles.completeButtonDisabled,
            ]}
            disabled={
              !allRevealed || completedTiers.includes(selectedTier)
            }
            onPress={handleCompleteTier}
          >
            <Text style={styles.completeText}>
              Complete {selectedTier} (+{tierXP} XP)
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

// --------------------------------------------------
// STYLES
// --------------------------------------------------
const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  error: { color: "red", fontSize: 16 },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backText: { color: "#2563eb" },
  headerTitle: { flex: 1, textAlign: "center", fontWeight: "bold" },

  container: { padding: 16 },
  moduleTitle: { fontSize: 22, fontWeight: "bold" },
  moduleSubtitle: { fontSize: 14, color: "#777", marginBottom: 14 },

  tierRow: { flexDirection: "row", marginBottom: 16 },
  tierButton: {
    flex: 1,
    borderWidth: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: "center",
  },
  tierButtonActive: { backgroundColor: "#2563eb" },
  tierButtonTextActive: { color: "#fff" },

  lockedBox: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },
  lockedText: { fontWeight: "bold" },
  lockedSub: { fontSize: 12, color: "#555" },

  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
  },
  cardId: { fontSize: 11, color: "#666" },
  questionText: { fontWeight: "600", fontSize: 15 },
  optionText: { marginTop: 4 },

  revealButton: {
    marginTop: 10,
    backgroundColor: "#10b981",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  revealButtonText: { color: "#fff", fontWeight: "bold" },

  answerBlock: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  answerLabel: { fontWeight: "bold" },
  answerText: { marginTop: 4 },
  explanationText: { marginTop: 4, color: "#555" },

  completeButton: {
    marginTop: 20,
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  completeButtonDisabled: { backgroundColor: "#9ca3af" },
  completeText: { color: "#fff", fontWeight: "bold" },
});
