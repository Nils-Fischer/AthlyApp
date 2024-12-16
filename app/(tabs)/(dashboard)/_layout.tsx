// app/(tabs)/(dashboard)/_layout.tsx (previously index folder)
import { Stack } from "expo-router";

export default function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="active-workout"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
}
