import "~/global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/useColorScheme";
import { PortalHost } from "@rn-primitives/portal";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { SessionProvider } from "~/context";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useUserStore } from "~/stores/userStore";
import { useEffect } from "react";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "900",
    },
  },
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    regular: {
      fontFamily: "System",
      fontWeight: "400",
    },
    medium: {
      fontFamily: "System",
      fontWeight: "500",
    },
    bold: {
      fontFamily: "System",
      fontWeight: "700",
    },
    heavy: {
      fontFamily: "System",
      fontWeight: "900",
    },
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before getting the color scheme.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
  const exerciseStore = useExerciseStore();
  const userStore = useUserStore();

  // Initialize AsyncStorage and fetch data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // First ensure AsyncStorage is working
        await AsyncStorage.setItem("APP_INITIALIZED", "true");

        await Promise.all([exerciseStore.fetchInitialData(), userStore.fetchUserData()]);
      } catch (error) {
        console.error("Failed to initialize app:", error);
        // Optionally show an error toast/alert here
      }
    };

    initializeApp();
  }, []);

  // Handle theme setup
  useEffect(() => {
    const setupTheme = async () => {
      try {
        const theme = await AsyncStorage.getItem("theme");

        if (Platform.OS === "web") {
          document.documentElement.classList.add("bg-background");
        }

        const colorTheme = theme || colorScheme;
        if (colorTheme !== colorScheme) {
          setColorScheme(colorTheme as "light" | "dark");
          setAndroidNavigationBar(colorTheme as "light" | "dark");
        } else {
          setAndroidNavigationBar(colorTheme);
        }

        // Save theme if not exists
        if (!theme) {
          await AsyncStorage.setItem("theme", colorScheme);
        }

        setIsColorSchemeLoaded(true);
      } catch (error) {
        console.error("Theme setup failed:", error);
        // Fallback to default theme
        setIsColorSchemeLoaded(true);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    setupTheme();
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (
    <SessionProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </SessionProvider>
  );
}
