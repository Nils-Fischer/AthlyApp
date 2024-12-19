import { Stack } from "expo-router";

export default function ExerciseLoggingLayout() {
  return (
    <Stack>
      <Stack.Screen name="[exerciseId]" options={{ headerShown: true }} />
    </Stack>
  );
}
