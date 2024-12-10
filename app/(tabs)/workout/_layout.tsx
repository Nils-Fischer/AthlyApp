import { Stack, usePathname } from "expo-router";

export default function WorkoutLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
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
          headerShown: true,
        }}
      />
    </Stack>
  );
}
