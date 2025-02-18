import React, { useMemo } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ChevronRight, CheckCircle2, Dumbbell, MoreHorizontal, Trash2, Edit3, Repeat } from "~/lib/icons/Icons";
import Animated, { FadeIn } from "react-native-reanimated";
import type { Workout, WorkoutExercise, Exercise, ExerciseRecord } from "~/lib/types";
import { Image } from "expo-image";
import { getRepsRange, getThumbnail } from "~/lib/utils";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";

interface ActiveWorkoutExerciseListProps {
  workout: Workout;
  exerciseRecords: Map<number, ExerciseRecord>;
  exercises: Exercise[];
  isStarted: boolean;
  onPressExercise: (exercise: WorkoutExercise) => void;
  onShowAlternatives: (exercise: WorkoutExercise) => void;
  onShowEditSheet: (exercise: WorkoutExercise) => void;
  onDelete: (exercise: WorkoutExercise) => void;
}

export function ActiveWorkoutExerciseList({
  workout,
  exerciseRecords,
  exercises,
  isStarted,
  onPressExercise: onExerciseSelect,
  onShowAlternatives,
  onShowEditSheet,
  onDelete,
}: ActiveWorkoutExerciseListProps) {
  const sortedExercises = React.useMemo(() => {
    return [...workout.exercises].sort((a, b) => {
      const aCompleted = exerciseRecords.get(a.exerciseId)?.isCompleted || false;
      const bCompleted = exerciseRecords.get(b.exerciseId)?.isCompleted || false;

      if (aCompleted === bCompleted) return 0;
      return aCompleted ? 1 : -1;
    });
  }, [workout.exercises, exerciseRecords]);

  return (
    <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
      <View className="py-2">
        {sortedExercises.map((workoutExercise, index) => {
          const exercise = exercises.find((e) => e.id === workoutExercise.exerciseId);
          const exerciseRecord = exerciseRecords.get(workoutExercise.exerciseId);

          if (!exercise) return <View key={`${workoutExercise.exerciseId}-${index}`} />;

          return (
            <ExerciseCard
              key={`${workoutExercise.exerciseId}-${index}`}
              exercise={exercise}
              workoutExercise={workoutExercise}
              exerciseRecord={exerciseRecord}
              isStarted={isStarted}
              onSelect={() => onExerciseSelect(workoutExercise)}
              onShowAlternatives={() => onShowAlternatives(workoutExercise)}
              onShowEditSheet={() => onShowEditSheet(workoutExercise)}
              onDelete={() => onDelete(workoutExercise)}
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
  onShowAlternatives: () => void;
  onShowEditSheet: () => void;
  onDelete: () => void;
}

function ExerciseCard({
  exercise,
  workoutExercise,
  exerciseRecord,
  isStarted,
  onSelect,
  onShowAlternatives,
  onShowEditSheet,
  onDelete,
}: ExerciseCardProps) {
  const totalSets = useMemo(() => {
    return exerciseRecord?.sets.length || workoutExercise.sets.length;
  }, [exerciseRecord, workoutExercise]);
  const completedSets = useMemo(
    () => exerciseRecord?.sets.filter((set) => set.reps !== null && set.weight !== null).length || 0,
    [exerciseRecord]
  );
  const isCompleted = useMemo(() => exerciseRecord?.isCompleted || false, [exerciseRecord]);
  const imageUrl = getThumbnail(exercise);
  const repsRange = useMemo(() => getRepsRange(workoutExercise), [workoutExercise]);

  const dropdownItems = [
    {
      name: "Alternative Übung",
      icon: Repeat,
      onPress: onShowAlternatives,
    },
    {
      name: "Details bearbeiten",
      icon: Edit3,
      onPress: onShowEditSheet,
    },
    {
      name: "Übung löschen",
      icon: Trash2,
      onPress: onDelete,
      destructive: true,
    },
  ];

  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity onPress={onSelect} className="active:opacity-90">
        <View className={`bg-card border-b border-border/30 ${isCompleted ? "opacity-50" : ""}`}>
          <View className="flex-row p-4">
            <View className="mr-4">
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
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
                  <ProgressIndicator total={totalSets} completed={completedSets} isCompleted={isCompleted} />
                )}
              </View>

              <View className="flex-row mt-1 items-center">
                <Text className="text-sm text-muted-foreground">
                  {totalSets} {totalSets > 1 ? "Sätze" : "Satz"} × {repsRange}
                </Text>
              </View>
            </View>

            <View className="justify-center">
              {isStarted ? (
                <ChevronRight size={20} className={`text-muted-foreground ml-2 ${isCompleted ? "opacity-50" : ""}`} />
              ) : (
                <CustomDropdownMenu
                  items={dropdownItems}
                  side="top"
                  align="start"
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal size={20} className="text-muted-foreground ml-2" />
                    </Button>
                  }
                />
              )}
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
