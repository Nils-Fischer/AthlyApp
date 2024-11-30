import { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine, Workout } from "~/lib/types";
import { WorkoutPage } from "./WorkoutPage";
import { useUserStore } from "~/stores/userStore";

export function RoutineOverview({
  routine: initialRoutine,
  handleExercisePress,
}: {
  routine: Routine;
  handleExercisePress?: (exerciseId: number) => void;
}) {
  // Lokalen State für die Routine hinzufügen
  const [routine, setRoutine] = useState(initialRoutine);
  const [activeTab, setActiveTab] = useState(routine?.workouts[0]?.id.toString() || "0");
  const userStore = useUserStore();
  useEffect(() => {
    console.log("🔄 RoutineOverview mounted with routine:", initialRoutine);
  }, []);

  // Aktualisiere lokalen State wenn sich die initiale Routine ändert
  useEffect(() => {
    setRoutine(initialRoutine);
  }, [initialRoutine]);

  const handleUpdateWorkout = async (updatedWorkout: Workout) => {
    console.log("RoutineOverview - Updating workout:", updatedWorkout);
    const updatedRoutine: Routine = {
      ...routine,
      workouts: routine.workouts.map(workout => 
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      )
    };
    console.log("RoutineOverview - Updated routine:", updatedRoutine);
    
    // Lokalen State aktualisieren
    setRoutine(updatedRoutine);
    
    // Store aktualisieren
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
    <ScrollView className="flex-1">
      <View className="px-4 pt-2 pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-col gap-1.5">
          <TabsList className="flex-row w-full mb-4">
            {routine.workouts.map((workout) => (
              <TabsTrigger key={workout.id} value={workout.id.toString()} className="flex-1">
                <Text>{workout.name}</Text>
              </TabsTrigger>
            ))}
          </TabsList>
          {routine.workouts.map((workout) => (
            <TabsContent key={workout.id} value={workout.id.toString()} className="w-full px-0">
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
    </ScrollView>
  );
}