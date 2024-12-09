import { useState, useEffect } from "react";
import { View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine, Workout } from "~/lib/types";
import { WorkoutPage } from "~/components/Workout/WorkoutPage";
import { useUserStore } from "~/stores/userStore";
import { Button } from "~/components/ui/button";
import { Pencil, X } from "lucide-react-native";

export function RoutineOverview({
  routine: initialRoutine,
  handleExercisePress,
}: {
  routine: Routine;
  handleExercisePress?: (exerciseId: number) => void;
}) {
  const [routine, setRoutine] = useState(initialRoutine);
  const [activeTab, setActiveTab] = useState(routine?.workouts[0]?.id.toString() || "0");
  const [isEditMode, setIsEditMode] = useState(false);
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

  const toggleEditMode = () => setIsEditMode(!isEditMode);

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
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-sm text-muted-foreground">{routine.name}</Text>
            <Button variant="ghost" className="h-8 px-3 flex-row items-center" onPress={toggleEditMode}>
              {isEditMode ? (
                <>
                  <X size={16} className="text-destructive mr-2" />
                  <Text className="text-destructive text-sm font-medium">Abbrechen</Text>
                </>
              ) : (
                <>
                  <Pencil size={16} className="text-primary mr-2" />
                  <Text className="text-primary text-sm font-medium">Bearbeiten</Text>
                </>
              )}
            </Button>
          </View>
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
              isEditMode={isEditMode}
            />
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
