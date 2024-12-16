import { Button } from "~/components/ui/button";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Pressable, View } from "react-native";
import { Workout, WorkoutExercise, Exercise } from "~/lib/types";
import { Text } from "~/components/ui/text";
import { Plus, Trash2 } from "~/lib/icons/Icons";
import React, { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { registerSheet } from "react-native-actions-sheet";
import ExerciseBottomSheetEditor from "~/components/Exercise/ExerciseBottomSheetEditor";
import { ExerciseEditAlternatives } from "../Exercise/ExerciseEditAlternatives";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { WorkoutExerciseItem } from "./WorkoutExerciseItem";

registerSheet("sheet-with-router", ExerciseBottomSheetEditor);

interface WorkoutPageProps {
  workout: Workout;
  onExercisePress?: (exerciseId: number) => void;
  onUpdateWorkout?: (workout: Workout) => void;
  isEditMode: boolean;
  deleteWorkout: (workoutId: number) => void;
}

export function WorkoutPage({
  workout: initialWorkout,
  onExercisePress,
  onUpdateWorkout,
  isEditMode,
  deleteWorkout,
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
      sets: 3,
      reps: 10,
      isMarked: false,
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

  const renderItem = ({ item: workoutExercise, drag, isActive }: RenderItemParams<WorkoutExercise>) => {
    const exercise = exerciseStore.getExerciseById(workoutExercise.exerciseId);
    if (!exercise) return null;

    return (
      <WorkoutExerciseItem
        key={workoutExercise.exerciseId}
        workoutExercise={workoutExercise}
        exercise={exercise}
        isEditMode={isEditMode}
        isActive={isActive}
        deleteExerciseId={deleteExerciseId}
        onPress={() => {
          if (isEditMode) {
            showEditExerciseSheet(workoutExercise);
          } else {
            onExercisePress?.(exercise.id);
          }
        }}
        onLongPress={isEditMode ? drag : undefined}
        onDeleteConfirm={() => {
          deleteExercise(workoutExercise.exerciseId);
          setDeleteExerciseId(null);
        }}
        onDeleteChange={(open) => {
          setDeleteExerciseId(open ? workoutExercise.exerciseId : null);
        }}
        onShowAlternatives={() => setShowAlternatives(workoutExercise)}
        onShowEditSheet={() => showEditExerciseSheet(workoutExercise)}
        onDelete={() => deleteExercise(workoutExercise.exerciseId)}
      />
    );
  };

  return (
    <View className="flex-1">
      {isEditMode && (
        <View className="mb-4 flex-row items-center">
          <Pressable onPress={() => setShowAddExercise(true)} className="flex-1">
            <Card className="shadow-none p-4 flex-row justify-between items-center bg-background">
              <Text className="text-sm font-medium">Übung hinzufügen</Text>
              <Plus size={20} className="text-primary" />
            </Card>
          </Pressable>
        </View>
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
