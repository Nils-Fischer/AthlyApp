import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Play, Pause, StopCircle } from "~/lib/icons/Icons";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, Easing } from "react-native-reanimated";

interface ActiveWorkoutControlsProps {
  isEditMode: boolean;
  isStarted: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onEnd: () => void;
}

export function ActiveWorkoutControls({
  isEditMode,
  isStarted,
  isPaused,
  onStart,
  onPause,
  onResume,
  onEnd,
}: ActiveWorkoutControlsProps) {
  if (isEditMode) return null;

  return (
    <Animated.View
      entering={SlideInDown.springify().damping(15).mass(0.9).stiffness(100)}
      exiting={SlideOutDown.duration(150).easing(Easing.ease)}
      className="absolute bottom-0 w-full px-4 py-10"
    >
      <View className="flex-row justify-center items-center gap-4">
        {!isStarted ? (
          <PrimaryButton
            onPress={onStart}
            icon={<Play className="text-background" size={24} />}
            label="Start Workout"
          />
        ) : (
          <>
            <SecondaryButton onPress={onEnd} icon={<StopCircle className="text-background" size={24} />} label="End" />
            <PrimaryButton
              onPress={isPaused ? onResume : onPause}
              icon={
                isPaused ? (
                  <Play className="text-background" size={24} />
                ) : (
                  <Pause className="text-background" size={24} />
                )
              }
              label={isPaused ? "Resume" : "Pause"}
            />
          </>
        )}
      </View>
    </Animated.View>
  );
}

interface ButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  label: string;
}

function PrimaryButton({ onPress, icon, label }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-foreground flex-row items-center px-6 py-3 rounded-full active:opacity-90"
    >
      <Animated.View
        entering={FadeIn.duration(150).springify().damping(12)}
        exiting={FadeOut.duration(100).easing(Easing.ease)}
        className="flex-row items-center gap-2"
      >
        <View className="text-background">{icon}</View>
        <Text className="text-base font-medium text-background">{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function SecondaryButton({ onPress, icon, label }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-destructive flex-row items-center px-6 py-3 rounded-full active:opacity-90"
    >
      <Animated.View
        entering={FadeIn.duration(150).springify().damping(12)}
        exiting={FadeOut.duration(100).easing(Easing.ease)}
        className="flex-row items-center gap-2"
      >
        <View className="text-background">{icon}</View>
        <Text className="text-base font-medium text-background">{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
