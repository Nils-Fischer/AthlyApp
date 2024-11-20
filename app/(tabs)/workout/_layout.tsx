import { Stack } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Workouts",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Workout Details",
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
