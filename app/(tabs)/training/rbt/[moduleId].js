import { useLocalSearchParams } from "expo-router";
import UniversalTrainingScreen from "../UniversalTrainingScreen";

export default function ModulePage() {
  const { moduleId } = useLocalSearchParams();
  if (!moduleId) return null;

  return <UniversalTrainingScreen />;
}
