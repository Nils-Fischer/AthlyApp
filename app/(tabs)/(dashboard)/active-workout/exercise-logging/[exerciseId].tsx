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
import { useMemo, useState, useCallback, useEffect } from "react";

export default function ExerciseLoggingScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exerciseIdNumber = parseInt(exerciseId);

  const workoutId = useActiveWorkoutStore((state) => state.workoutId);
  const exerciseRecords = useActiveWorkoutStore((state) => state.exerciseRecords);
  const restTimer = useActiveWorkoutStore((state) => state.restTimer);
  const startRestTimer = useActiveWorkoutStore((state) => state.startRestTimer);
  const pauseRestTimer = useActiveWorkoutStore((state) => state.pauseRestTimer);
  const completeExercise = useActiveWorkoutStore((state) => state.completeExercise);
  const updateReps = useActiveWorkoutStore((state) => state.updateReps);
  const updateWeight = useActiveWorkoutStore((state) => state.updateWeight);
  const markSetCompleted = useActiveWorkoutStore((state) => state.markSetCompleted);

  const updateSetsInExercise = useUserRoutineStore((state) => state.updateSetsInExercise);
  const getWorkoutById = useUserRoutineStore((state) => state.getWorkoutById);
  const getExerciseById = useExerciseStore((state) => state.getExerciseById);

  const exercise = useMemo(() => getExerciseById(exerciseIdNumber), [exerciseIdNumber, getExerciseById]);
  const workoutExercise = useMemo(
    () =>
      workoutId ? getWorkoutById(workoutId)?.exercises.find((ex) => ex.exerciseId === exerciseIdNumber) || null : null,
    [workoutId, exerciseIdNumber, getWorkoutById]
  );
  const exerciseRecord = useMemo(() => exerciseRecords.get(exerciseIdNumber), [exerciseIdNumber, exerciseRecords]);

  useEffect(() => {
    if (workoutExercise?.sets) {
      console.log(`[Debug] Exercise ${exerciseIdNumber} - Sets updated. Count: ${workoutExercise.sets.length}`);
    }
  }, [workoutExercise?.sets, exerciseIdNumber]);

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

  const handleExerciseComplete = useCallback(() => {
    setShowIntensityDialog(true);
  }, []);

  const handleIntensitySelect = useCallback(() => {
    exerciseRecord.sets.forEach((set, index) => {
      markSetCompleted(exerciseIdNumber, index, true);
    });
    completeExercise(exerciseIdNumber, selectedIntensity);
    setShowIntensityDialog(false);
    router.back();
  }, [completeExercise, exerciseIdNumber, selectedIntensity]);

  const handleAddSet = useCallback(() => {
    if (!workoutId || !exerciseIdNumber) return;

    // Get current workout exercise directly from store to avoid stale closures
    const currentWorkout = getWorkoutById(workoutId);
    const currentExercise = currentWorkout?.exercises.find((ex) => ex.exerciseId === exerciseIdNumber);

    if (!currentExercise?.sets?.length) return;

    updateSetsInExercise(workoutId, exerciseIdNumber, [
      ...currentExercise.sets,
      {
        reps: 8,
        weight: currentExercise.sets[currentExercise.sets.length - 1].weight,
      },
    ]);
  }, [workoutId, exerciseIdNumber, getWorkoutById, updateSetsInExercise]);

  const handleDeleteSet = useCallback(
    (setIndex: number) => {
      if (!workoutId || !exerciseIdNumber) return;

      // Get current workout exercise directly from store to avoid stale closures
      const currentWorkout = getWorkoutById(workoutId);
      const currentExercise = currentWorkout?.exercises.find((ex) => ex.exerciseId === exerciseIdNumber);

      if (!currentExercise?.sets) return;

      updateSetsInExercise(
        workoutId,
        exerciseIdNumber,
        currentExercise.sets.filter((_, index) => index !== setIndex) || []
      );
    },
    [workoutId, exerciseIdNumber, getWorkoutById, updateSetsInExercise]
  );

  const totalVolume = useMemo(
    () => exerciseRecord?.sets.reduce((acc, set) => acc + (set.reps || 0) * (set.weight || 0), 0) || 0,
    [exerciseRecord]
  );
  const completedSets = useMemo(
    () => exerciseRecord?.sets.filter((set) => set.reps !== null && set.weight !== null).length || 0,
    [exerciseRecord]
  );

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
        onToggleSetCompleted={(setIndex, completed) => markSetCompleted(exerciseIdNumber, setIndex, completed)}
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
