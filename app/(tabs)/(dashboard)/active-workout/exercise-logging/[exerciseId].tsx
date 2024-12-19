import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { ExerciseLogging } from "~/components/ActiveWorkout/ExerciseLogging";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SetInput } from "~/lib/types";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useExerciseStore } from "~/stores/exerciseStore";

export default function ExerciseLoggingScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exerciseIdNumber = parseInt(exerciseId);
  const exerciseStore = useExerciseStore();
  const activeWorkoutStore = useActiveWorkoutStore();
  const workoutStarted = activeWorkoutStore.isStarted;

  const workout = activeWorkoutStore.currentWorkout;
  const exercise = exerciseStore.exercises?.find((ex) => ex.id === exerciseIdNumber);
  const workoutExercise = workout?.exercises.find((ex) => ex.exerciseId === exerciseIdNumber);
  const exerciseRecord = activeWorkoutStore.currentSession?.entries.find((ex) => ex.exerciseId === exerciseIdNumber);

  if (!workout || !exercise || !workoutExercise || !exerciseRecord) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <Text className="text-lg text-destructive mb-4">Error: Exercise not found</Text>
        <Button
          variant="destructive"
          onPress={() => {
            console.error(`Exercise Logging Error: No exercise found for ID ${exerciseId}`);
            router.back();
          }}
        >
          <Text>Zurück zur Übersicht</Text>
        </Button>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: exercise.name,
          headerLeft: () => (
            <Button
              variant="ghost"
              className="ml-2"
              onPress={() => {
                router.back();
              }}
            >
              <ChevronLeft size={24} />
            </Button>
          ),
        }}
      />
      <ExerciseLogging
        exercise={exercise}
        workoutExercise={workoutExercise}
        isWorkoutStarted={workoutStarted}
        exerciseRecord={exerciseRecord}
        updateExerciseRecord={activeWorkoutStore.updateExerciseRecord}
      />
    </>
  );
}
