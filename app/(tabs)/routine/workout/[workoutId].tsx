import React, { useEffect, useState } from "react";
import { Text } from "~/components/ui/text";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { ChevronLeft, Pencil, Clock, Dumbbell, BarChart3 } from "~/lib/icons/Icons";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "~/components/ui/card";
import { WorkoutOverview } from "~/components/Workout/WorkoutOverview";
import { CardLabelInput, PInput } from "~/components/ui/typography-inputs";
import { CardLabel, P, Small, Muted, Lead } from "~/components/ui/typography";
import { Workout, WorkoutExercise, Muscle, MuscleGroup } from "~/lib/types";
import { useExerciseStore } from "~/stores/exerciseStore";
import { getMuscleGroup } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";

export default function ExerciseDetailScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { getWorkoutById, addExerciseToWorkout, updateExerciseInWorkout, deleteExerciseFromWorkout, updateWorkout } =
    useUserRoutineStore();
  const exerciseStore = useExerciseStore();
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

  // Calculate workout statistics
  const getWorkoutStats = () => {
    if (!workout) return { totalExercises: 0, totalSets: 0, estimatedDuration: 0, muscleGroups: [] as MuscleGroup[] };

    const totalExercises = workout.exercises.length;
    const totalSets = workout.exercises.reduce((acc, exercise) => acc + exercise.sets.length, 0);
    const estimatedDuration = workout.duration || totalSets * 2; // Estimate 2 minutes per set if duration not provided

    // Extract primary muscle groups from exercises using the utility function
    const muscleGroupsSet = new Set<MuscleGroup>();
    workout.exercises.forEach((ex) => {
      const exercise = exerciseStore.getExerciseById(ex.exerciseId);
      if (exercise?.primaryMuscles) {
        exercise.primaryMuscles.forEach((muscle: Muscle) => {
          const muscleGroup = getMuscleGroup(muscle);
          muscleGroupsSet.add(muscleGroup);
        });
      }
    });

    return {
      totalExercises,
      totalSets,
      estimatedDuration,
      muscleGroups: Array.from(muscleGroupsSet),
    };
  };

  const workoutStats = getWorkoutStats();

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
        <Card className="bg-card">
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
              <View className="flex-column gap-6">
                <P className="text-md">{workoutDescription || "Keine Beschreibung vorhanden."}</P>

                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Dumbbell size={16} className="text-primary mr-2" />
                    <Small>Übungen: {workoutStats.totalExercises}</Small>
                  </View>
                  <View className="flex-row items-center">
                    <BarChart3 size={16} className="text-primary mr-2" />
                    <Small>Sätze: {workoutStats.totalSets}</Small>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={16} className="text-primary mr-2" />
                    <Small>~{workoutStats.estimatedDuration} Min.</Small>
                  </View>
                </View>

                {workoutStats.muscleGroups.length > 0 && (
                  <View>
                    <Muted className="mb-1">Muskelgruppen:</Muted>
                    <View className="flex-row flex-wrap gap-1">
                      {workoutStats.muscleGroups.map((muscleGroup, index) => (
                        <Badge key={index} className="bg-primary text-primary-foreground">
                          <Small className="text-primary-foreground">{muscleGroup}</Small>
                        </Badge>
                      ))}
                    </View>
                  </View>
                )}

                <Lead className="text-sm text-muted-foreground">Drücke auf eine Übung um mehr Details zu sehen</Lead>
              </View>
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
