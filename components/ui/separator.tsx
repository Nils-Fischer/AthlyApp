// components/ui/separator.tsx
import * as React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof View> {
  orientation?: "horizontal" | "vertical";
  text?: string;
}

const Separator = React.forwardRef<React.ElementRef<typeof View>, SeparatorProps>(
  ({ className, orientation = "horizontal", text, ...props }, ref) => {
    if (text && orientation === "horizontal") {
      return (
        <View ref={ref} className={cn("flex-row items-center", className)} {...props}>
          <View className="flex-1 h-[1px] bg-border" />
          <Text className="text-muted-foreground mx-2">{text}</Text>
          <View className="flex-1 h-[1px] bg-border" />
        </View>
      );
    }

    return (
      <View
        ref={ref}
        className={cn("bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className)}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
