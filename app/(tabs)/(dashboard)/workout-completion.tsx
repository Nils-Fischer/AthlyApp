import { SafeAreaView, View } from "react-native";
import { P } from "~/components/ui/typography";
import WorkoutCompletionModal from "~/components/WorkoutCompletion/WorkoutCompletionModal";
import { getMuscleGroup } from "~/lib/utils";
import { useExerciseStore } from "~/stores/exerciseStore";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { router } from "expo-router";
import { useChatStore } from "~/stores/chatStore";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { useMemo, useRef, useState } from "react";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { Routine } from "~/lib/types";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import { RoutinePreview } from "~/lib/Chat/RoutinePreview";

export type Improvement = {
  exerciseName: string;
  weight: number;
  pr: boolean;
  percentageImprovement?: number;
};

export default function WorkoutCompletion() {
  const { getLastSession, getExerciseRecords } = useWorkoutHistoryStore();
  const { getExerciseById } = useExerciseStore();
  const { sendWorkoutReviewMessage } = useChatStore();
  const { profile } = useUserProfileStore();
  const { routines, addRoutine, updateRoutine } = useUserRoutineStore();

  const lastSession = getLastSession();
  const [routine, setRoutine] = useState<Routine | null>(null);
  const actionSheetRef = useRef<ActionSheetRef>(null);

  if (!lastSession) {
    return (
      <SafeAreaView>
        <P>Kein Workout gefunden</P>
      </SafeAreaView>
    );
  }

  // Create a memoized promise that won't change on re-renders
  const feedbackPromise = useMemo(() => {
    return sendWorkoutReviewMessage(lastSession, routines, JSON.stringify(profile, null, 2));
  }, [lastSession, profile, sendWorkoutReviewMessage]);

  const { workoutName, date, entries, duration } = lastSession;
  const totalWeight = entries.reduce(
    (acc, entry) => acc + entry.sets.reduce((setAcc, set) => setAcc + (set.weight || 0), 0),
    0
  );
  const exercises = entries.map((entry) => getExerciseById(entry.exerciseId)).filter((exercise) => exercise !== null);
  const caloriesBurned = entries.filter((entry) => entry.isCompleted).length * 10;
  const trainedMuscles = [...new Set(exercises.map((exercise) => getMuscleGroup(exercise.primaryMuscles[0])))];
  const improvements: Improvement[] = entries
    .map((entry) => {
      const allRecords = getExerciseRecords(entry.exerciseId);
      const exerciseName = getExerciseById(entry.exerciseId)?.name;

      if (!exerciseName) return null;

      const maxWeight = Math.max(...entry.sets.map((set) => set.weight || 0));
      if (maxWeight === 0) return null;

      const previousRecord = allRecords.at(-2);
      if (!previousRecord) return { exerciseName, weight: maxWeight, pr: true };

      const pr = allRecords.sort(
        (a, b) => Math.max(...b.sets.map((set) => set.weight || 0)) - Math.max(...a.sets.map((set) => set.weight || 0))
      )[0];

      const previousMaxWeight = Math.max(...previousRecord.sets.map((set) => set.weight || 0));
      if (previousMaxWeight === 0) return { exerciseName, weight: maxWeight, pr: pr === entry };

      const percentageImprovement = Number((((maxWeight - previousMaxWeight) / previousMaxWeight) * 100).toFixed(2));
      if (percentageImprovement <= 0) return null;

      return { exerciseName: exerciseName, weight: maxWeight, pr: pr === entry, percentageImprovement };
    })
    .filter((improvement) => improvement !== null);

  return (
    <SafeAreaView>
      <WorkoutCompletionModal
        workoutName={workoutName}
        date={date}
        duration={duration}
        totalWeight={totalWeight}
        caloriesBurned={caloriesBurned}
        trainedMuscles={trainedMuscles}
        improvements={improvements}
        aiCoachFeedback={feedbackPromise}
        onFinish={() => router.dismissAll()}
        displayRoutine={(routine: Routine) => {
          setRoutine(routine);
          actionSheetRef.current?.show();
        }}
      />

      {routine && (
        <ActionSheet
          ref={actionSheetRef}
          snapPoints={[95]}
          initialSnapIndex={0}
          gestureEnabled={true}
          closeOnTouchBackdrop={true}
          elevation={2}
        >
          <View className="min-h-full bg-background">
            <RoutinePreview
              allRoutines={routines}
              previewRoutine={routine}
              handleAddRoutine={addRoutine}
              handleModifyRoutine={updateRoutine}
            />
          </View>
        </ActionSheet>
      )}
    </SafeAreaView>
  );
}
