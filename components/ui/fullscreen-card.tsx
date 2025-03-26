import * as React from "react";
import { View, ViewProps } from "react-native";
import { cn } from "~/lib/utils";
import type { ViewRef } from "@rn-primitives/types";
import { TextClassContext } from "~/components/ui/text";

interface FullscreenCardTopProps extends ViewProps {
  children: React.ReactNode;
}

interface FullscreenCardContentProps extends ViewProps {
  children: React.ReactNode;
  overlap?: number;
}

interface FullscreenCardProps extends ViewProps {
  children: React.ReactNode;
}

const FullscreenCardTop = React.forwardRef<ViewRef, FullscreenCardTopProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("w-full", className)} {...props}>
      {children}
    </View>
  )
);
FullscreenCardTop.displayName = "FullscreenCardTop";

const FullscreenCardContent = React.forwardRef<ViewRef, FullscreenCardContentProps>(
  ({ className, children, overlap = 0, ...props }, ref) => (
    <View
      ref={ref}
      style={{ marginTop: overlap ? -overlap : 0 }}
      className={cn("rounded-t-3xl border border-border bg-card p-6 shadow-md shadow-foreground/5", className)}
      {...props}
    >
      <TextClassContext.Provider value="text-card-foreground">{children}</TextClassContext.Provider>
    </View>
  )
);
FullscreenCardContent.displayName = "FullscreenCardContent";

// Main FullscreenCard component
const FullscreenCardComponent = React.forwardRef<ViewRef, FullscreenCardProps>(
  ({ className, children, ...props }, ref) => (
    <View ref={ref} className={cn("flex-1", className)} {...props}>
      {children}
    </View>
  )
);
FullscreenCardComponent.displayName = "FullscreenCard";

// Create compound component
const FullscreenCard = Object.assign(FullscreenCardComponent, {
  Top: FullscreenCardTop,
  Content: FullscreenCardContent,
});

export { FullscreenCard };
