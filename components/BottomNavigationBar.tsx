import * as React from "react";
import { View, Pressable } from "react-native";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";
import { Home } from "~/lib/icons/Home";
import { Dumbbell } from "~/lib/icons/Dumbbell";
import { MessageCircle } from "~/lib/icons/MessageCircle";
import { Apple } from "~/lib/icons/Apple";
import { BarChartIcon } from "~/lib/icons/BarChartIcon";

interface Route {
  name: string;
  label: string;
  icon: React.ElementType;
}

interface BottomNavigationProps {
  activeRoute?: string;
  onRouteChange: (routeName: string) => void;
  className?: string;
}

const routes: Route[] = [
  {
    name: "home",
    label: "Dashboard",
    icon: Home,
  },
  {
    name: "workout",
    label: "Workout",
    icon: Dumbbell,
  },
  {
    name: "chat",
    label: "Chat",
    icon: MessageCircle,
  },
  {
    name: "diet",
    label: "Diet",
    icon: Apple,
  },
  {
    name: "stats",
    label: "Stats",
    icon: BarChartIcon,
  },
];

const BottomNavigation = React.forwardRef<View, BottomNavigationProps>(
  ({ activeRoute = "home", onRouteChange, className }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "flex-row border-t border-border bg-background p-4 pb-8",
          className
        )}
      >
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = activeRoute === route.name;

          return (
            <Pressable
              key={route.name}
              onPress={() => onRouteChange(route.name)}
              className={cn(
                "flex-1 items-center justify-center",
                "web:hover:opacity-80 active:opacity-70",
                "transition-opacity"
              )}
            >
              <Icon
                size={isActive ? 28 : 24}
                strokeWidth={isActive ? 2.5 : 2}
                className="text-foreground"
              />
              <Text
                className={cn(
                  "text-xs mt-1 text-foreground",
                  isActive && "font-semibold"
                )}
              >
                {route.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }
);

BottomNavigation.displayName = "BottomNavigation";

export { BottomNavigation };
export type { BottomNavigationProps };
