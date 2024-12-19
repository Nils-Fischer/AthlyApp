//app\(tabs)\dashboard\active-workout\_layout.tsx
import { Stack } from "expo-router";

export default function ActiveWorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        presentation: "fullScreenModal",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="[id]" options={{ headerShown: true }} />
      <Stack.Screen name="exercise-logging" options={{ headerShown: false }} />
    </Stack>
  );
}
