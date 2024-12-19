import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { ExerciseLogging } from "~/components/ActiveWorkout/ExerciseLogging";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useUserStore } from "~/stores/userStore";

export default function ExerciseLoggingScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exerciseIdNumber = parseInt(exerciseId);
  const exerciseStore = useExerciseStore();
  const userStore = useUserStore();
  const activeWorkoutStore = useActiveWorkoutStore();
  const workoutStarted = activeWorkoutStore.isStarted;

  const exercise = exerciseStore.exercises?.find((ex) => ex.id === exerciseIdNumber);
  const workoutExercise = userStore.userData?.routines
    .map((routine) => routine.workouts)
    .flat()
    .map((workout) => workout.exercises)
    .flat()
    .find((workoutExercise) => workoutExercise.exerciseId === exerciseIdNumber);

  if (!exercise || !workoutExercise) {
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <Text className="text-lg text-destructive mb-4">Error: Exercise or Workout Exercise Not Found</Text>
        <Button
          variant="destructive"
          onPress={() => {
            console.error(`Exercise Logging Error: No exercise found for ID ${exerciseId}`);
          }}
        >
          Return to Previous Screen
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
                if (router.canGoBack()) {
                  router.back();
                } else {
                  // router.push(`/active-workout/${workoutExercise.workoutId}`);
                }
              }}
            >
              <ChevronLeft size={24} />
            </Button>
          ),
        }}
      />
      <ExerciseLogging exercise={exercise} workoutExercise={workoutExercise} isWorkoutStarted={workoutStarted} />
    </>
  );
}
