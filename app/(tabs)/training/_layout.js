import { Stack } from "expo-router";

export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Training" }} />
      <Stack.Screen name="rbt/index" options={{ title: "RBT Training" }} />
      <Stack.Screen name="rbt/[moduleId]" options={{ title: "Module" }} />
    </Stack>
  );
}
