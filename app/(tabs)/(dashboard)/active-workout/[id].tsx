import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ActiveWorkoutStats } from "~/components/ActiveWorkout/ActiveWorkoutStats";
import { ActiveWorkoutControls } from "~/components/ActiveWorkout/ActiveWorkoutControls";
import { ActiveWorkoutExerciseList } from "~/components/ActiveWorkout/ActiveWorkoutExerciseList";
import { useUserStore } from "~/stores/userStore";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { ChevronLeft } from "~/lib/icons/Icons";
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

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getActiveRoutine, isLoading, error } = useUserStore();
  const workoutHistoryStore = useWorkoutHistoryStore();
  const activeWorkout = getActiveRoutine()?.workouts.find((workout) => workout.id === parseInt(id));

  const [isEditMode, setIsEditMode] = useState(false);
  const {
    activeSession,
    isStarted,
    isPaused,
    startWorkout,
    pauseWorkout,
    resumeWorkout,
    finishWorkout,
    cancelWorkout,
  } = useActiveWorkoutStore();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const finish = () => {
    const session = finishWorkout();
    session && workoutHistoryStore.addWorkoutSession(session);
    setShowFinishDialog(false);
    router.back();
  };

  const confirmCancel = () => {
    cancelWorkout();
    setShowCancelDialog(false);
    router.back();
  };

  const handleFinishPress = () => {
    if (activeSession?.entries.some((entry) => !entry.isCompleted)) {
      setShowFinishDialog(true);
    } else {
      finish();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Error State
  if (error || !activeWorkout) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-destructive">Workout nicht gefunden</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: activeWorkout.name,
          headerLeft: () => (
            <Button variant="ghost" className="ml-2" onPress={() => router.back()}>
              <ChevronLeft size={24} />
            </Button>
          ),
          headerRight: () =>
            activeWorkout ? (
              <Button variant="ghost" className="mr-2" onPress={() => setIsEditMode(!isEditMode)}>
                <Text className="text-destructive">{isEditMode ? "Fertig" : "Bearbeiten"}</Text>
              </Button>
            ) : null,
        }}
      />
      <View className="flex-1 bg-background">
        <ActiveWorkoutStats />

        <ActiveWorkoutExerciseList
          workout={activeWorkout}
          isEditMode={isEditMode}
          isStarted={isStarted}
          onPressExercise={(exercise) => router.push(`/active-workout/exercise-logging/${exercise.exerciseId}`)}
        />

        <ActiveWorkoutControls
          isEditMode={isEditMode}
          isStarted={isStarted}
          isPaused={isPaused}
          onStart={() => startWorkout()}
          onPause={pauseWorkout}
          onResume={resumeWorkout}
          onFinish={handleFinishPress}
          onCancel={() => setShowCancelDialog(true)}
        />

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="w-[90%] max-w-[400px]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-center">Workout abbrechen?</AlertDialogTitle>
              <AlertDialogDescription>
                <Text className="text-foreground text-center">
                  Wenn du das Workout abbrichst, gehen alle Fortschritte verloren.
                </Text>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex flex-row justify-center mt-4 gap-3">
              <AlertDialogCancel className="flex-1 max-w-[160px]">
                <Text>Zurück</Text>
              </AlertDialogCancel>
              <AlertDialogAction className="flex-1 max-w-[160px] bg-destructive" onPress={confirmCancel}>
                <Text>Beenden</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
              <AlertDialogCancel className="flex-1 max-w-[160px]">
                <Text>Zurück</Text>
              </AlertDialogCancel>
              <AlertDialogAction className="flex-1 max-w-[160px]" onPress={finish}>
                <Text>Beenden</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </>
  );
}
