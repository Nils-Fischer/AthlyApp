// TrainTechApp/app/workout/exercise/[id].tsx
import React from "react";
import { Text } from "~/components/ui/text";
import { router, useLocalSearchParams } from "expo-router";
import { useExerciseStore } from "~/stores/exerciseStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExerciseDetail } from "~/components/Exercise/ExerciseDetail";

type Props = {
  useLocalSearchParams?: () => { id: string };
};

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const exerciseStore = useExerciseStore();
  const exercise = exerciseStore.getExerciseById(Number(id));

  if (!exercise) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text>Übung nicht gefunden</Text>
      </SafeAreaView>
    );
  }

  return (
    <ExerciseDetail
      exercise={exercise}
      navigateToExercise={(exercise) => router.push(`/workout/exercise/${exercise.id}`)}
    />
  );
}
