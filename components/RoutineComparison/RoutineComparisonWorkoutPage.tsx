import { useExerciseStore } from "~/stores/exerciseStore";
import { ScrollView, View } from "react-native";
import { Workout, WorkoutExercise } from "~/lib/types";
import { registerSheet } from "react-native-actions-sheet";
import ExerciseBottomSheetEditor from "~/components/Exercise/ExerciseBottomSheetEditor";
import { RoutineComparisonWorkoutExerciseItem } from "./RoutineComparisonWorkoutExerciseItem";
import { P } from "../ui/typography";
import { CircleAlert } from "~/lib/icons/Icons";

registerSheet("sheet-with-router", ExerciseBottomSheetEditor);

interface RoutineComparisonWorkoutPageProps {
  workout: Workout;
  oldComparisonWorkout?: Workout;
  state: "new" | "modified" | "unchanged" | "removed";
}

export function RoutineComparisonWorkoutPage({
  workout,
  oldComparisonWorkout,
  state,
}: RoutineComparisonWorkoutPageProps) {
  const exerciseStore = useExerciseStore();

  if (state === "removed") {
    return (
      <View className="flex-1 px-4 justify-center items-center">
        <CircleAlert className="text-destructive" size={40} />
        <P className="text-destructive">{workout.name} wurde entfernt</P>
      </View>
    );
  }

  const getExerciseState = (exercise: WorkoutExercise): "new" | "modified" | "unchanged" => {
    const oldExercise = oldExercises?.find((e) => e.exerciseId === exercise.exerciseId);
    if (!oldExercise) return "new";
    if (JSON.stringify(oldExercise, null, 2) === JSON.stringify(exercise, null, 2)) return "unchanged";
    return "modified";
  };

  const oldExercises = oldComparisonWorkout?.exercises;
  const newExercises = workout.exercises;

  const allExercises: ["new" | "modified" | "unchanged" | "removed", WorkoutExercise][] = [
    ...newExercises.map(
      (exercise) => [getExerciseState(exercise), exercise] as ["new" | "modified" | "unchanged", WorkoutExercise]
    ),
    ...(oldExercises
      ?.filter((exercise) => !newExercises.map((e) => e.exerciseId).includes(exercise.exerciseId))
      .map((exercise) => ["removed", exercise] as ["removed", WorkoutExercise]) || []),
  ];

  return (
    <ScrollView className="flex-1 px-4 pb-20 mb-20">
      {allExercises.map(([state, workoutExercise]) => {
        const exercise = exerciseStore.getExerciseById(workoutExercise.exerciseId);
        if (!exercise) return null;

        return (
          <RoutineComparisonWorkoutExerciseItem
            key={workoutExercise.exerciseId}
            workoutExercise={workoutExercise}
            exercise={exercise}
            state={state}
            oldComparisonExercise={oldComparisonWorkout?.exercises.find(
              (e) => e.exerciseId === workoutExercise.exerciseId
            )}
          />
        );
      })}
    </ScrollView>
  );
}
