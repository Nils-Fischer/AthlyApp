import { Image, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Exercise, WorkoutExercise } from "~/lib/types";
import { cn, getRepsRange, getThumbnail, getWeightRange } from "~/lib/utils";
import { P } from "../ui/typography";

interface RoutineComparisonWorkoutExerciseItemProps {
  workoutExercise: WorkoutExercise;
  exercise: Exercise;
  state: "new" | "modified" | "unchanged" | "removed";
  oldComparisonExercise?: WorkoutExercise;
}

export function RoutineComparisonWorkoutExerciseItem({
  workoutExercise,
  exercise,
  state,
  oldComparisonExercise,
}: RoutineComparisonWorkoutExerciseItemProps) {
  const image = getThumbnail(exercise);

  const exerciseDetails = (workoutExercise: WorkoutExercise) => {
    return `${workoutExercise.sets.length} Sätze • ${getRepsRange(workoutExercise)} ${
      getWeightRange(workoutExercise) ? ` • ${getWeightRange(workoutExercise)}` : ""
    }`;
  };

  return (
    <View className="mb-3">
      <View className={cn("bg-card rounded-xl p-4 border border-border", state === "removed" && "opacity-50")}>
        <View className="flex-row justify-between items-start">
          <View className="flex-row gap-3 flex-1">
            <View className="w-12 h-12 bg-muted rounded-lg items-center justify-center overflow-hidden">
              {image && <Image source={{ uri: image }} alt={exercise.name} className="w-full h-full object-cover" />}
            </View>
            <View className="flex-1">
              <Text
                className={cn(
                  "font-medium mb-1",
                  state === "removed" && "text-destructive line-through",
                  state === "new" && "text-green-500",
                  state === "modified" && "italic"
                )}
              >
                {exercise.name}
              </Text>
              <Text className="text-muted-foreground text-sm">{exercise.equipment}</Text>
            </View>
          </View>
        </View>
        {state === "modified" && oldComparisonExercise ? (
          <View className="flex-column">
            <P className="mt-3 text-sm text-destructive">{exerciseDetails(oldComparisonExercise)}</P>
            <P className="m-0 text-sm text-green-500">{exerciseDetails(workoutExercise)}</P>
          </View>
        ) : (
          <P className="mt-3 text-sm text-muted-foreground">{exerciseDetails(workoutExercise)}</P>
        )}
      </View>
    </View>
  );
}
