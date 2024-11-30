// components/ui/separator.tsx
import * as React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";

interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof View> {
  orientation?: "horizontal" | "vertical";
}

const Separator = React.forwardRef<React.ElementRef<typeof View>, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(
          "bg-border",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };