import { Button } from "~/components/ui/button";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Image, Pressable, ScrollView, View } from "react-native";
import { Workout, WorkoutExercise, Exercise } from "~/lib/types";
import { Text } from "~/components/ui/text";
import { MoreHorizontal, Pencil, Plus, Trash2, X, ChevronLeft, AlertOctagon, Edit3, Repeat } from "~/lib/icons/Icons";
import React, { useState, useRef } from "react";
import { Card } from "~/components/ui/card";
import { ExerciseLibrary } from "~/components/exercise/ExerciseLibrary";
import { ExerciseEditPage } from "./ExerciseEditPage";
import { AlternativeExercisesModal } from "./AlternativeExercisesModal";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DeleteExerciseDialog } from "./DeleteExerciseDialog";
import { ActionSheetRef } from "react-native-actions-sheet";
import { BottomSheet } from "~/components/ui/bottom-sheet";

export function WorkoutPage({
  workout,
  routineName,
  onExercisePress,
  onUpdateWorkout,
}: {
  workout: Workout;
  routineName: string;
  onExercisePress?: (exerciseId: number) => void;
  onUpdateWorkout?: (workout: Workout) => void;
}) {
  const exerciseStore = useExerciseStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<WorkoutExercise | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const addExerciseSheetRef = useRef<ActionSheetRef>(null);
  const alternativesSheetRef = useRef<ActionSheetRef>(null);
  const editSheetRef = useRef<ActionSheetRef>(null);

  function deleteExercise(exerciseId: number) {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter((ex) => ex.exerciseId !== exerciseId),
    };
    onUpdateWorkout?.(updatedWorkout);
  }

  const getFullExercise = (workoutExercise: WorkoutExercise) => {
    return exerciseStore.exercises.find((ex) => ex.id === workoutExercise.exerciseId);
  };

  const getRepsRange = (exercise: WorkoutExercise) => {
    if (exercise.reps === 10) return "10 Wdh.";
    if (Array.isArray(exercise.reps)) return `${exercise.reps[0]}-${exercise.reps[1]} Wdh.`;
    return `${exercise.reps} Wdh.`;
  };

  const handleUpdateExercise = (updatedExercise: WorkoutExercise) => {
    // Finde den Index der alten Übung
    const exerciseIndex = workout.exercises.findIndex((ex) => ex.exerciseId === selectedExercise?.exerciseId);

    if (exerciseIndex === -1) return;

    // Erstelle eine neue Liste mit der ersetzten Übung
    const newExercises = [...workout.exercises];
    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      ...updatedExercise,
    };

    const updatedWorkout = {
      ...workout,
      exercises: newExercises,
    };

    console.log("WorkoutPage - Updated workout:", updatedWorkout);
    onUpdateWorkout?.(updatedWorkout);

    setShowEditPage(false);
    setSelectedExercise(null);
  };

  const handleAddExercise = (exerciseId: number) => {
    const newExercise: WorkoutExercise = {
      exerciseId: exerciseId,
      alternatives: [],
      sets: 3,
      reps: 10,
      weight: 0,
      isMarked: false,
    };

    const updatedWorkout = {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    };
    onUpdateWorkout?.(updatedWorkout);
    setShowAddExercise(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (showAddExercise) setShowAddExercise(false);
  };

  const openAddExerciseSheet = () => {
    addExerciseSheetRef.current?.show();
  };

  const closeAddExerciseSheet = () => {
    addExerciseSheetRef.current?.hide();
  };

  const closeAlternativesSheet = () => {
    alternativesSheetRef.current?.hide();
  };

  const closeEditSheet = () => {
    editSheetRef.current?.hide();
    setSelectedExercise(null);
  };

  const ExerciseOptionsMenu = ({
    exercise,
    workoutExercise,
    onClose,
    onUpdate,
  }: {
    exercise: Exercise;
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
      setSelectedExercise(workoutExercise);
      setShowAlternatives(true);
      onClose();
    };

    const handleEditDetails = () => {
      setSelectedExercise(workoutExercise);
      setShowEditPage(true);
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
        <Pressable onPress={openAddExerciseSheet}>
          <Card className="shadow-none mb-4 p-4 flex-row justify-between items-center bg-background">
            <Text className="text-sm font-medium">Übung hinzufügen</Text>
            <Button variant="ghost" size="icon" className="h-8 w-8" onPress={openAddExerciseSheet}>
              <Plus size={20} className="text-primary" />
            </Button>
          </Card>
        </Pressable>
      )}

      <View className="gap-3">
        {workout.exercises.map((workoutExercise) => {
          const exercise = getFullExercise(workoutExercise);
          if (!exercise) return null;

          return (
            <Pressable
              key={workoutExercise.exerciseId}
              onPress={() => {
                if (isEditMode) {
                  setSelectedExercise(workoutExercise);
                  setShowEditPage(true);
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
                    <DeleteExerciseDialog
                      open={showDeleteConfirm}
                      onOpenChange={setShowDeleteConfirm}
                      onConfirm={() => {
                        deleteExercise(exercise.id);
                        setShowDeleteConfirm(false);
                      }}
                      trigger={
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 size={18} className="text-destructive" />
                        </Button>
                      }
                    />
                  ) : (
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="text-muted-foreground" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <ExerciseOptionsMenu
                          exercise={exercise}
                          workoutExercise={workoutExercise}
                          onClose={() => setIsDialogOpen(false)}
                          onUpdate={handleUpdateExercise}
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

      <BottomSheet title="Übung hinzufügen" actionSheetRef={addExerciseSheetRef} onClose={closeAddExerciseSheet}>
        <ExerciseLibrary
          onPress={(exerciseId) => {
            handleAddExercise(exerciseId);
            closeAddExerciseSheet();
          }}
        />
      </BottomSheet>

      {/* Alternative Exercises Sheet */}
      {selectedExercise && (
        <BottomSheet
          title="Alternative Übungen"
          actionSheetRef={alternativesSheetRef}
          onClose={closeAlternativesSheet}
          snapPoints={[75]}
        >
          {/* TODO: Replace with new component */}
          <AlternativeExercisesModal
            exercise={getFullExercise(selectedExercise)!}
            onClose={closeAlternativesSheet}
            onSelectAlternative={(exercise) => {
              handleUpdateExercise({
                ...selectedExercise,
                exerciseId: exercise.id,
              });
              closeAlternativesSheet();
            }}
          />
        </BottomSheet>
      )}

      {/* Exercise Edit Sheet */}
      {selectedExercise && (
        <BottomSheet title="Übung bearbeiten" actionSheetRef={editSheetRef} onClose={closeEditSheet} snapPoints={[90]}>
          {/* TODO: Replace with non modal component */}
          <ExerciseEditPage
            exercise={getFullExercise(selectedExercise)!}
            workoutExercise={selectedExercise}
            onClose={closeEditSheet}
            onUpdate={handleUpdateExercise}
          />
        </BottomSheet>
      )}
    </View>
  );
}
