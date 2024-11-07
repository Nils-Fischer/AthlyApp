import * as React from "react";
import { View, Pressable } from "react-native";
import {
  Home,
  Dumbbell,
  MessageCircle,
  Apple,
  BarChart3,
} from "lucide-react-native";
import { Text } from "./text";
import { cn } from "~/lib/utils";

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
    icon: BarChart3,
  },
];

const BottomNavigation = React.forwardRef<View, BottomNavigationProps>(
  ({ activeRoute = "home", onRouteChange, className }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "flex-row items-center justify-around border-t border-border bg-background px-4 py-2",
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
                "items-center px-3 py-2",
                "web:hover:opacity-80 active:opacity-70",
                "transition-opacity"
              )}
            >
              <Icon
                size={24}
                className={cn("text-muted-foreground")}
                fill={isActive ? "currentColor" : "none"}
                strokeWidth={isActive ? 1.5 : 2}
              />
              <Text
                className={cn(
                  "text-xs mt-1 text-muted-foreground",
                  isActive && "font-medium"
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
