//components/TrainingCard.js
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TrainingCard({
  title,
  description,
  onPress,
  locked = false,
  completed = false,
  lockReasons = [],
}) {
  const disabled = locked || completed;

  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.card,
        locked && styles.lockedCard,
        completed && styles.completedCard,
      ]}
    >
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {completed && (
          <Text style={styles.completedBadge}>✅ Completed</Text>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {/* Locked reasons */}
      {locked && lockReasons.length > 0 && (
        <View style={styles.lockBox}>
          <Text style={styles.lockTitle}>🔒 Locked</Text>
          {lockReasons.map((r, i) => (
            <Text key={i} style={styles.lockText}>
              • {r.message}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
  },

  /* STATES */
  lockedCard: {
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    borderColor: "#ff9800",
  },
  completedCard: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#4caf50",
  },

  /* TEXT */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  description: {
    opacity: 0.6,
    marginTop: 2,
  },

  /* BADGES */
  completedBadge: {
    color: "#2e7d32",
    fontWeight: "600",
    fontSize: 14,
  },

  /* LOCKED INFO */
  lockBox: {
    marginTop: 10,
  },
  lockTitle: {
    color: "#ff9800",
    fontWeight: "600",
    marginBottom: 4,
  },
  lockText: {
    color: "#666",
    fontSize: 14,
  },
});
