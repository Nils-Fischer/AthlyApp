//app\_layout.tsx
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
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
  ErrorBoundary,
} from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isReady, setIsReady] = React.useState(false);
  const exerciseStore = useExerciseStore();
  const userStore = useUserStore();

  React.useEffect(() => {
    async function initialize() {
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

        if (!theme) {
          await AsyncStorage.setItem("theme", colorScheme);
        }

        await AsyncStorage.setItem("APP_INITIALIZED", "true");
        await Promise.all([exerciseStore.fetchInitialData(), userStore.fetchUserData()]);

        setIsReady(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Initialization failed:", error);
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    initialize();
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SessionProvider>{null}</SessionProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
          <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
          <Stack screenOptions={{
            headerShown: false,
            animation: 'none'
          }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="dashboard" 
              options={{ 
                animation: 'slide_from_bottom',
                presentation: 'modal',
                animationDuration: 200
              }} 
            />
          </Stack>
          <PortalHost />
        </ThemeProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}