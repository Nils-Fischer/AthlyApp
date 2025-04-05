import { Stack } from "expo-router";

export default function ExerciseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="[exerciseId]" />
    </Stack>
  );
}
