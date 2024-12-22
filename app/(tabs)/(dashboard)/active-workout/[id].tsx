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

export default function ActiveWorkoutScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getActiveRoutine, isLoading, error } = useUserStore();
  const workoutHistoryStore = useWorkoutHistoryStore();
  const activeWorkout = getActiveRoutine()?.workouts.find((workout) => workout.id === parseInt(id));

  const [isEditMode, setIsEditMode] = useState(false);
  const { isStarted, isPaused, startWorkout, setWorkout, pauseWorkout, resumeWorkout, finishWorkout, cancelWorkout } =
    useActiveWorkoutStore();

  const finish = () => {
    const session = finishWorkout();
    session && workoutHistoryStore.addWorkoutSession(session);
    router.back();
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
          onFinish={finish}
          onCancel={cancelWorkout}
        />
      </View>
    </>
  );
}
