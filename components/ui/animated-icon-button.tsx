import * as React from "react";
import { Pressable, Animated, GestureResponderEvent } from "react-native";
import * as Haptics from "expo-haptics";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export type HapticsFeedback =
  | "selection"
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "rigid"
  | "soft";

export interface AnimatedIconButtonProps {
  /**
   * Callback invoked when the button is pressed.
   */
  onPress: (event: GestureResponderEvent) => void;
  /**
   * The icon to display on the button.
   */
  icon: React.ReactNode;
  /**
   * Optional label to display next to the icon.
   */
  label?: string;
  /**
   * Additional styling classes.
   */
  className?: string;
  /**
   * Disables the button when true.
   */
  disabled?: boolean;
  /**
   * Type of haptic feedback to trigger on press.
   */
  haptics?: HapticsFeedback;
}

export const AnimatedIconButton = React.forwardRef<React.ElementRef<typeof Pressable>, AnimatedIconButtonProps>(
  ({ onPress, icon, label, className, disabled, haptics }, ref) => {
    // Use a ref to store the animated scale value for performance.
    const scale = React.useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    };

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
      onPress(event);
    };

    return (
      <Pressable
        ref={ref}
        disabled={disabled}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={cn(
          "justify-center flex-row items-center px-6 py-3 rounded-full active:opacity-90 bg-primary",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <Animated.View style={{ transform: [{ scale }] }} className="flex-row items-center gap-2">
          {icon}
          {label && <Text className="text-base font-medium text-background">{label}</Text>}
        </Animated.View>
      </Pressable>
    );
  }
);

AnimatedIconButton.displayName = "AnimatedIconButton";
