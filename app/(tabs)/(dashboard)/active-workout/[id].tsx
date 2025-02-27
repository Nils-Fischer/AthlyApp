import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ActiveWorkoutStats } from "~/components/ActiveWorkout/ActiveWorkoutStats";
import { ActiveWorkoutControls } from "~/components/ActiveWorkout/ActiveWorkoutControls";
import { ActiveWorkoutExerciseList } from "~/components/ActiveWorkout/ActiveWorkoutExerciseList";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { ChevronLeft, Plus } from "~/lib/icons/Icons";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";
import { ActiveWorkoutCancelConfirmation } from "~/components/ActiveWorkout/ActiveWorkoutCancelConfirmation";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { useExerciseStore } from "~/stores/exerciseStore";
import { WorkoutExercise } from "~/lib/types";
import { SheetManager } from "react-native-actions-sheet";
import { ExerciseEditAlternatives } from "~/components/Exercise/ExerciseEditAlternatives";
import { BottomSheet } from "~/components/ui/bottom-sheet";
import { H2 } from "~/components/ui/typography";
import { formatTime } from "~/lib/utils";

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const workoutHistoryStore = useWorkoutHistoryStore();
  const { exercises, getExerciseById } = useExerciseStore();
  const { getActiveRoutine, updateExerciseInWorkout, deleteExerciseFromWorkout, routines, addExerciseToWorkout } =
    useUserRoutineStore();
  const [showAlternatives, setShowAlternatives] = useState<WorkoutExercise | null>(null);
  const activeWorkout = useMemo(
    () => getActiveRoutine()?.workouts.find((workout) => workout.id === id),
    [getActiveRoutine, id, routines]
  );

  const {
    exerciseRecords,
    workoutTimer,
    restTimer,
    startWorkout,
    startRestTimer,
    pauseRestTimer,
    getTotalVolume,
    finishWorkout,
    cancelWorkout,
    getCompletedExercises,
    getRemainingExercises,
  } = useActiveWorkoutStore();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const isStarted = useMemo(() => workoutTimer.isRunning, [workoutTimer.isRunning]);

  const allExercisesCompleted = React.useMemo(
    () => getCompletedExercises() === exerciseRecords.size,
    [exerciseRecords, getCompletedExercises]
  );

  const finish = () => {
    const session = finishWorkout();
    workoutHistoryStore.addWorkoutSession(session);
    setShowFinishDialog(false);
    router.back();
  };

  const confirmCancel = () => {
    cancelWorkout();
    setShowCancelDialog(false);
    router.back();
  };

  const handleFinishPress = () => {
    if (!allExercisesCompleted) {
      setShowFinishDialog(true);
    } else {
      finish();
    }
  };

  // Error State
  if (!activeWorkout) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-destructive">Workout nicht gefunden</Text>
      </View>
    );
  }

  const handleDeleteExercise = (exercise: WorkoutExercise) => {
    deleteExerciseFromWorkout(activeWorkout.id, exercise.exerciseId);
  };

  const handleExercisePress = async (exercise: WorkoutExercise) => {
    if (isStarted) {
      router.push(`/active-workout/exercise-logging/${exercise.exerciseId}`);
    } else {
      const result = await SheetManager.show("sheet-with-router", {
        payload: {
          exercise: getExerciseById(exercise.exerciseId)!,
          workoutExercise: exercise,
          initalRoute: "main-edit-route",
        },
      });
      if (result) {
        updateExerciseInWorkout(activeWorkout.id, exercise.exerciseId, result);
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: activeWorkout.name,
          headerLeft: () => (
            <Button variant="ghost" className="ml-2" onPress={() => router.back()} haptics="light">
              <ChevronLeft size={24} />
            </Button>
          ),
          headerRight: () =>
            isStarted ? (
              <Button variant="ghost" className="mr-2" onPress={() => setIsEditMode(!isEditMode)}>
                <Text className="text-destructive">{isEditMode ? "Fertig" : "Bearbeiten"}</Text>
              </Button>
            ) : null,
        }}
      />
      <View className="flex-1 bg-background">
        {isStarted && !isEditMode ? (
          <ActiveWorkoutStats
            elapsedTime={workoutTimer.elapsedTime}
            completedExercises={getCompletedExercises()}
            remainingExercises={getRemainingExercises()}
            totalVolume={getTotalVolume()}
          />
        ) : (
          <View className="flex-row items-center justify-between pl-8 pr-2 pt-5">
            <View className="flex-row items-center gap-2">
              <H2>
                {activeWorkout.exercises.length} Übung{activeWorkout.exercises.length === 1 ? "" : "en"}
              </H2>
              {isEditMode && (
                <Text className="text-muted-foreground text-sm">{formatTime(workoutTimer.elapsedTime)}</Text>
              )}
            </View>
            <Button variant="ghost" onPress={() => console.log("add exercise")}>
              <Plus className="text-primary" size={30} />
            </Button>
          </View>
        )}

        <ActiveWorkoutExerciseList
          workout={activeWorkout}
          exerciseRecords={exerciseRecords}
          exercises={exercises ?? []}
          isStarted={isStarted && !isEditMode}
          onPressExercise={handleExercisePress}
          onShowAlternatives={(exercise) => setShowAlternatives(exercise)}
          onShowEditSheet={handleExercisePress}
          onDelete={handleDeleteExercise}
        />

        <ActiveWorkoutControls
          isStarted={isStarted}
          isResting={restTimer.isRunning}
          remainingRestTime={restTimer.remainingTime}
          allExercisesCompleted={allExercisesCompleted}
          onStart={() => startWorkout(activeWorkout.id)}
          onStartRest={() => startRestTimer(180)}
          onStopRest={pauseRestTimer}
          onFinish={handleFinishPress}
          onCancel={() => setShowCancelDialog(true)}
        />

        <ActiveWorkoutCancelConfirmation
          showCancelDialog={showCancelDialog}
          setShowCancelDialog={setShowCancelDialog}
          confirmCancel={confirmCancel}
        />

        <AlertDialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
          <AlertDialogContent className="w-[90%] max-w-[400px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">Workout beenden?</AlertDialogTitle>
              <AlertDialogDescription>
                <Text className="text-foreground text-center">
                  Nicht alle Übungen sind abgeschlossen. Unfertige Übungen werden übersprungen.
                </Text>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-center mt-4 gap-3">
              <AlertDialogCancel className="flex-1 max-w-[160px]" haptics="light">
                <Text>Zurück</Text>
              </AlertDialogCancel>
              <AlertDialogAction className="flex-1 max-w-[160px]" onPress={finish} haptics="medium">
                <Text>Beenden</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <BottomSheet
          title="Alternative Übung Auswahl"
          isOpen={showAlternatives !== null}
          onClose={() => setShowAlternatives(null)}
        >
          {showAlternatives && (
            <ExerciseEditAlternatives
              workoutExercise={showAlternatives}
              onSelection={(updatedWorkoutExercise) => {
                updateExerciseInWorkout(activeWorkout.id, showAlternatives.exerciseId, updatedWorkoutExercise);
                setShowAlternatives(null);
              }}
              withConfirmation={false}
            />
          )}
        </BottomSheet>
      </View>
    </>
  );
}
