import { useState, useEffect } from "react";
import { View, TextInput } from "react-native";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { Routine, Workout } from "~/lib/types";
import { WorkoutPage } from "~/components/Workout/WorkoutPage";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react-native";
import { Plus, Trash2 } from "~/lib/icons/Icons";
import { CustomDropdownMenu } from "~/components/ui/custom-dropdown-menu";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { generateId } from "~/lib/utils";

export function RoutineOverview({
  routine: initialRoutine,
  handleExercisePress,
  isEditMode = false,
}: {
  routine: Routine;
  handleExercisePress?: (exerciseId: number) => void;
  isEditMode?: boolean;
}) {
  const { updateRoutine } = useUserRoutineStore();
  const [routine, setRoutine] = useState(initialRoutine);
  const [activeTab, setActiveTab] = useState(routine?.workouts[0]?.id.toString() || "0");

  useEffect(() => {
    setRoutine(initialRoutine);
  }, [initialRoutine]);

  const handleUpdateWorkout = async (updatedWorkout: Workout) => {
    const updatedRoutine: Routine = {
      ...routine,
      workouts: routine.workouts.map((workout) => (workout.id === updatedWorkout.id ? updatedWorkout : workout)),
    };
    setRoutine(updatedRoutine);
    await updateRoutine(updatedRoutine);
  };

  const handleUpdateRoutine = async (updatedRoutine: Routine) => {
    setRoutine(updatedRoutine);
    await updateRoutine(updatedRoutine);
  };

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

  const deleteWorkout = async (workoutId: string) => {
    const updatedRoutine: Routine = {
      ...routine,
      workouts: routine.workouts.filter((workout) => workout.id !== workoutId),
    };
    setRoutine(updatedRoutine);
    await updateRoutine(updatedRoutine);
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
        <View className="px-4 pt-2 flex-row">
          <TabsList className="mb-4 flex-row flex-1 items-center">
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
          </TabsList>
          {isEditMode && (
            <CustomDropdownMenu
              items={[
                {
                  name: "Workout hinzufügen",
                  icon: Plus,
                  onPress: handleAddWorkout,
                },
                {
                  name: "Workout löschen",
                  icon: Trash2,
                  onPress: () => {
                    setActiveTab(routine.workouts[0].id.toString());
                    deleteWorkout(activeTab);
                  },
                  destructive: true,
                },
              ]}
              trigger={
                <Button
                  variant="ghost"
                  className="flex-none h-8 w-8 p-0 ml-2 justify-center items-center"
                  haptics="light"
                >
                  <MoreHorizontal size={20} className="text-primary" />
                </Button>
              }
              side="bottom"
              align="end"
            />
          )}
        </View>
        {routine.workouts.map((workout) => (
          <TabsContent key={workout.id} value={workout.id.toString()} className="flex-1">
            <WorkoutPage
              workout={workout}
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
