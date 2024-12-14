// app/(tabs)/workout/exercise/_layout.tsx
import { Stack } from "expo-router";

export default function ExerciseLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',  // Wichtig für modales Verhalten
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}