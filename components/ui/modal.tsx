import * as DialogPrimitive from "@rn-primitives/dialog";
import * as React from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { X } from "~/lib/icons/Icons";
import { cn } from "~/lib/utils";
import * as Haptics from "expo-haptics";
import { type GestureResponderEvent } from "react-native";
import { type HapticsFeedback } from "./button";

const Modal = DialogPrimitive.Root;

const ModalTrigger = DialogPrimitive.Trigger;

const ModalPortal = DialogPrimitive.Portal;

const ModalClose = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Close> & { haptics?: HapticsFeedback }
>(({ haptics, onPress, ...props }, ref) => {
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

  return <DialogPrimitive.Close ref={ref} {...props} onPress={handlePress} />;
});

ModalClose.displayName = "ModalClose";

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => {
  const { open } = DialogPrimitive.useRootContext();

  if (Platform.OS === "web") {
    return (
      <DialogPrimitive.Overlay
        {...props}
        ref={ref}
        className={cn(
          "bg-black/80 flex justify-center items-center p-0 absolute top-0 right-0 bottom-0 left-0",
          open ? "web:animate-in web:fade-in-0" : "web:animate-out web:fade-out-0",
          className
        )}
      />
    );
  }

  return (
    <DialogPrimitive.Overlay
      style={StyleSheet.absoluteFill}
      {...props}
      ref={ref}
      className={cn("flex bg-black/80 justify-center items-center p-0", className)}
    />
  );
});

ModalOverlay.displayName = "ModalOverlay";

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { portalHost?: string }
>(({ className, children, portalHost, ...props }, ref) => {
  const { open } = DialogPrimitive.useRootContext();
  return (
    <ModalPortal hostName={portalHost}>
      <ModalOverlay>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "w-full h-full border-none bg-background p-4 shadow-lg web:duration-200",
            open ? "web:animate-in web:fade-in-0" : "web:animate-out web:fade-out-0",
            className
          )}
          {...props}
        >
          {Platform.OS === "web" ? (
            <div className="relative w-full h-full">
              {children}
              <ModalClose
                haptics="medium"
                className="absolute left-4 top-4 z-10 p-1 rounded-full bg-background/90 web:group opacity-70 web:ring-offset-background web:transition-opacity web:hover:opacity-100 web:focus:outline-none web:focus:ring-2 web:focus:ring-muted web:focus:ring-offset-2 web:disabled:pointer-events-none"
              >
                <X size={16} className="text-muted-foreground" />
              </ModalClose>
            </div>
          ) : (
            <Animated.View
              entering={FadeIn.duration(150)}
              exiting={FadeOut.duration(150)}
              style={{ width: "100%", height: "100%" }}
            >
              <View style={{ position: "relative", width: "100%", height: "100%" }}>
                {children}
                <ModalClose
                  haptics="medium"
                  style={{
                    position: "absolute",
                    left: 16,
                    top: 16,
                    zIndex: 10,
                    padding: 4,
                    borderRadius: 9999,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    opacity: 0.7,
                  }}
                >
                  <X size={20} color="#666" />
                </ModalClose>
              </View>
            </Animated.View>
          )}
        </DialogPrimitive.Content>
      </ModalOverlay>
    </ModalPortal>
  );
});

ModalContent.displayName = "ModalContent";

export { Modal, ModalClose, ModalContent, ModalTrigger };
