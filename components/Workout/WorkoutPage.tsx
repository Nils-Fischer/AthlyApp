import { Button } from "~/components/ui/button";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Image, Pressable, View } from "react-native";
import { Workout, WorkoutExercise, Exercise } from "~/lib/types";
import { Text } from "~/components/ui/text";
import { MoreHorizontal, Pencil, Plus, Trash2, X, AlertOctagon, Edit3, Repeat } from "~/lib/icons/Icons";
import React, { useState, useEffect } from "react";
import { Card } from "~/components/ui/card";
import { ExerciseLibrary } from "~/components/Exercise/ExerciseLibrary";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { SheetManager } from "react-native-actions-sheet";
import { registerSheet } from "react-native-actions-sheet";
import ExerciseBottomSheetEditor from "~/components/Exercise/ExerciseBottomSheetEditor";
import { ExerciseDeleteConfirmation } from "../Exercise/ExerciseDeleteConfirmation";
import { ExerciseEditAlternatives } from "../Exercise/ExerciseEditAlternatives";

registerSheet("sheet-with-router", ExerciseBottomSheetEditor);

const getFullExercise = (workoutExercise: WorkoutExercise, exercises: Exercise[]) => {
  return exercises.find((ex) => ex.id === workoutExercise.exerciseId);
};

const getRepsRange = (exercise: WorkoutExercise) => {
  if (exercise.reps === 10) return "10 Wdh.";
  if (Array.isArray(exercise.reps)) return `${exercise.reps[0]}-${exercise.reps[1]} Wdh.`;
  return `${exercise.reps} Wdh.`;
};

interface WorkoutPageProps {
  workout: Workout;
  routineName: string;
  onExercisePress?: (exerciseId: number) => void;
  onUpdateWorkout?: (workout: Workout) => void;
}

