import { useExerciseStore } from "~/stores/exerciseStore";
import { Pressable, TouchableOpacity, View } from "react-native";
import { Workout, WorkoutExercise } from "~/lib/types";
import { Edit3, GripVertical, MoreHorizontal, Plus, Repeat, Trash2, X } from "~/lib/icons/Icons";
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
  onAddExercise: (exercise: WorkoutExercise) => void;
  onDeleteExercise: (exerciseId: number) => void;
  onUpdateExercise: (exerciseId: number, updatedExercise: WorkoutExercise) => void;
  onUpdateWorkout: (updatedWorkout: Workout) => void;
}

export function WorkoutOverview({
  workout: initialWorkout,
  onExercisePress,
  onAddExercise,
  onDeleteExercise,
  onUpdateExercise,
  isEditMode,
  onUpdateWorkout,
}: WorkoutPageProps) {
  const exerciseStore = useExerciseStore();
  const [workout, setWorkout] = useState(initialWorkout);
  const [deleteExerciseId, setDeleteExerciseId] = useState<number | null>(null);
  const [showAlternatives, setShowAlternatives] = useState<WorkoutExercise | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  useEffect(() => {
    setWorkout(initialWorkout);
  }, [initialWorkout]);

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
      onUpdateExercise(workoutExercise.exerciseId, result);
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
        onPress: () => onDeleteExercise(workoutExercise.exerciseId),
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
          onDeleteExercise(workoutExercise.exerciseId);
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
          onLongPress={isEditMode ? drag : undefined}
          rightAccessory={rightAccessory}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1">
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
          onPress={(exercise) => {
            onAddExercise({
              exerciseId: exercise.id,
              alternatives: [],
              sets: [
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 },
                { reps: 10, weight: 0 },
              ],
            });
            setShowAddExercise(false);
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
              onUpdateExercise(showAlternatives.exerciseId, updatedWorkoutExercise);
              setShowAlternatives(null);
            }}
            withConfirmation={false}
          />
        )}
      </BottomSheet>
    </View>
  );
}
