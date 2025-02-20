import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";
import * as React from "react";
import { Platform, StyleSheet, View, type ViewProps } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { buttonTextVariants, buttonVariants, HapticsFeedback } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { TextClassContext } from "~/components/ui/text";
import { GestureResponderEvent } from "react-native";
import * as Haptics from "expo-haptics";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const AlertDialogOverlayWeb = React.forwardRef<AlertDialogPrimitive.OverlayRef, AlertDialogPrimitive.OverlayProps>(
  ({ className, ...props }, ref) => {
    const { open } = AlertDialogPrimitive.useRootContext();
    return (
      <AlertDialogPrimitive.Overlay
        className={cn(
          "z-50 bg-black/50 flex justify-center items-center p-2 absolute top-0 right-0 bottom-0 left-0",
          open ? "web:animate-in web:fade-in-0" : "web:animate-out web:fade-out-0",
          className
        )}
        {...props}
        ref={ref}
      />
    );
  }
);

AlertDialogOverlayWeb.displayName = "AlertDialogOverlayWeb";

const AlertDialogOverlayNative = React.forwardRef<AlertDialogPrimitive.OverlayRef, AlertDialogPrimitive.OverlayProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <AlertDialogPrimitive.Overlay
        style={StyleSheet.absoluteFill}
        className={cn("z-50 bg-black/50 flex justify-center items-center px-4", className)}
        {...props}
        ref={ref}
        asChild
      >
        <Animated.View entering={FadeIn.duration(150)} exiting={FadeOut.duration(150)}>
          {children}
        </Animated.View>
      </AlertDialogPrimitive.Overlay>
    );
  }
);

AlertDialogOverlayNative.displayName = "AlertDialogOverlayNative";

const AlertDialogOverlay = Platform.select({
  web: AlertDialogOverlayWeb,
  default: AlertDialogOverlayNative,
});

const AlertDialogContent = React.forwardRef<
  AlertDialogPrimitive.ContentRef,
  AlertDialogPrimitive.ContentProps & { portalHost?: string }
>(({ className, portalHost, ...props }, ref) => {
  const { open } = AlertDialogPrimitive.useRootContext();

  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            "bg-background rounded-xl p-6 mx-4 shadow-lg shadow-foreground/10",
            open ? "web:animate-in web:fade-in-0 web:zoom-in-95" : "web:animate-out web:fade-out-0 web:zoom-out-95",
            className
          )}
          {...props}
        />
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
});
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName;

const AlertDialogHeader = ({ className, ...props }: ViewProps) => (
  <View className={cn("flex flex-col gap-2", className)} {...props} />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({ className, ...props }: ViewProps) => (
  <View className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2", className)} {...props} />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = React.forwardRef<AlertDialogPrimitive.TitleRef, AlertDialogPrimitive.TitleProps>(
  ({ className, ...props }, ref) => (
    <AlertDialogPrimitive.Title
      ref={ref}
      className={cn("text-lg native:text-xl text-foreground font-semibold", className)}
      {...props}
    />
  )
);
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName;

const AlertDialogDescription = React.forwardRef<
  AlertDialogPrimitive.DescriptionRef,
  AlertDialogPrimitive.DescriptionProps
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm native:text-base text-muted-foreground", className)}
    {...props}
  />
));
AlertDialogDescription.displayName = AlertDialogPrimitive.Description.displayName;

const AlertDialogAction = React.forwardRef<
  AlertDialogPrimitive.ActionRef,
  AlertDialogPrimitive.ActionProps & { haptics?: HapticsFeedback }
>(({ className, haptics, onPress, ...props }, ref) => {
  const handlePress = async (event: GestureResponderEvent) => {
    try {
      if (haptics) {
        if (haptics === "selection") {
          await Haptics.selectionAsync();
        } else if (haptics === "success") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (haptics === "warning") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else if (haptics === "error") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          await Haptics.impactAsync(haptics as Haptics.ImpactFeedbackStyle);
        }
      }
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TextClassContext.Provider value={buttonTextVariants({ className })}>
      <AlertDialogPrimitive.Action
        ref={ref}
        className={cn(buttonVariants(), className)}
        {...props}
        onPress={handlePress}
      />
    </TextClassContext.Provider>
  );
});
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName;

const AlertDialogCancel = React.forwardRef<
  AlertDialogPrimitive.CancelRef,
  AlertDialogPrimitive.CancelProps & { haptics?: HapticsFeedback }
>(({ className, haptics, onPress, ...props }, ref) => {
  const handlePress = async (event: GestureResponderEvent) => {
    try {
      if (haptics) {
        if (haptics === "selection") {
          await Haptics.selectionAsync();
        } else if (haptics === "success") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else if (haptics === "warning") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        } else if (haptics === "error") {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        } else {
          await Haptics.impactAsync(haptics as Haptics.ImpactFeedbackStyle);
        }
      }
    } catch (error) {
      console.warn("Haptic feedback failed:", error);
    }
    if (onPress) {
      onPress(event);
    }
  };

  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant: "outline" })}>
      <AlertDialogPrimitive.Cancel
        ref={ref}
        className={cn(buttonVariants({ variant: "outline", className }))}
        {...props}
        onPress={handlePress}
      />
    </TextClassContext.Provider>
  );
});
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
