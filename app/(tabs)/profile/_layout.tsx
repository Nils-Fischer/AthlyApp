import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Profile",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
    </Stack>
  );
}
