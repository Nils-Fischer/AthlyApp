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
        name="[routineId]"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="workout"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
