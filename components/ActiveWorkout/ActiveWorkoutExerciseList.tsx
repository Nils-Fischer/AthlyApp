import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { ChevronRight, GripVertical, CheckCircle2, Dumbbell } from "~/lib/icons/Icons";
import Animated, { FadeIn } from "react-native-reanimated";
import type { Workout, WorkoutExercise, Exercise, ExerciseRecord } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { Image } from "expo-image";

interface ActiveWorkoutExerciseListProps {
  workout: Workout;
  isStarted: boolean;
  onPressExercise: (exercise: WorkoutExercise) => void;
}

export function ActiveWorkoutExerciseList({
  workout,
  isStarted,
  onPressExercise: onExerciseSelect,
}: ActiveWorkoutExerciseListProps) {
  const { getExerciseById } = useExerciseStore();
  const { activeSession: currentSession } = useActiveWorkoutStore();

  // Sort exercises by completion status
  const sortedExercises = React.useMemo(() => {
    return [...workout.exercises].sort((a, b) => {
      const aCompleted =
        currentSession?.entries.find((entry) => entry.exerciseId === a.exerciseId)?.isCompleted || false;
      const bCompleted =
        currentSession?.entries.find((entry) => entry.exerciseId === b.exerciseId)?.isCompleted || false;

      // Sort completed exercises to the bottom
      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [workout.exercises, currentSession?.entries]);

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <View className="py-2">
        {sortedExercises.map((workoutExercise, index) => {
          const exercise = getExerciseById(workoutExercise.exerciseId);
          const exerciseRecord = currentSession?.entries.find(
            (entry) => entry.exerciseId === workoutExercise.exerciseId
          );
          if (!exercise) return null;

          return (
            <ExerciseCard
              key={`${workoutExercise.exerciseId}-${index}`}
              exercise={exercise}
              workoutExercise={workoutExercise}
              exerciseRecord={exerciseRecord}
              isStarted={isStarted}
              onSelect={() => onExerciseSelect(workoutExercise)}
            />
          );
        })}
      </View>
      <View className="h-32" />
    </ScrollView>
  );
}

interface ExerciseCardProps {
  exercise: Exercise;
  workoutExercise: WorkoutExercise;
  exerciseRecord?: ExerciseRecord;
  isStarted: boolean;
  onSelect: () => void;
}

function ExerciseCard({ exercise, workoutExercise, exerciseRecord, isStarted, onSelect }: ExerciseCardProps) {
  const completedSets = exerciseRecord?.sets.filter((set) => set.reps !== null && set.weight !== null).length || 0;
  const isCompleted = exerciseRecord?.isCompleted || false;

  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity onPress={onSelect} className="active:opacity-90">
        <View className={`bg-card border-b border-border/30 ${isCompleted ? "opacity-50" : ""}`}>
          <View className="flex-row p-4">
            <View className="mr-4">
              {exercise.images[0] ? (
                <Image
                  source={{ uri: exercise.images[0] }}
                  className={`w-16 h-16 rounded-lg bg-muted ${isCompleted ? "opacity-50" : ""}`}
                  contentFit="cover"
                  transition={200}
                  placeholder="L5H2EC=PM+yV0g-mq.wG9c010J}I"
                  contentPosition="center"
                  cachePolicy="memory"
                />
              ) : (
                <View
                  className={`w-16 h-16 rounded-lg bg-muted items-center justify-center ${
                    isCompleted ? "opacity-50" : ""
                  }`}
                >
                  <Dumbbell size={24} className="text-muted-foreground" />
                </View>
              )}
            </View>

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className={`text-base font-medium ${isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                  {exercise.name}
                </Text>
                {isStarted && (
                  <ProgressIndicator total={workoutExercise.sets} completed={completedSets} isCompleted={isCompleted} />
                )}
              </View>

              <View className="flex-row mt-1 items-center">
                <Text className="text-sm text-muted-foreground">
                  {workoutExercise.sets} {workoutExercise.sets > 1 ? "Sätze" : "Satz"} × {workoutExercise.reps}{" "}
                  {workoutExercise.reps > 1 ? "Wiederholungen" : "Wiederholung"}
                </Text>
              </View>
            </View>

            <View className="justify-center">
              <ChevronRight size={20} className={`text-muted-foreground ml-2 ${isCompleted ? "opacity-50" : ""}`} />
            </View>
          </View>
          <View className="h-[1px] bg-border/10" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ProgressIndicatorProps {
  total: number;
  completed: number;
  isCompleted: boolean;
}

function ProgressIndicator({ total, completed, isCompleted }: ProgressIndicatorProps) {
  return (
    <View className="flex-row items-center">
      <Text className="text-sm font-medium text-primary mr-2">
        {completed}/{total}
      </Text>
      {isCompleted && <CheckCircle2 size={16} className="text-primary" />}
    </View>
  );
}
