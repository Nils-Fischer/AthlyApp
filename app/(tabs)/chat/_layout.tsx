import { Stack } from "expo-router";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerRight: () => <ThemeToggle />,
        headerTitle: "Chat",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
    </Stack>
  );
}
