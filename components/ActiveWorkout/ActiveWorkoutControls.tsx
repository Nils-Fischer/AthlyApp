import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Play, Pause, StopCircle, PlayCircle } from "lucide-react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from "react-native-reanimated";

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
    <Animated.View entering={SlideInDown} exiting={SlideOutDown} className="absolute bottom-0 w-full">
      <BlurView intensity={20} className="overflow-hidden">
        <View className="px-4 py-6 border-t border-border bg-background/80">
          <View className="flex-row justify-center items-center gap-4">
            {!isStarted ? (
              <PrimaryButton onPress={onStart} icon={<PlayCircle size={24} />} label="Start Workout" />
            ) : (
              <>
                <SecondaryButton onPress={onEnd} icon={<StopCircle size={24} />} label="End" />
                <PrimaryButton
                  onPress={isPaused ? onResume : onPause}
                  icon={isPaused ? <Play size={24} /> : <Pause size={24} />}
                  label={isPaused ? "Resume" : "Pause"}
                />
              </>
            )}
          </View>
        </View>
      </BlurView>
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
      className="bg-primary flex-row items-center px-6 py-3 rounded-full active:opacity-90"
    >
      <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-row items-center">
        <View className="mr-2 text-primary-foreground">{icon}</View>
        <Text className="text-base font-medium text-primary-foreground">{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

function SecondaryButton({ onPress, icon, label }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="border border-border bg-background/50 flex-row items-center px-6 py-3 rounded-full active:bg-muted"
    >
      <Animated.View entering={FadeIn} exiting={FadeOut} className="flex-row items-center">
        <View className="mr-2 text-foreground">{icon}</View>
        <Text className="text-base font-medium text-foreground">{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}
