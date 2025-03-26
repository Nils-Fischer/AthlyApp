import React from "react";
import { View } from "react-native";
import { Play, StopCircle, Check, CheckCheck, Timer, TimerOff } from "~/lib/icons/Icons";
import Animated, { SlideInDown, SlideOutDown, Easing, FadeIn } from "react-native-reanimated";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { fitnessLightColors } from "~/lib/theme/lightColors";

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
      className="absolute bottom-5 left-0 right-0 px-4 z-50"
    >
      <View className="flex-row justify-center items-center w-full">
        {!isStarted ? (
          // Workout starten Button (vor dem Training)
          <Animated.View 
            entering={FadeIn.delay(400).duration(400)}
            style={{ width: '85%' }}
          >
            <Button 
              className="rounded-full py-3" 
              onPress={onStart}
              haptics="heavy"
              style={{ 
                backgroundColor: fitnessLightColors.primary.default,
                shadowColor: 'rgba(0,0,0,0.15)',
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 6,
                elevation: 3
              }}
            >
              <View className="flex-row items-center justify-center">
                <Play color="#fff" className="mr-2" size={18} />
                <Text className="font-medium text-base" style={{ color: "#fff" }}>
                  Workout starten
                </Text>
              </View>
            </Button>
          </Animated.View>
        ) : (
          // Active Workout Controls (während des Trainings)
          <View className="flex-row items-center justify-between w-full gap-3">
            {/* Abbrechen Button */}
            <Button 
              className="w-11 h-11 rounded-full flex-none"
              onPress={onCancel}
              haptics="error"
              style={{ 
                backgroundColor: 'rgba(255, 61, 0, 0.9)',
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 3,
                elevation: 2
              }}
            >
              <StopCircle color="#fff" size={22} />
            </Button>

            {/* Mittlerer Button (Pause oder Fertig) */}
            {allExercisesCompleted ? (
              <Button
                className="flex-1 h-11 rounded-full"
                onPress={onFinish}
                haptics="success"
                style={{ 
                  backgroundColor: 'rgba(0, 200, 83, 0.9)',
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 3,
                  elevation: 2
                }}
              >
                <View className="flex-row items-center justify-center">
                  <Check color="#fff" className="mr-1.5" size={18} />
                  <Text className="font-medium" style={{ color: "#fff" }}>
                    Fertig
                  </Text>
                </View>
              </Button>
            ) : (
              <Button
                className="flex-1 h-11 rounded-full"
                onPress={isResting ? onStopRest : onStartRest}
                haptics="medium"
                style={{ 
                  backgroundColor: 'rgba(0, 136, 255, 0.9)',
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 3,
                  elevation: 2
                }}
              >
                <View className="flex-row items-center justify-center">
                  {isResting ? (
                    <>
                      <TimerOff color="#fff" className="mr-1.5" size={18} />
                      <Text className="font-medium" style={{ color: "#fff" }}>
                        {remainingRestTime}s
                      </Text>
                    </>
                  ) : (
                    <>
                      <Timer color="#fff" className="mr-1.5" size={18} />
                      <Text className="font-medium" style={{ color: "#fff" }}>
                        Pause starten
                      </Text>
                    </>
                  )}
                </View>
              </Button>
            )}

            {/* Workout beenden Button */}
            <Button
              className="w-11 h-11 rounded-full flex-none"
              onPress={onFinish}
              haptics="rigid"
              style={{ 
                backgroundColor: 'rgba(0, 200, 83, 0.9)',
                shadowColor: 'rgba(0,0,0,0.1)',
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 3,
                elevation: 2
              }}
            >
              <CheckCheck color="#fff" size={22} />
            </Button>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export default ActiveWorkoutControls;