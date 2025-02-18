import { router, Stack, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useExerciseStore } from "~/stores/exerciseStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "~/components/ui/dialog";
import { ActiveWorkoutExerciseLogging } from "~/components/ActiveWorkout/ActiveWorkoutExerciseLogging";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { useMemo, useState } from "react";

export default function ExerciseLoggingScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exerciseIdNumber = parseInt(exerciseId);

  const {
    startRestTimer,
    pauseRestTimer,
    restTimer,
    workoutId,
    exerciseRecords,
    completeExercise,
    updateReps,
    updateWeight,
  } = useActiveWorkoutStore();
  const { updateSetsInExercise } = useUserRoutineStore();
  const { getWorkoutById } = useUserRoutineStore();
  const { getExerciseById } = useExerciseStore();

  const exercise = useMemo(() => getExerciseById(exerciseIdNumber), [exerciseIdNumber, getExerciseById]);
  const workoutExercise = useMemo(
    () =>
      workoutId ? getWorkoutById(workoutId)?.exercises.find((ex) => ex.exerciseId === exerciseIdNumber) || null : null,
    [workoutId, exerciseIdNumber, getWorkoutById]
  );
  const exerciseRecord = useMemo(() => exerciseRecords.get(exerciseIdNumber), [exerciseIdNumber, exerciseRecords]);

  if (!workoutId || !exercise || !workoutExercise || !exerciseRecord) {
    console.error(`Exercise Logging Error: Missing required parameters
      Workout ID: ${workoutId || "Undefined"}
      Exercise ID: ${exerciseId} (parsed as ${exerciseIdNumber})
      Exercise Data: ${exercise ? "Found" : "Not found"}
      Workout Exercise: ${workoutExercise ? "Found" : "Not found"}
      Exercise Record: ${exerciseRecord ? "Found" : "Not found"}
    Check parameters and data loading for this exercise.`);
    return (
      <View className="flex-1 justify-center items-center p-4 bg-background">
        <Text className="text-lg text-destructive mb-4">Error: Routine or workout not found</Text>
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

  const [showIntensityDialog, setShowIntensityDialog] = useState(false);
  const [selectedIntensity, setSelectedIntensity] = useState<number>(3);

  const handleExerciseComplete = () => {
    setShowIntensityDialog(true);
  };

  const handleIntensitySelect = () => {
    completeExercise(exerciseIdNumber, selectedIntensity);
    setShowIntensityDialog(false);
    router.back();
  };

  const handleAddSet = () => {
    updateSetsInExercise(workoutId, exerciseIdNumber, [
      ...workoutExercise.sets,
      {
        reps: 8,
        weight: workoutExercise.sets[workoutExercise.sets.length - 1].weight,
      },
    ]);
  };

  const handleDeleteSet = (setIndex: number) => {
    updateSetsInExercise(
      workoutId,
      exerciseIdNumber,
      workoutExercise.sets.filter((_, index) => index !== setIndex)
    );
  };

  const totalVolume = exerciseRecord
    ? exerciseRecord.sets.reduce((acc, set) => acc + (set.reps || 0) * (set.weight || 0), 0)
    : 0;

  const completedSets = exerciseRecord
    ? exerciseRecord.sets.filter((set) => set.reps !== null && set.weight !== null).length
    : 0;

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
        exerciseRecord={exerciseRecord}
        onUpdateReps={(setIndex, reps) => updateReps(exerciseIdNumber, setIndex, reps)}
        onUpdateWeight={(setIndex, weight) => updateWeight(exerciseIdNumber, setIndex, weight)}
        onAddSet={handleAddSet}
        onDeleteSet={handleDeleteSet}
        onCompleteExercise={handleExerciseComplete}
        isResting={restTimer.isRunning}
        remainingRestTime={restTimer.remainingTime}
        onStartRest={() => startRestTimer(workoutExercise.restPeriod || 60)}
        onStopRest={pauseRestTimer}
        totalVolume={totalVolume}
        completedSets={completedSets}
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
