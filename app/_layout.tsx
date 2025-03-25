//app\_layout.tsx
import "~/global.css";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme, ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { NAV_THEME } from "~/lib/constants";
import { PortalHost } from "@rn-primitives/portal";
import { SessionProvider } from "~/context";
import { useExerciseStore } from "~/stores/exerciseStore";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SheetProvider } from "react-native-actions-sheet";
import "~/app/sheets";
import { WelcomeScreen } from "~/components/WelcomeScreen";
import { useUserProfileStore } from "~/stores/userProfileStore";

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

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isReady, setIsReady] = React.useState(false);
  const [firstLaunch, setFirstLaunch] = React.useState(false);
  const { updateProfile } = useUserProfileStore();
  const exerciseStore = useExerciseStore();

  const checkFirstLaunch = async () => {
    await AsyncStorage.removeItem("FIRST_LAUNCH");
    const __first_launch = await AsyncStorage.getItem("FIRST_LAUNCH");
    if (!__first_launch) {
      console.log("First launch");
      setFirstLaunch(true);
    } else {
      setFirstLaunch(false);
    }
  };

  React.useEffect(() => {
    async function initialize() {
      try {
        /* disable darkmode for now
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
        */

        await AsyncStorage.setItem("APP_INITIALIZED", "true");
        await Promise.all([exerciseStore.fetchInitialData()]);

        setIsReady(true);
        SplashScreen.hideAsync();
      } catch (error) {
        console.error("Initialization failed:", error);
        setIsReady(true);
        SplashScreen.hideAsync();
      }
    }

    initialize();
    checkFirstLaunch();
  }, []);

  if (!isReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SessionProvider>{null}</SessionProvider>
      </GestureHandlerRootView>
    );
  }

  if (firstLaunch) {
    return (
      <SessionProvider>
        <WelcomeScreen
          finish={async (profile) => {
            if (profile) {
              await updateProfile(profile);
            }
            await AsyncStorage.setItem("FIRST_LAUNCH", "Done");
            setFirstLaunch(false);
          }}
        />
      </SessionProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <SheetProvider>
          <ThemeProvider value={LIGHT_THEME}>
            <StatusBar style={"light"} />
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <PortalHost />
          </ThemeProvider>
        </SheetProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
