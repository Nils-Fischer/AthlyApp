// TrainTechApp/app/workout/exercise/[id].tsx
import React from "react";
import { Text } from "~/components/ui/text";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useExerciseStore } from "~/stores/exerciseStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExerciseDetail } from "~/components/Exercise/ExerciseDetail";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "~/lib/icons/Icons";

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
    <>
      <Stack.Screen
        options={{
          title: exercise.name,
          headerLeft: () => (
            <Button variant="ghost" className="ml-2" onPress={() => router.back()}>
              <ChevronLeft size={24} />
            </Button>
          ),
        }}
      />
      <ExerciseDetail
        exercise={exercise}
        navigateToExercise={(exercise) => router.push(`/workout/exercise/${exercise.id}`)}
      />
    </>
  );
}
