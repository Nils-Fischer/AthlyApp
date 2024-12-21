import { Tabs, usePathname } from "expo-router";
import { BarChart, BarChartFilled } from "~/lib/icons/BarChartIcon";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useTheme } from "@react-navigation/native";
import { Apple, ChevronLeft, Dumbbell, Home, MessageCircle } from "~/lib/icons/Icons";
import { AppleFilled, DumbbellFilled, HomeFilled, MessageCircleFilled } from "~/lib/icons/FilledIcons";

interface Route {
  name: string;
  label: string;
  icon: {
    outlined: React.ElementType;
    filled: React.ElementType;
  };
}

const routes: Route[] = [
  {
    name: "Dashboard",
    label: "(dashboard)",
    icon: {
      outlined: Home,
      filled: HomeFilled,
    },
  },
  {
    name: "Workout",
    label: "workout",
    icon: {
      outlined: Dumbbell,
      filled: DumbbellFilled,
    },
  },
  {
    name: "Chat",
    label: "chat",
    icon: {
      outlined: MessageCircle,
      filled: MessageCircleFilled,
    },
  },
  {
    name: "Diet",
    label: "diet",
    icon: {
      outlined: Apple,
      filled: AppleFilled,
    },
  },
  {
    name: "Stats",
    label: "stats",
    icon: {
      outlined: BarChart,
      filled: BarChartFilled,
    },
  },
];

export default function TabLayout() {
  const { colors } = useTheme();
  const pathname = usePathname();
  const isRootPath = pathname.split("/").length <= 2;
  const hideTabBar = pathname.startsWith("/active-workout");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text + "80",
        headerShown: isRootPath,
        headerRight: isRootPath ? () => <ThemeToggle /> : undefined,
        tabBarStyle: {
          display: hideTabBar ? "none" : "flex",
        },
      }}
    >
      {routes.map((route) => {
        return (
          <Tabs.Screen
            key={route.name}
            name={route.label}
            options={{
              title: route.name,
              tabBarIcon: ({ focused }) => {
                const Icon = focused ? route.icon.filled : route.icon.outlined;
                return <Icon size={28} className={`text-foreground ${focused ? "fill-foreground" : ""}`} />;
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
