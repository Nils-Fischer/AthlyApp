import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { useState, useCallback } from "react";
import { ActiveWorkoutExerciseLogging } from "~/components/ActiveWorkout/ActiveWorkoutExerciseLogging";

export default function ExerciseLoggingScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exerciseIdNumber = parseInt(exerciseId);
  const exerciseStore = useExerciseStore();
  const activeWorkoutStore = useActiveWorkoutStore();
  const workoutStarted = activeWorkoutStore.isStarted;

  const workout = activeWorkoutStore.activeWorkout;
  const exercise = exerciseStore.exercises?.find((ex) => ex.id === exerciseIdNumber);
  const workoutExercise = workout?.exercises.find((ex) => ex.exerciseId === exerciseIdNumber);
  const exerciseRecord = activeWorkoutStore.activeSession?.entries.find((ex) => ex.exerciseId === exerciseIdNumber);

  const [showIntensityDialog, setShowIntensityDialog] = useState(false);
  const [selectedIntensity, setSelectedIntensity] = useState<number>(3);

  const handleExerciseComplete = useCallback(() => {
    console.log("Opening dialog...");
    setShowIntensityDialog(true);
  }, []);

  const handleIntensitySelect = useCallback(() => {
    activeWorkoutStore.finishExercise(exerciseIdNumber, selectedIntensity);
    setShowIntensityDialog(false);
    router.back();
  }, [activeWorkoutStore, exerciseIdNumber, selectedIntensity]);

  if (!workout || !exercise || !workoutExercise || !exerciseRecord) {
    console.log(workout, exercise, workoutExercise, exerciseRecord);
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
    <View className="flex-1">
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
      <ActiveWorkoutExerciseLogging
        exercise={exercise}
        workoutExercise={workoutExercise}
        isWorkoutStarted={workoutStarted}
        exerciseRecord={exerciseRecord}
        updateExerciseRecord={activeWorkoutStore.updateExerciseRecord}
        onCompleteExercise={handleExerciseComplete}
      />

      <Dialog open={showIntensityDialog} onOpenChange={setShowIntensityDialog}>
        <DialogContent className="p-6">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">Wie intensiv war die Übung?</DialogTitle>
          </DialogHeader>

          <View className="flex-row justify-center gap-3 my-2">
            {[1, 2, 3, 4, 5].map((intensity) => (
              <Button
                key={intensity}
                variant={selectedIntensity === intensity ? "default" : "outline"}
                className={`h-16 w-16 rounded-2xl ${
                  selectedIntensity === intensity ? "bg-primary" : "bg-secondary/10"
                }`}
                onPress={() => setSelectedIntensity(intensity)}
              >
                <Text
                  className={
                    selectedIntensity === intensity
                      ? "text-primary-foreground text-xl font-semibold"
                      : "text-foreground text-xl"
                  }
                >
                  {intensity}
                </Text>
              </Button>
            ))}
          </View>

          <DialogFooter>
            <Button
              className="w-full h-14 rounded-xl"
              disabled={selectedIntensity === null}
              onPress={handleIntensitySelect}
            >
              <Text className="text-primary-foreground text-lg font-medium">Bestätigen</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  );
}
