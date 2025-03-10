// app/(tabs)/(dashboard)/_layout.tsx (previously index folder)
import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Dashboard",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen
        name="active-workout"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="workout-completion"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
}
