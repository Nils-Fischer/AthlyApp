import { useState, useEffect } from "react";
import { TextInput, View } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine, Workout } from "~/lib/types";
import { WorkoutPage } from "~/components/Workout/WorkoutPage";
import { useUserStore } from "~/stores/userStore";
import { Button } from "~/components/ui/button";
import { Pencil, X, Plus } from "lucide-react-native";
import { generateId } from "~/lib/utils";

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

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    setRoutine(updatedRoutine);
    await userStore.updateRoutine(updatedRoutine);
  };

  const toggleEditMode = () => setIsEditMode(!isEditMode);

  const handleAddWorkout = async () => {
    const newWorkout: Workout = {
      id: generateId(),
      name: `Workout ${routine.workouts.length + 1}`,
      exercises: [],
    };

    const updatedRoutine: Routine = {
      ...routine,
      workouts: [...routine.workouts, newWorkout],
    };

    setActiveTab(newWorkout.id.toString());
    await handleUpdateRoutine(updatedRoutine);
  };

  const deleteWorkout = async (workoutId: number) => {
    const updatedRoutine: Routine = {
      ...routine,
      workouts: routine.workouts.filter((workout) => workout.id !== workoutId),
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
          <View className="flex-row justify-between items-center mb-3">
            {isEditMode ? (
              <TextInput
                className="text-sm bg-background text-foreground"
                defaultValue={routine.name}
                showSoftInputOnFocus={false}
                onChangeText={(text) => {
                  const updatedRoutine = { ...routine, name: text };
                  handleUpdateRoutine(updatedRoutine);
                }}
              />
            ) : (
              <Text className="text-sm text-muted-foreground">{routine.name}</Text>
            )}
            <Button variant="ghost" className="h-8 px-3 flex-row items-center" onPress={toggleEditMode}>
              {isEditMode ? (
                <Text className="text-destructive font-bold">Fertig</Text>
              ) : (
                <>
                  <Pencil size={16} className="text-primary mr-2" />
                  <Text className="text-primary  font-medium">Bearbeiten</Text>
                </>
              )}
            </Button>
          </View>
          <TabsList className="flex-row w-full mb-4">
            {routine.workouts.map((workout) => (
              <TabsTrigger key={workout.id} value={workout.id.toString()} className="flex-1">
                {isEditMode && activeTab === workout.id.toString() ? (
                  <View className="flex-row items-center justify-center w-full">
                    <TextInput
                      className="flex-1 py-1 rounded-md bg-background text-center text-foreground"
                      defaultValue={workout.name}
                      showSoftInputOnFocus={false}
                      autoFocus
                      numberOfLines={1}
                      maxLength={20}
                      onChangeText={(text) => {
                        const updatedWorkout = { ...workout, name: text };
                        handleUpdateWorkout(updatedWorkout);
                      }}
                      onPressIn={() => {
                        TextInput.State.currentlyFocusedInput()?.setNativeProps({ showSoftInputOnFocus: true });
                      }}
                    />
                  </View>
                ) : (
                  <Text numberOfLines={1} className="px-2">
                    {workout.name}
                  </Text>
                )}
              </TabsTrigger>
            ))}
            {isEditMode && (
              <Button variant="ghost" className="h-8 w-8 p-0 justify-center items-center" onPress={handleAddWorkout}>
                <Plus size={20} className="text-primary" />
              </Button>
            )}
          </TabsList>
        </View>
        {routine.workouts.map((workout) => (
          <TabsContent key={workout.id} value={workout.id.toString()} className="flex-1 px-4">
            <WorkoutPage
              workout={workout}
              onExercisePress={handleExercisePress}
              onUpdateWorkout={handleUpdateWorkout}
              isEditMode={isEditMode}
              deleteWorkout={() => deleteWorkout(workout.id)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </View>
  );
}