export function WorkoutPage({
  workout: initialWorkout,
  routineName,
  onExercisePress,
  onUpdateWorkout,
}: WorkoutPageProps) {
  const exerciseStore = useExerciseStore();
  const [workout, setWorkout] = useState(initialWorkout);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteExerciseId, setDeleteExerciseId] = useState<number | null>(null);
  const [menuExerciseId, setMenuExerciseId] = useState<number | null>(null);
  const [showAlternatives, setShowAlternatives] = useState<WorkoutExercise | null>(null);
  const [showAddExercise, setShowAddExercise] = useState(false);

  useEffect(() => {
    setWorkout(initialWorkout);
  }, [initialWorkout]);

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const deleteExercise = (exerciseId: number) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter((ex) => ex.exerciseId !== exerciseId),
    };
    setWorkout(updatedWorkout);
    onUpdateWorkout?.(updatedWorkout);
  };

  const updateExercise = (updatedExercise: WorkoutExercise) => {
    const exerciseIndex = workout.exercises.findIndex((ex) => ex.exerciseId === updatedExercise.exerciseId);
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
      weight: 0,
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

  const ExerciseOptionsMenu = ({
    workoutExercise,
    onClose,
    onUpdate,
  }: {
    workoutExercise: WorkoutExercise;
    onClose: () => void;
    onUpdate: (exercise: WorkoutExercise) => void;
  }) => {
    const handleMarkExercise = () => {
      onUpdate({
        ...workoutExercise,
        isMarked: !workoutExercise.isMarked,
      });
      onClose();
    };

    const handleShowAlternatives = () => {
      setShowAlternatives(workoutExercise);
      onClose();
    };

    const handleEditDetails = () => {
      showEditExerciseSheet(workoutExercise);
      onClose();
    };

    return (
      <View className="p-4">
        <View className="gap-4">
          <Pressable className="flex-row items-center p-3 active:opacity-70" onPress={handleShowAlternatives}>
            <Repeat size={20} className="text-foreground mr-3" />
            <View>
              <Text className="font-medium">Alternative Übung</Text>
              <Text className="text-sm text-muted-foreground">Ähnliche Übung auswählen</Text>
            </View>
          </Pressable>

          <Pressable
            className="flex-row items-center justify-between p-3 active:opacity-70"
            onPress={handleMarkExercise}
          >
            <View className="flex-row items-center">
              <AlertOctagon
                size={20}
                className={`mr-3 ${workoutExercise.isMarked ? "text-primary" : "text-foreground"}`}
              />
              <View>
                <Text className="font-medium">Übung markieren</Text>
                <Text className="text-sm text-muted-foreground">Übung hervorheben</Text>
              </View>
            </View>
            {workoutExercise.isMarked && <View className="h-2 w-2 rounded-full bg-primary" />}
          </Pressable>

          <Pressable className="flex-row items-center p-3 active:opacity-70" onPress={handleEditDetails}>
            <Edit3 size={20} className="text-foreground mr-3" />
            <View>
              <Text className="font-medium">Details bearbeiten</Text>
              <Text className="text-sm text-muted-foreground">Parameter & Optionen anpassen</Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };

  const showEditExerciseSheet = async (workoutExercise: WorkoutExercise) => {
    const result = await SheetManager.show("sheet-with-router", {
      payload: {
        exercise: getFullExercise(workoutExercise, exerciseStore.exercises)!,
        workoutExercise: workoutExercise,
        initalRoute: "main-edit-route",
      },
    });
    if (result) {
      updateExercise(result);
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-sm text-muted-foreground">{routineName}</Text>
        <Button variant="ghost" className="h-8 px-3 flex-row items-center" onPress={toggleEditMode}>
          {isEditMode ? (
            <>
              <X size={16} className="text-destructive mr-2" />
              <Text className="text-destructive text-sm font-medium">Abbrechen</Text>
            </>
          ) : (
            <>
              <Pencil size={16} className="text-primary mr-2" />
              <Text className="text-primary text-sm font-medium">Bearbeiten</Text>
            </>
          )}
        </Button>
      </View>

      {isEditMode && (
        <Pressable onPress={() => setShowAddExercise(true)}>
          <Card className="shadow-none mb-4 p-4 flex-row justify-between items-center bg-background">
            <Text className="text-sm font-medium">Übung hinzufügen</Text>
            <Button variant="ghost" size="icon" className="h-8 w-8" onPress={() => setShowAddExercise(true)}>
              <Plus size={20} className="text-primary" />
            </Button>
          </Card>
        </Pressable>
      )}

      <View className="gap-3">
        {workout.exercises.map((workoutExercise) => {
          const exercise = getFullExercise(workoutExercise, exerciseStore.exercises);
          if (!exercise) return null;

          return (
            <Pressable
              key={workoutExercise.exerciseId}
              onPress={() => {
                if (isEditMode) {
                  showEditExerciseSheet(workoutExercise);
                } else {
                  onExercisePress?.(exercise.id);
                }
              }}
              className="active:opacity-70"
            >
              <View className="bg-card rounded-xl p-4 border border-border">
                <View className="flex-row justify-between items-start">
                  <View className="flex-row gap-3 flex-1">
                    <View className="w-12 h-12 bg-muted rounded-lg items-center justify-center overflow-hidden">
                      {exercise.images?.[0] && (
                        <Image
                          source={{ uri: exercise.images[0] }}
                          alt={exercise.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="font-medium mb-1">{exercise.name}</Text>
                      <Text className="text-muted-foreground text-sm">{exercise.equipment}</Text>
                    </View>
                  </View>
                  {isEditMode ? (
                    <ExerciseDeleteConfirmation
                      open={deleteExerciseId === workoutExercise.exerciseId}
                      onOpenChange={(open) => {
                        setDeleteExerciseId(open ? workoutExercise.exerciseId : null);
                      }}
                      onConfirm={() => {
                        deleteExercise(workoutExercise.exerciseId);
                        setDeleteExerciseId(null);
                      }}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 size={18} className="text-destructive" />
                        </Button>
                      }
                    />
                  ) : (
                    <Dialog
                      open={menuExerciseId === workoutExercise.exerciseId}
                      onOpenChange={(open) => {
                        setMenuExerciseId(open ? workoutExercise.exerciseId : null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="text-muted-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <ExerciseOptionsMenu
                          workoutExercise={workoutExercise}
                          onClose={() => setMenuExerciseId(null)}
                          onUpdate={updateExercise}
                        />
                      </DialogContent>
                    </Dialog>
                  )}
                </View>
                <Text className="mt-3 text-sm text-muted-foreground">
                  {workoutExercise.sets} Sätze • {getRepsRange(workoutExercise)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

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
              const updatedWorkout = {
                ...workout,
                exercises: [...workout.exercises.filter((ex) => ex !== showAlternatives), updatedWorkoutExercise],
              };
              setWorkout(updatedWorkout);
              setShowAlternatives(null);
              onUpdateWorkout?.(updatedWorkout);
            }}
            withConfirmation={false}
          />
        )}
      </BottomSheet>
    </View>
  );
}
