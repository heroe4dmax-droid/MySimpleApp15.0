// app/(tabs)/profile.js
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../config/firebase";

import Button from "../../components/Button";   // you DO have this
import { getAllHeroes } from "../../services/heroService";
import { getUser } from "../../services/userService";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userDoc, setUserDoc] = useState(null);
  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const data = await getUser(user.uid);
        setUserDoc(data);

        const heroes = await getAllHeroes(user.uid);
        setHeroCount(heroes.length);
      } catch (err) {
        console.log("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading profile...</Text>
      </View>
    );
  }

  if (!userDoc) {
    return (
      <View style={styles.center}>
        <Text>Could not load profile.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{userDoc.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{userDoc.email}</Text>

        <Text style={styles.label}>Heroes</Text>
        <Text style={styles.value}>{heroCount}</Text>
      </View>

      <Button
        title="Manage Heroes"
        onPress={() => router.push("/hero-select")}
      />

      <View style={{ marginTop: 16 }}>
        <Button
          title="Log Out"
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#F4F4F4",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "500",
  },
});
