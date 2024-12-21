import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Play, Pause, StopCircle, X, Check } from "~/lib/icons/Icons";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, Easing } from "react-native-reanimated";
import { cn } from "~/lib/utils";
import { AnimatedIconButton } from "~/components/ui/animated-icon-button";

interface ActiveWorkoutControlsProps {
  isEditMode: boolean;
  isStarted: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onFinish: () => void;
  onCancel: () => void;
}

export function ActiveWorkoutControls({
  isEditMode,
  isStarted,
  isPaused,
  onStart,
  onPause,
  onResume,
  onFinish,
  onCancel,
}: ActiveWorkoutControlsProps) {
  if (isEditMode) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15).mass(0.9).stiffness(100)}
      exiting={SlideOutDown.duration(150).easing(Easing.ease)}
      className="absolute bottom-10 w-full px-4"
    >
      <View className="flex-row justify-center items-center gap-4">
        {!isStarted ? (
          <AnimatedIconButton
            onPress={onStart}
            icon={<Play className="text-background" size={24} />}
            label="Start Workout"
          />
        ) : (
          <View className="flex-row items-center gap-4">
            <AnimatedIconButton
              className="flex-none bg-destructive"
              onPress={onCancel}
              icon={<StopCircle className="text-background" size={24} />}
            />
            <AnimatedIconButton
              className="flex-1 bg-foreground"
              onPress={onFinish}
              icon={<Check className="text-background" size={24} />}
              label="Finish"
            />
            <AnimatedIconButton
              className="flex-none bg-foreground"
              onPress={isPaused ? onResume : onPause}
              icon={
                isPaused ? (
                  <Play className="text-background" size={24} />
                ) : (
                  <Pause className="text-background" size={24} />
                )
              }
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}
