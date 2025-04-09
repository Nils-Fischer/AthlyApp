import { router, Stack } from "expo-router";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/Icons";

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: "Einstellungen",
        headerLeft: () => (
          <Button variant="ghost" size="icon" className="rounded-full" onPress={() => router.back()}>
            <ChevronLeft size={24} className="text-foreground" />
          </Button>
        ),
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="profile" options={{ headerShown: true, headerTitle: "Profil" }} />
      <Stack.Screen name="privacy-policy" options={{ headerShown: true, headerTitle: "Datenschutzerklärung" }} />
      <Stack.Screen name="terms-of-service" options={{ headerShown: true, headerTitle: "Nutzungsbedingungen" }} />
    </Stack>
  );
}
