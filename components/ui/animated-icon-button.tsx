import React from "react";
import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { cn } from "~/lib/utils";

interface AnimatedIconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function AnimatedIconButton({ onPress, icon, label, className, disabled }: AnimatedIconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={cn(
        "justify-center flex-row items-center px-6 py-3 rounded-full active:opacity-90 bg-primary",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <Animated.View
        entering={FadeIn.duration(200).withInitialValues({ opacity: 0 }).springify()}
        className="flex-row items-center gap-2"
      >
        {icon}
        {label && <Text className="text-base font-medium text-background">{label}</Text>}
      </Animated.View>
    </TouchableOpacity>
  );
}
