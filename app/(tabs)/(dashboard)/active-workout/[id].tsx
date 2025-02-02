import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { ActiveWorkoutStats } from "~/components/ActiveWorkout/ActiveWorkoutStats";
import { ActiveWorkoutControls } from "~/components/ActiveWorkout/ActiveWorkoutControls";
import { ActiveWorkoutExerciseList } from "~/components/ActiveWorkout/ActiveWorkoutExerciseList";
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
import { ActiveWorkoutCancelConfirmation } from "~/components/ActiveWorkout/ActiveWorkoutCancelConfirmation";
import { useUserRoutineStore } from "~/stores/userRoutineStore";

export default function ActiveWorkoutScreen() {
  const { id, start } = useLocalSearchParams<{ id: string; start?: string }>();
  const workoutHistoryStore = useWorkoutHistoryStore();
  const { getActiveRoutine } = useUserRoutineStore();
  const activeWorkout = getActiveRoutine()?.workouts.find((workout) => workout.id === parseInt(id));

  const {
    activeSession,
    isStarted,
    isResting,
    remainingRestTime,
    startWorkout,
    startRestTimer,
    stopRestTimer,
    finishWorkout,
    cancelWorkout,
  } = useActiveWorkoutStore();

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showFinishDialog, setShowFinishDialog] = useState(false);

  const allExercisesCompleted = React.useMemo(
    () => activeSession?.entries.every((entry) => entry.isCompleted),
    [activeSession?.entries]
  );

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
    if (!allExercisesCompleted) {
      setShowFinishDialog(true);
    } else {
      finish();
    }
  };

  useEffect(() => {
    if (start === "true") {
      startWorkout();
    }
  }, [start]);

  // Error State
  if (!activeWorkout) {
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
        }}
      />
      <View className="flex-1 bg-background">
        <ActiveWorkoutStats />

        <ActiveWorkoutExerciseList
          workout={activeWorkout}
          isStarted={isStarted}
          onPressExercise={(exercise) => router.push(`/active-workout/exercise-logging/${exercise.exerciseId}`)}
        />

        <ActiveWorkoutControls
          isStarted={isStarted}
          isResting={isResting}
          remainingRestTime={remainingRestTime}
          allExercisesCompleted={allExercisesCompleted || false}
          onStart={() => startWorkout()}
          onStartRest={() => startRestTimer(180)}
          onStopRest={stopRestTimer}
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
