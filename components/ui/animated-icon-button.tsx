import React from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface AnimatedIconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function AnimatedIconButton({ onPress, icon, label, className, disabled }: AnimatedIconButtonProps) {
  const scale = new Animated.Value(1);

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

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
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
    </TouchableOpacity>
  );
}
