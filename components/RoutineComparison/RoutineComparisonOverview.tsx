import { useState } from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine, Workout } from "~/lib/types";
import { RoutineComparisonWorkoutPage } from "~/components/RoutineComparison/RoutineComparisonWorkoutPage";
import { cn } from "~/lib/utils";
import { P } from "../ui/typography";

export function RoutineComparisonOverview({
  routine,
  oldComparisonRoutine,
}: {
  routine: Routine;
  oldComparisonRoutine?: Routine;
}) {
  const [activeTab, setActiveTab] = useState(routine.workouts[0]?.id.toString() || "0");

  const oldWorkouts = oldComparisonRoutine?.workouts || [];
  const newWorkouts = routine.workouts;

  const getWorkoutState = (workout: Workout): "new" | "modified" | "unchanged" => {
    if (!oldComparisonRoutine) return "unchanged";
    const oldWorkout = oldWorkouts.find((w) => w.id === workout.id);
    if (!oldWorkout) return "new";
    if (JSON.stringify(oldWorkout, null, 2) === JSON.stringify(workout, null, 2)) return "unchanged";
    return "modified";
  };

  const allWorkouts: ["new" | "modified" | "unchanged" | "removed", Workout][] = [
    ...newWorkouts.map((workout) => [getWorkoutState(workout), workout] as ["new" | "modified" | "unchanged", Workout]),
    ...oldWorkouts
      .filter((workout) => !newWorkouts.map((w) => w.id).includes(workout.id))
      .map((workout) => ["removed", workout] as ["removed", Workout]),
  ];

  if (!allWorkouts.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">Keine Workouts gefunden</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <View className="px-4 pt-2 flex-row">
          <TabsList className="mb-4 flex-row flex-1 items-center">
            {allWorkouts.map(([state, workout]) => (
              <TabsTrigger key={workout.id} value={workout.id.toString()} className="flex-1">
                <P
                  numberOfLines={1}
                  className={cn(
                    "px-2",
                    state === "new"
                      ? "text-green-500"
                      : state === "modified"
                      ? "italic"
                      : state === "removed"
                      ? "text-destructive"
                      : "text-foreground"
                  )}
                >
                  {workout.name}
                </P>
              </TabsTrigger>
            ))}
          </TabsList>
        </View>
        {allWorkouts.map(([state, workout]) => (
          <TabsContent key={workout.id} value={workout.id.toString()} className="flex-1">
            <RoutineComparisonWorkoutPage
              workout={workout}
              oldComparisonWorkout={oldComparisonRoutine?.workouts.find((w) => w.id === workout.id)}
              state={state}
            />
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
