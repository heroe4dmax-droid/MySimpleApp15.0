// app/(tabs)/guild.js
// app/(tabs)/guild.js
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { auth } from "../../config/firebase"; // ✔️ ONLY import auth here
import { onAuthStateChanged } from "firebase/auth"; // ✔️ FIXED
import { getGuildStatus } from "../../services/guildServices.js";


export default function GuildScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const s = await getGuildStatus(user.uid);
        setStatus(s);
      } catch (err) {
        console.log("Guild load error:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Loading guild status...</Text>
      </View>
    );
  }

  if (!status) {
    return (
      <View style={styles.center}>
        <Text>Could not load guild data.</Text>
      </View>
    );
  }

  const { currentRank, xp } = status;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guild</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Current Rank</Text>
        <Text style={styles.rank}>{currentRank.name}</Text>

        <Text style={styles.label}>Guild XP</Text>
        <Text style={styles.value}>{xp}</Text>

        <Text style={styles.next}>
          Next rank at {currentRank.xpRequired}+ XP
        </Text>
      </View>

      <Text style={{ opacity: 0.7, marginTop: 10 }}>
        Earn guild XP by completing training modules and leveling your heroes.
      </Text>
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
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  rank: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
  },
  next: {
    marginTop: 8,
    opacity: 0.7,
  },
});
