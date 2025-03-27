import React from "react";
import { View } from "react-native";
import { Play, StopCircle, Check, CheckCheck, Timer, TimerOff } from "~/lib/icons/Icons";
import Animated, { SlideInDown, SlideOutDown, Easing } from "react-native-reanimated";
import { AnimatedIconButton } from "~/components/ui/animated-icon-button";

interface ActiveWorkoutControlsProps {
  isStarted: boolean;
  isResting: boolean;
  remainingRestTime: number;
  allExercisesCompleted: boolean;
  onStart: () => void;
  onStartRest: () => void;
  onStopRest: () => void;
  onFinish: () => void;
  onCancel: () => void;
}

export function ActiveWorkoutControls({
  isStarted,
  isResting,
  remainingRestTime,
  allExercisesCompleted,
  onStart,
  onStartRest,
  onStopRest,
  onFinish,
  onCancel,
}: ActiveWorkoutControlsProps) {
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
            haptics="heavy"
            icon={<Play className="text-background" size={24} />}
            label="Workout starten"
          />
        ) : (
          <View className="flex-row items-center gap-4">
            <AnimatedIconButton
              className="flex-none bg-destructive"
              onPress={onCancel}
              haptics="error"
              icon={<StopCircle className="text-background" size={24} />}
            />
            {allExercisesCompleted ? (
              <AnimatedIconButton
                className="flex-1 bg-foreground"
                onPress={onFinish}
                haptics="success"
                icon={<Check className="text-background" size={24} />}
                label="Fertig"
              />
            ) : (
              <AnimatedIconButton
                className="flex-1 bg-foreground"
                onPress={isResting ? onStopRest : onStartRest}
                haptics="medium"
                icon={
                  isResting ? (
                    <TimerOff className="text-background" size={24} />
                  ) : (
                    <Timer className="text-background" size={24} />
                  )
                }
                label={isResting ? `${remainingRestTime}s` : "Pause starten"}
              />
            )}
            <AnimatedIconButton
              className="flex-none bg-foreground"
              onPress={onFinish}
              haptics="rigid"
              icon={<CheckCheck className="text-background" size={24} />}
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
}
