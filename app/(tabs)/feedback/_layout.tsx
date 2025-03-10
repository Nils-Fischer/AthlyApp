import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Feedback",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
    </Stack>
  );
}
