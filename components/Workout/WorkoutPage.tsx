import { useExerciseStore } from "~/stores/exerciseStore";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Workout, WorkoutExercise } from "~/lib/types";
import { Edit3, MoreHorizontal, Plus, Repeat, Trash2, X } from "~/lib/icons/Icons";
import React, { useState, useEffect } from "react";
import { Card, CardTitle } from "~/components/ui/card";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { registerSheet } from "react-native-actions-sheet";
import ExerciseBottomSheetEditor from "~/components/Exercise/ExerciseBottomSheetEditor";
import { ExerciseEditAlternatives } from "../Exercise/ExerciseEditAlternatives";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Button } from "../ui/button";
import { DeleteConfirmation } from "../DeleteConfirmation";
import { CustomDropdownMenu } from "../ui/custom-dropdown-menu";
import { ExerciseOverviewCard } from "../Exercise/ExerciseOverviewCard";

registerSheet("sheet-with-router", ExerciseBottomSheetEditor);

interface WorkoutPageProps {
  workout: Workout;
  onExercisePress?: (exerciseId: number) => void;
  isEditMode: boolean;
  onUpdateWorkout?: (workout: Workout) => void;
}

export function WorkoutPage({
  workout: initialWorkout,
  onExercisePress,
  onUpdateWorkout,
  isEditMode,
}: WorkoutPageProps) {
  const exerciseStore = useExerciseStore();
  const [workout, setWorkout] = useState(initialWorkout);
  const [deleteExerciseId, setDeleteExerciseId] = useState<number | null>(null);
  const [showAlternatives, setShowAlternatives] = useState<WorkoutExercise | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  useEffect(() => {
    setWorkout(initialWorkout);
  }, [initialWorkout]);

  const deleteExercise = (exerciseId: number) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter((ex) => ex.exerciseId !== exerciseId),
    };
    setWorkout(updatedWorkout);
    onUpdateWorkout?.(updatedWorkout);
  };

  const updateWorkoutExercise = (oldExercises: WorkoutExercise, updatedExercise: WorkoutExercise) => {
    const exerciseIndex = workout.exercises.findIndex((ex) => ex.exerciseId === oldExercises.exerciseId);
    if (exerciseIndex === -1) return;

    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex] = { ...newExercises[exerciseIndex], ...updatedExercise };
    const updatedWorkout = { ...workout, exercises: newExercises };

    setWorkout(updatedWorkout);
    onUpdateWorkout?.(updatedWorkout);
  };

  const addExercise = (exerciseId: number) => {
    const newExercise: WorkoutExercise = {
      exerciseId,
      alternatives: [],
      sets: Array(3).fill({ reps: 10 }),
    };

    if (workout.exercises.map((exercise) => exercise.exerciseId).includes(exerciseId)) return;

    const updatedWorkout = {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    };

    setWorkout(updatedWorkout);
    onUpdateWorkout?.(updatedWorkout);
    setShowAddExercise(false);
  };

  const showEditExerciseSheet: (workoutExercise: WorkoutExercise) => void = async (
    workoutExercise: WorkoutExercise
  ) => {
    const result = await SheetManager.show("sheet-with-router", {
      payload: {
        exercise: exerciseStore.getExerciseById(workoutExercise.exerciseId)!,
        workoutExercise: workoutExercise,
        initalRoute: "main-edit-route",
      },
    });
    if (result) {
      updateWorkoutExercise(workoutExercise, result);
    }
  };

  const onDragEnd = ({ data }: { data: WorkoutExercise[] }) => {
    const updatedWorkout = {
      ...workout,
      exercises: data,
    };

    setWorkout(updatedWorkout);

    requestAnimationFrame(() => {
      onUpdateWorkout?.(updatedWorkout);
    });
  };

  const renderItem = ({ item: workoutExercise, drag }: RenderItemParams<WorkoutExercise>) => {
    const exercise = exerciseStore.getExerciseById(workoutExercise.exerciseId);
    if (!exercise) return null;
    const dropdownItems = [
      {
        name: "Alternative Übung",
        icon: Repeat,
        onPress: () => setShowAlternatives(workoutExercise),
      },
      {
        name: "Details bearbeiten",
        icon: Edit3,
        onPress: () => showEditExerciseSheet(workoutExercise),
      },
      {
        name: "Übung löschen",
        icon: Trash2,
        onPress: () => deleteExercise(workoutExercise.exerciseId),
        destructive: true,
      },
    ];

    const rightAccessory = isEditMode ? (
      <DeleteConfirmation
        open={deleteExerciseId === workoutExercise.exerciseId}
        onOpenChange={(open: boolean) => {
          setDeleteExerciseId(open ? workoutExercise.exerciseId : null);
        }}
        onConfirm={() => {
          deleteExercise(workoutExercise.exerciseId);
          setDeleteExerciseId(null);
        }}
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8" haptics="light">
            <X size={18} className="text-destructive" />
          </Button>
        }
        title="Übung löschen?"
        description="Möchtest du diese Übung wirklich aus dem Workout entfernen?"
      />
    ) : (
      <CustomDropdownMenu
        items={dropdownItems}
        side="top"
        align="start"
        trigger={
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="text-muted-foreground" />
          </Button>
        }
      />
    );
    const onPress = () => {
      if (isEditMode) {
        showEditExerciseSheet(workoutExercise);
      } else {
        onExercisePress?.(exercise.id);
      }
    };

    return (
      <TouchableOpacity onPress={onPress} onLongPress={isEditMode ? drag : undefined}>
        <ExerciseOverviewCard
          exercise={exercise}
          workoutExercise={workoutExercise}
          onPress={onPress}
          rightAccessory={rightAccessory}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 px-4">
      {isEditMode && (
        <Pressable onPress={() => setShowAddExercise(true)}>
          <Card className="p-4 mb-2 flex-row justify-between items-center">
            <CardTitle className="text-sm font-medium">Übung hinzufügen</CardTitle>
            <Plus size={20} className="text-primary" />
          </Card>
        </Pressable>
      )}

      <DraggableFlatList
        data={workout.exercises}
        onDragEnd={onDragEnd}
        keyExtractor={(item) => item.exerciseId.toString()}
        renderItem={renderItem}
        containerStyle={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        dragHitSlop={{ top: 0, bottom: 0, left: 0, right: 0 }}
        animationConfig={{ duration: 200 }}
      />

      <BottomSheet title="Übung hinzufügen" isOpen={showAddExercise} onClose={() => setShowAddExercise(false)}>
        <ExerciseLibrary
          onPress={(exerciseId) => {
            addExercise(exerciseId);
          }}
        />
      </BottomSheet>

      <BottomSheet
        title="Alternative Übung Auswahl"
        isOpen={showAlternatives !== null}
        onClose={() => setShowAlternatives(null)}
      >
        {showAlternatives && (
          <ExerciseEditAlternatives
            workoutExercise={showAlternatives}
            onSelection={(updatedWorkoutExercise) => {
              updateWorkoutExercise(showAlternatives, updatedWorkoutExercise);
              setShowAlternatives(null);
            }}
            withConfirmation={false}
          />
        )}
      </BottomSheet>
    </View>
  );
}
