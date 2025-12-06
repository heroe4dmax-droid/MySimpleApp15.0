// app/index.js
import { Redirect } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../config/firebase";

export default function Index() {
  const [authState, setAuthState] = useState("loading");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthState(user ? "in" : "out");
    });
    return () => unsub();
  }, []);

  if (authState === "loading") return null;

  return authState === "in"
    ? <Redirect href="/(tabs)/home" />
    : <Redirect href="/login" />;
}
