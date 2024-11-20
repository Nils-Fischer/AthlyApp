import { Stack } from "expo-router";

export default function ExerciseLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "Übungen",
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Übungsdetails",
        }}
      />
    </Stack>
  );
}
