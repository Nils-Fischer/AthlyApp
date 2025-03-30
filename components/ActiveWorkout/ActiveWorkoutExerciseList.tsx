import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  ChevronRight,
  CheckCircle2,
  Dumbbell,
  MoreHorizontal,
  Trash2,
  Edit3,
  Repeat,
  GripVertical,
} from "~/lib/icons/Icons";
import Animated, { FadeIn } from "react-native-reanimated";
import type { Workout, WorkoutExercise, Exercise, ExerciseRecord } from "~/lib/types";
import { Image } from "expo-image";
import { getRepsRange, getThumbnail } from "~/lib/utils";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import * as Haptics from "expo-haptics";
import { Card } from "../ui/card";

interface ActiveWorkoutExerciseListProps {
  workout: Workout;
  exerciseRecords: Map<number, ExerciseRecord>;
  exercises: Exercise[];
  isStarted: boolean;
  onPressExercise: (exercise: WorkoutExercise) => void;
  onShowAlternatives: (exercise: WorkoutExercise) => void;
  onShowEditSheet: (exercise: WorkoutExercise) => void;
  onDelete: (exercise: WorkoutExercise) => void;
  onExercisesReorder?: (exercises: WorkoutExercise[]) => void;
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
  onExercisesReorder,
}: ActiveWorkoutExerciseListProps) {
  // Keep track of the user-ordered exercises with local state
  const [orderedExercises, setOrderedExercises] = React.useState<WorkoutExercise[]>([]);

  // When the workout changes, update our ordered exercises
  React.useEffect(() => {
    setOrderedExercises(workout.exercises);
  }, [workout]);

  // Only sort when workout is started, otherwise use the user's order
  const displayExercises = React.useMemo(() => {
    if (isStarted) {
      // Use the sorted list when the workout is started
      return [...workout.exercises].sort((a, b) => {
        const aCompleted = exerciseRecords.get(a.exerciseId)?.isCompleted || false;
        const bCompleted = exerciseRecords.get(b.exerciseId)?.isCompleted || false;

        if (aCompleted === bCompleted) return 0;
        return aCompleted ? 1 : -1;
      });
    } else {
      // Use the ordered list when in edit mode
      return orderedExercises;
    }
  }, [isStarted, workout.exercises, exerciseRecords, orderedExercises]);

  const handleDragStart = React.useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleDragEnd = ({ data }: { data: WorkoutExercise[] }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Update our local state
    setOrderedExercises(data);

    // Wait for animation to complete before notifying parent
    requestAnimationFrame(() => {
      if (onExercisesReorder) {
        onExercisesReorder(data);
      }
    });
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<WorkoutExercise>) => {
    const exercise = exercises.find((e) => e.id === item.exerciseId);
    const exerciseRecord = exerciseRecords.get(item.exerciseId);

    if (!exercise) return <View />;

    return (
      <ExerciseCard
        exercise={exercise}
        workoutExercise={item}
        exerciseRecord={exerciseRecord}
        isStarted={isStarted}
        onSelect={() => onExerciseSelect(item)}
        onShowAlternatives={() => onShowAlternatives(item)}
        onShowEditSheet={() => onShowEditSheet(item)}
        onDelete={() => onDelete(item)}
        drag={drag}
        isActive={isActive}
        isDraggable={!isStarted} // Only allow dragging when workout hasn't started
      />
    );
  };

  return (
    <DraggableFlatList
      data={displayExercises}
      onDragEnd={handleDragEnd}
      onDragBegin={handleDragStart}
      keyExtractor={(item) => item.exerciseId.toString()}
      renderItem={renderItem}
      containerStyle={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, paddingBottom: 128, gap: 8 }}
      dragHitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
      animationConfig={{ duration: 200 }}
    />
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
  drag?: () => void;
  isActive?: boolean;
  isDraggable?: boolean;
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
  drag,
  isActive,
  isDraggable,
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

  const handleLongPress = () => {
    if (isDraggable && drag) {
      // The drag start haptic will be triggered by the DraggableFlatList's onDragBegin
      drag();
    }
  };

  const handlePress = () => {
    // Only trigger selection if not in drag mode
    if (!isActive) {
      onSelect();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={isDraggable ? handleLongPress : undefined}
      delayLongPress={150}
      className="active:opacity-90"
    >
      <Card className={isCompleted ? "opacity-50" : ""}>
        <View className="flex-row px-4 py-2 items-center">
          {isDraggable && (
            <View className="mr-2 items-center justify-center">
              <GripVertical size={20} className="text-muted-foreground" />
            </View>
          )}
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
              {isStarted && <ProgressIndicator total={totalSets} completed={completedSets} isCompleted={isCompleted} />}
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
                  <Button variant="ghost" size="icon" className="h-8 w-8" haptics="light">
                    <MoreHorizontal size={20} className="text-muted-foreground ml-2" />
                  </Button>
                }
              />
            )}
          </View>
        </View>
        <View className="h-[1px] bg-border/10" />
      </Card>
    </TouchableOpacity>
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
