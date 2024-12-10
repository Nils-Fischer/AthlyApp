import * as React from "react";
import { View } from "react-native";
import { Text } from "./text";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export type DropdownItem = {
  name: string;
  icon: React.ElementType;
  onPress: () => void;
  destructive?: boolean;
};

interface CustomDropdownMenuProps {
  items: DropdownItem[];
  trigger: React.ReactNode;
  align?: "start" | "end" | "center";
  side?: "top" | "bottom";
}

export function CustomDropdownMenu({ items, trigger, align = "end", side = "bottom" }: CustomDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent
        avoidCollisions={true}
        align={align}
        side={side}
        className="w-64 rounded-xl bg-background/95 backdrop-blur"
      >
        {items.map((item, index) => (
          <React.Fragment key={item.name}>
            <DropdownMenuItem className="flex-row items-center py-3 focus:bg-muted" onPress={item.onPress}>
              <View className="flex-1">
                <Text className={`text-base font-medium ${item.destructive ? "text-destructive" : ""}`}>
                  {item.name}
                </Text>
              </View>
              <item.icon size={20} className={item.destructive ? "text-destructive" : "text-primary"} />
            </DropdownMenuItem>
            {index < items.length - 1 && <DropdownMenuSeparator className="bg-border/50" />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
