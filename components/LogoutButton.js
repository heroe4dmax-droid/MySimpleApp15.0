import { TouchableOpacity, Text } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { useRouter } from "expo-router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleLogout}
      style={{
        backgroundColor: "#d9534f",
        padding: 12,
        borderRadius: 10,
        marginTop: 30,
      }}
    >
      <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
        Log Out
      </Text>
    </TouchableOpacity>
  );
}
