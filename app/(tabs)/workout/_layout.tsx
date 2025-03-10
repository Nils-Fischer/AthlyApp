import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Workout",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="exercise"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
