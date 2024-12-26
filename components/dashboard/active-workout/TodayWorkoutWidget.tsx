import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { Dumbbell, Clock, Play, ChevronRight, Flame, SkipForward } from "~/lib/icons/Icons";
import { Workout } from "~/lib/types";
import { useRouter } from "expo-router";
import { useExerciseStore } from "~/stores/exerciseStore";
import * as Haptics from "expo-haptics";

interface TodayWorkoutWidgetProps {
  workout: Workout;
  skipWorkout: () => void;
}

export const TodayWorkoutWidget = ({ workout, skipWorkout }: TodayWorkoutWidgetProps) => {
  const router = useRouter();
  const exerciseStore = useExerciseStore();
  const estimatedCalories = workout.exercises.length * 50;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/(tabs)/(dashboard)/active-workout/[id]",
      params: { id: workout.id },
    });
  };

  const startWorkout = () => {
    router.push({
      pathname: "/(tabs)/(dashboard)/active-workout/[id]",
      params: { id: workout.id, start: "true" },
    });
  };

  const handleSkip = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipWorkout();
  };

  return (
    <Card className="overflow-hidden border border-border mb-4">
      {/* Header Section */}
      <View className="px-4 pt-4 pb-3 border-b border-border/10">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center space-x-2">
            <Text className="font-medium text-base">Heutiges Training</Text>
          </View>
          <View className="flex-row items-center">
            <View className="bg-primary/10 px-3 py-1 rounded-full mr-2">
              <Text className="text-xs text-primary font-medium">Geplant</Text>
            </View>
            <ChevronRight size={20} className="text-primary" />
          </View>
        </View>
      </View>

      {/* Content Section */}
      <Pressable onPress={handlePress} className="px-4 pt-4 pb-5">
        <Text className="text-2xl font-bold mb-1">{workout.name}</Text>
        {workout.description && <Text className="text-base text-muted-foreground mb-4">{workout.description}</Text>}

        {/* Quick Stats */}
        <View className="flex-row items-center mb-6">
          <View className="flex-row items-center mr-4">
            <Clock size={16} className="text-primary mr-2" />
            <Text className="text-sm">{workout.duration || 60} Min</Text>
          </View>
          <View className="flex-row items-center mr-4">
            <Flame size={16} className="text-primary mr-2" />
            <Text className="text-sm">{estimatedCalories} kcal</Text>
          </View>
          <View className="flex-row items-center">
            <Dumbbell size={16} className="text-primary mr-2" />
            <Text className="text-sm">{workout.exercises.length} Übungen</Text>
          </View>
        </View>

        {/* Exercise Preview */}
        <View className="space-y-3">
          {workout.exercises.slice(0, 3).map((workoutExercise, index) => {
            const exercise = exerciseStore.getExerciseById(workoutExercise.exerciseId);
            if (!exercise) return null;

            return (
              <View
                key={workoutExercise.exerciseId}
                className="flex-row items-center border-l-2 border-primary/20 pl-3"
              >
                <View className="flex-1">
                  <Text className="font-medium text-foreground">{exercise.name}</Text>
                  <Text className="text-sm text-muted-foreground">
                    {workoutExercise.sets} Sätze • {workoutExercise.reps} Wdh
                  </Text>
                </View>
                <View className="h-8 w-8 rounded-full border border-primary/20 items-center justify-center">
                  <Text className="text-xs text-primary font-medium">{index + 1}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {workout.exercises.length > 3 && (
          <Pressable onPress={handlePress} className="mt-4 flex-row items-center justify-center">
            <Text className="text-primary font-medium mr-1">Alle Übungen anzeigen</Text>
            <ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}

        {/* Action Buttons */}
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={handleSkip}
            className="flex-1 py-3 rounded-full border border-border flex-row items-center justify-center"
          >
            <SkipForward size={18} className="text-foreground mr-2" />
            <Text className="font-medium">Überspringen</Text>
          </Pressable>

          <Pressable
            onPress={startWorkout}
            className="flex-1 bg-primary py-3 rounded-full flex-row items-center justify-center"
          >
            <Play size={18} className="text-primary-foreground mr-2" />
            <Text className="text-primary-foreground font-medium">Starten</Text>
          </Pressable>
        </View>
      </Pressable>
    </Card>
  );
};
