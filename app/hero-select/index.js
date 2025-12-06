// app/hero-select/index.js

import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { auth, db } from "../../config/firebase";
import { collection, doc, getDocs, getDoc, updateDoc } from "firebase/firestore";

import { HERO_CLASSES } from "../../config/heroClasses";

import { useFocusEffect } from "@react-navigation/native";

export default function HeroSelect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [heroes, setHeroes] = useState([]);
  const [activeHeroId, setActiveHeroId] = useState(null);

  // 🔥 ALWAYS reload heroes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const user = auth.currentUser;
        if (!user) return;

        // Load user (for active hero)
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const activeId = userDoc.data()?.activeHeroId || null;

        // Load hero list
        const heroSnap = await getDocs(collection(db, "users", user.uid, "heroes"));
        const heroList = heroSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setHeroes(heroList);
        setActiveHeroId(activeId);
        setLoading(false);
      }

      loadData();
    }, [])
  );

  async function selectHero(heroId) {
    const user = auth.currentUser;
    if (!user) return;

    setActiveHeroId(heroId);

    await updateDoc(doc(db, "users", user.uid), {
      activeHeroId: heroId,
    });

    router.replace("/(tabs)/home");
  }

  if (loading) {
    return (
      <View style={{ padding: 20 }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading Heroes...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 26, marginBottom: 20 }}>
        Select Your Hero
      </Text>

      {/* If no heroes exist */}
      {heroes.length === 0 && (
        <TouchableOpacity
          onPress={() => router.push("/create-hero")}
          style={{
            backgroundColor: "#007bff",
            padding: 16,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
            Create Your First Hero
          </Text>
        </TouchableOpacity>
      )}

      {/* List heroes */}
      {heroes.map((hero) => {
        const classInfo = HERO_CLASSES.find((c) => c.id === hero.classId);

        return (
          <TouchableOpacity
            key={hero.id}
            onPress={() => selectHero(hero.id)}
            style={{
              padding: 16,
              borderRadius: 12,
              marginBottom: 16,
              backgroundColor: activeHeroId === hero.id ? "#d0d8ff" : "#f0f0f0",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {classInfo && (
                <Image
                  source={classInfo.avatar}
                  style={{ width: 60, height: 60, marginRight: 16 }}
                />
              )}

              <View>
                <Text style={{ fontSize: 20 }}>{hero.name}</Text>
                <Text style={{ opacity: 0.7 }}>{classInfo?.name}</Text>

                <Text style={{ marginTop: 6, opacity: 0.7 }}>
                  Level: {hero.level}  |  XP: {hero.xp}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Create new hero */}
      <TouchableOpacity
        onPress={() => router.push("/create-hero")}
        style={{
          backgroundColor: "#007bff",
          padding: 16,
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 18 }}>
          Create New Hero
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
