import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Card } from "~/components/ui/card";
import { ChevronRight, GripVertical, CheckCircle2 } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import type { Workout, WorkoutExercise, Exercise, ExerciseRecord } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";

interface ActiveWorkoutExerciseListProps {
  workout: Workout;
  isEditMode: boolean;
  isStarted: boolean;
  onPressExercise: (exercise: WorkoutExercise) => void;
}

export function ActiveWorkoutExerciseList({
  workout,
  isEditMode,
  isStarted,
  onPressExercise: onExerciseSelect,
}: ActiveWorkoutExerciseListProps) {
  const { getExerciseById } = useExerciseStore();
  const { getExerciseRecord } = useActiveWorkoutStore();

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <View className="py-2 space-y-3">
        {workout.exercises.map((workoutExercise, index) => {
          const exercise = getExerciseById(workoutExercise.exerciseId);
          const exerciseRecord = getExerciseRecord(workoutExercise.exerciseId);
          if (!exercise) return null;

          return (
            <ExerciseCard
              key={`${workoutExercise.exerciseId}-${index}`}
              exercise={exercise}
              workoutExercise={workoutExercise}
              exerciseRecord={exerciseRecord || undefined}
              isEditMode={isEditMode}
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
  isEditMode: boolean;
  isStarted: boolean;
  onSelect: () => void;
}

function ExerciseCard({
  exercise,
  workoutExercise,
  exerciseRecord,
  isEditMode,
  isStarted,
  onSelect,
}: ExerciseCardProps) {
  const completedSets = exerciseRecord?.sets.length || 0;
  const progress = completedSets / workoutExercise.sets;

  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity onPress={onSelect} disabled={isEditMode} className="active:opacity-90">
        <Card className="border-border bg-card">
          <View className="flex-row items-center p-4">
            {isEditMode && (
              <View className="mr-3">
                <GripVertical size={20} className="text-muted-foreground" />
              </View>
            )}

            <View className="flex-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-medium text-foreground">{exercise.name}</Text>
                {isStarted && (
                  <ProgressIndicator
                    progress={progress}
                    total={workoutExercise.sets}
                    completed={completedSets}
                    isCompleted={exerciseRecord?.isCompleted || false}
                  />
                )}
              </View>

              <View className="flex-row mt-1 items-center">
                <Text className="text-sm text-muted-foreground">
                  {workoutExercise.sets} sets × {workoutExercise.reps} reps
                </Text>
                {workoutExercise.restPeriod && (
                  <Text className="text-sm text-muted-foreground ml-2">• {workoutExercise.restPeriod}s rest</Text>
                )}
              </View>

              {workoutExercise.notes && (
                <Text className="text-sm text-muted-foreground mt-1 italic">{workoutExercise.notes}</Text>
              )}
            </View>

            {!isEditMode && <ChevronRight size={20} className="text-muted-foreground ml-2" />}
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ProgressIndicatorProps {
  progress: number;
  total: number;
  completed: number;
  isCompleted: boolean;
}

function ProgressIndicator({ progress, total, completed, isCompleted }: ProgressIndicatorProps) {
  return (
    <View className="flex-row items-center">
      <Text className="text-sm font-medium text-primary mr-2">
        {completed}/{total}
      </Text>
      {isCompleted && <CheckCircle2 size={16} className="text-primary" />}
    </View>
  );
}
