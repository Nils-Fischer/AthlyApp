import { Tabs } from "expo-router";
import { Home, HomeFilled } from "~/lib/icons/Home";
import { Dumbbell, DumbbellFilled } from "~/lib/icons/Dumbbell";
import { MessageCircle, MessageCircleFilled } from "~/lib/icons/MessageCircle";
import { Apple, AppleFilled } from "~/lib/icons/Apple";
import { BarChart, BarChartFilled } from "~/lib/icons/BarChartIcon";
import { ThemeToggle } from "~/components/ThemeToggle";
import { useTheme } from "@react-navigation/native";

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
    name: "Home",
    label: "index",
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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.text + "80",
        headerShown: true,
        headerRight: () => <ThemeToggle />,
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
                return (
                  <Icon
                    size={28}
                    className={`text-foreground ${
                      focused ? "fill-foreground" : ""
                    }`}
                  />
                );
              },
            }}
          />
        );
      })}
    </Tabs>
  );
}
