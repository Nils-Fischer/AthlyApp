import React, { useState } from "react";
import { Text } from "~/components/ui/text";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/Icons";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { View } from "react-native";
import { WorkoutOverview } from "~/components/Workout/WorkoutOverview";
import { Workout, WorkoutExercise } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";

export default function ExerciseDetailScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { getWorkoutById, addExerciseToWorkout, updateExerciseInWorkout, deleteExerciseFromWorkout, updateWorkout } =
    useUserRoutineStore();
  const { getExerciseById } = useExerciseStore();
  const workout = getWorkoutById(workoutId);

  const [isEditMode, setIsEditMode] = useState(false);

  const handleExercisePress = (exerciseId: number) => {
    router.push(`/routine/workout/exercise/${exerciseId}`);
  };

  const handleUpdateWorkout = (updatedWorkout: Workout) => {
    updateWorkout(workoutId, updatedWorkout);
  };

  const handleAddExercise = (exercise: WorkoutExercise) => {
    addExerciseToWorkout(workoutId, exercise);
  };

  const handleDeleteExercise = (exerciseId: number) => {
    deleteExerciseFromWorkout(workoutId, exerciseId);
  };

  const handleUpdateExercise = (exerciseId: number, updatedExercise: WorkoutExercise) => {
    updateExerciseInWorkout(workoutId, exerciseId, updatedExercise);
  };

  if (!workout) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Workout nicht gefunden</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: workout.name,
          headerLeft: () => (
            <Button variant="ghost" className="ml-2" onPress={() => router.back()}>
              <ChevronLeft size={24} />
            </Button>
          ),
          headerRight: () => (
            <Button variant="ghost" className="mr-2" onPress={() => setIsEditMode(!isEditMode)}>
              <Text className="text-destructive">{isEditMode ? "Fertig" : "Bearbeiten"}</Text>
            </Button>
          ),
        }}
      />
      <View className="flex-1 p-4 gap-4">
        <WorkoutOverview
          workout={workout}
          isEditMode={isEditMode}
          onExercisePress={handleExercisePress}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onUpdateExercise={handleUpdateExercise}
          onUpdateWorkout={handleUpdateWorkout}
          getExerciseById={getExerciseById}
        />
      </View>
    </>
  );
}
