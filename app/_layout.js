// app/_layout.js
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="register/index" />
      <Stack.Screen name="create-hero/index" />
      <Stack.Screen name="hero-select/index" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
