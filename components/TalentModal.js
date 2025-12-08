import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { canUnlockTalent } from "../utils/talentSystem";
import { getTalentLockReasons } from "../utils/talentAccess";
import { formatTitle } from "../utils/formatters";

export default function TalentModal({
  visible,
  onClose,
  talent,
  hero,
  onUnlock,
  unlockedModules = []
}) {
  if (!talent) return null;

  const canUnlock = canUnlockTalent(talent, hero);
  const lockReasons = getTalentLockReasons(talent, hero);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>{talent.title}</Text>
          <Text style={styles.desc}>{talent.description}</Text>

          {unlockedModules.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Unlocks Modules:</Text>
              {unlockedModules.map(m => (
                <Text key={m.id} style={styles.text}>
                  • {m.title}
                </Text>
              ))}
            </View>
          )}

          {!canUnlock && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Locked:</Text>
              {lockReasons.map((r, i) => (
                <Text key={i} style={styles.text}>
                  • {r.message}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancel}>Close</Text>
            </TouchableOpacity>

            {canUnlock && (
              <TouchableOpacity onPress={() => onUnlock(talent.id)}>
                <Text style={styles.confirm}>Unlock</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 20,
  },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  desc: { color: "#ccc", marginTop: 8 },
  section: { marginTop: 14 },
  sectionTitle: { color: "#ff9800", marginBottom: 4 },
  text: { color: "#bbb" },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancel: { color: "#aaa", marginRight: 20 },
  confirm: { color: "#4caf50", fontWeight: "bold" },
});
