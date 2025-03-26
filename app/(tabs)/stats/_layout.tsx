import { Stack } from "expo-router";

export default function StatsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Statistiken",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
