// TrainTechApp/app/workout/exercise/[id].tsx
import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Pencil } from "~/lib/icons/Icons";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { WorkoutOverview } from "~/components/Workout/WorkoutOverview";
import { CardLabelInput, PInput } from "~/components/ui/typography-inputs";
import { CardLabel, P } from "~/components/ui/typography";
import { Workout, WorkoutExercise } from "~/lib/types";

export default function ExerciseDetailScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { getWorkoutById, addExerciseToWorkout, updateExerciseInWorkout, deleteExerciseFromWorkout, updateWorkout } =
    useUserRoutineStore();
  const workout = getWorkoutById(workoutId);

  const [isEditMode, setIsEditMode] = useState(false);
  const [workoutName, setWorkoutName] = useState(workout?.name || "");
  const [workoutDescription, setWorkoutDescription] = useState(workout?.description || "");

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

  useEffect(() => {
    if (workout && !isEditMode && (workout?.name !== workoutName || workout?.description !== workoutDescription)) {
      const updatedWorkout: Workout = {
        ...workout,
        name: workoutName,
        description: workoutDescription,
      };
      updateWorkout(workoutId, updatedWorkout);
    }
  }, [isEditMode]);

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
      <View className="flex-1 p-4 gap-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditMode ? (
                <View className="flex-row gap-2 items-center">
                  <CardLabelInput className="text-md" onChangeText={setWorkoutName} value={workoutName || "Workout"} />
                  <Pencil className="text-muted-foreground/80" size={12} />
                </View>
              ) : (
                <CardLabel className="text-md">{workoutName}</CardLabel>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditMode ? (
              <PInput className="text-md" defaultValue={workoutDescription} onChangeText={setWorkoutDescription} />
            ) : (
              <P className="text-md">{workoutDescription}</P>
            )}
          </CardContent>
        </Card>
        <WorkoutOverview
          workout={workout}
          isEditMode={isEditMode}
          onExercisePress={handleExercisePress}
          onAddExercise={handleAddExercise}
          onDeleteExercise={handleDeleteExercise}
          onUpdateExercise={handleUpdateExercise}
          onUpdateWorkout={handleUpdateWorkout}
        />
      </View>
    </>
  );
}
