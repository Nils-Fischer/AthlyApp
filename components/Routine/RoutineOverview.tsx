import { useState, useEffect } from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine, Workout } from "~/lib/types";
import { WorkoutPage } from "~/components/Workout/WorkoutPage";
import { useUserStore } from "~/stores/userStore";

export function RoutineOverview({
  routine: initialRoutine,
  handleExercisePress,
}: {
  routine: Routine;
  handleExercisePress?: (exerciseId: number) => void;
}) {
  const [routine, setRoutine] = useState(initialRoutine);
  const [activeTab, setActiveTab] = useState(routine?.workouts[0]?.id.toString() || "0");
  const userStore = useUserStore();

  useEffect(() => {
    setRoutine(initialRoutine);
  }, [initialRoutine]);

  const handleUpdateWorkout = async (updatedWorkout: Workout) => {
    const updatedRoutine: Routine = {
      ...routine,
      workouts: routine.workouts.map((workout) => (workout.id === updatedWorkout.id ? updatedWorkout : workout)),
    };
    setRoutine(updatedRoutine);
    await userStore.updateRoutine(updatedRoutine);
  };

  if (!routine || !routine.workouts.length) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">Keine Workouts gefunden</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <View className="px-4 pt-2">
          <TabsList className="flex-row w-full mb-4">
            {routine.workouts.map((workout) => (
              <TabsTrigger key={workout.id} value={workout.id.toString()} className="flex-1">
                <Text>{workout.name}</Text>
              </TabsTrigger>
            ))}
          </TabsList>
        </View>
        {routine.workouts.map((workout) => (
          <TabsContent key={workout.id} value={workout.id.toString()} className="flex-1 px-4">
            <WorkoutPage
              workout={workout}
              routineName={routine.name}
              onExercisePress={handleExercisePress}
              onUpdateWorkout={handleUpdateWorkout}
            />
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
