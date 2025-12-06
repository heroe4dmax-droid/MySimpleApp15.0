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

// ✅ Module imports
import module1 from "../../../../../config/trainingModules/rbt/module1.json";
import module2 from "../../../../../config/trainingModules/rbt/module2.json";
import module3 from "../../../../../config/trainingModules/rbt/module3.json";
import module4 from "../../../../../config/trainingModules/rbt/module4.json";
import module5 from "../../../../../config/trainingModules/rbt/module5.json";
import module6 from "../../../../../config/trainingModules/rbt/module6.json";
import module7 from "../../../../../config/trainingModules/rbt/module7.json";

const MODULE_MAP = {
  "1": module1,
  "2": module2,
  "3": module3,
  "4": module4,
  "5": module5,
  "6": module6,
  "7": module7,
};

const TIERS = [
  { key: "novice", label: "Novice" },
  { key: "standard", label: "Standard" },
  { key: "expert", label: "Expert" },
];

export default function FlashcardsScreen() {
  const { moduleId } = useLocalSearchParams();
  const router = useRouter();
  const moduleData = MODULE_MAP[moduleId];

  const [revealed, setRevealed] = useState({});
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
      const activeHeroId = userDoc?.activeHeroId;
      if (!activeHeroId) return;

      const heroData = await getHero(user.uid, activeHeroId);
      setHero(heroData);
      setHeroId(activeHeroId);
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
  // TIER UNLOCK (JSON-DRIVEN)
  // --------------------------------------------------
  const tierUnlock = moduleData.flashcardUnlock?.[selectedTier] ?? {};
  const heroStats = hero?.stats ?? {};
  const heroLevel = hero?.level ?? 1;

  const meetsStatReq =
    heroStats.intellect >= (tierUnlock.stats?.intellect ?? 0) &&
    heroStats.wisdom >= (tierUnlock.stats?.wisdom ?? 0) &&
    heroStats.discipline >= (tierUnlock.stats?.discipline ?? 0);

  const meetsLevelReq = heroLevel >= (tierUnlock.level ?? 1);
  const tierLocked = !meetsStatReq || !meetsLevelReq;

  // --------------------------------------------------
  // CARDS
  // --------------------------------------------------
  const cards = moduleData.flashcards?.[selectedTier] || [];

  const perCardXP =
    moduleData.flashcardXP?.perCard || {};

  const tierXP =
    moduleData.flashcardXP?.[selectedTier] ||
    moduleData.flashcardXP?.tier?.[selectedTier] ||
    0;

  // --------------------------------------------------
  // TOGGLE ANSWER + XP (ONE-TIME PER CARD)
  // --------------------------------------------------
  const handleReveal = async (card) => {
    if (revealed[card.id]) return;

    setRevealed((prev) => ({ ...prev, [card.id]: true }));

    const xp = perCardXP[card.type] ?? 0;
    if (xp > 0 && userId && heroId) {
      await giveHeroXP(userId, heroId, xp);
    }
  };

  // --------------------------------------------------
  // TIER COMPLETION
  // --------------------------------------------------
  const allRevealed = cards.length > 0 && cards.every((c) => revealed[c.id]);

  const handleCompleteTier = async () => {
    if (!allRevealed) {
      Alert.alert("Incomplete", "Reveal all cards first.");
      return;
    }

    if (tierXP > 0 && userId && heroId) {
      await giveHeroXP(userId, heroId, tierXP);
      Alert.alert("Tier Complete!", `+${tierXP} XP`);
    }
  };

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
            const active = tier.key === selectedTier;
            return (
              <TouchableOpacity
                key={tier.key}
                style={[
                  styles.tierButton,
                  active && styles.tierButtonActive,
                ]}
                onPress={() => setSelectedTier(tier.key)}
              >
                <Text
                  style={[
                    styles.tierButtonText,
                    active && styles.tierButtonTextActive,
                  ]}
                >
                  {tier.label}
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
              Requires Level {tierUnlock.level ?? 1}
            </Text>
          </View>
        )}

        {!tierLocked &&
          cards.map((card) => {
            const isRevealed = !!revealed[card.id];
            return (
              <View key={card.id} style={styles.card}>
                <Text style={styles.cardId}>
                  #{card.id} · {card.type.toUpperCase()}
                </Text>

                <Text style={styles.questionText}>{card.question}</Text>

                {Array.isArray(card.options) &&
                  card.options.map((opt, idx) => (
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
                    <Text style={styles.answerLabel}>Answer:</Text>
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
              !allRevealed && styles.completeButtonDisabled,
            ]}
            disabled={!allRevealed}
            onPress={handleCompleteTier}
          >
            <Text style={styles.completeText}>
              Complete Tier (+{tierXP} XP)
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", justifyContent: "center" },
  error: { fontSize: 18, color: "red" },

  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backText: { color: "#2563eb", fontSize: 16 },
  headerTitle: { flex: 1, textAlign: "center", fontWeight: "bold" },

  container: { padding: 16 },
  moduleTitle: { fontSize: 22, fontWeight: "bold" },
  moduleSubtitle: { fontSize: 14, color: "#777", marginBottom: 12 },

  tierRow: { flexDirection: "row", marginBottom: 16 },
  tierButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderRadius: 50,
    alignItems: "center",
  },
  tierButtonActive: { backgroundColor: "#2563eb" },
  tierButtonTextActive: { color: "white" },

  lockedBox: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },

  card: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },
  cardId: { fontSize: 11, color: "#666" },
  questionText: { fontWeight: "600", fontSize: 15 },
  optionText: { marginTop: 4 },

  revealButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: "#10b981",
    borderRadius: 8,
    alignItems: "center",
  },

  answerBlock: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
  },

  completeButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#2563eb",
    marginTop: 20,
  },
  completeButtonDisabled: { backgroundColor: "#9ca3af" },
  completeText: { color: "white", fontWeight: "bold" },
});
