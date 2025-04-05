import React, { useState, useEffect, useMemo } from "react";
import { router, useLocalSearchParams, Stack, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { Exercise, Routine } from "~/lib/types";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";
import { ChevronLeft } from "~/lib/icons/Icons";
import { Button } from "~/components/ui/button";
import { View } from "react-native";
import { useUserRoutineStore } from "~/stores/userRoutineStore";

export default function RoutineDetails() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const { routines, updateRoutine } = useUserRoutineStore();
  const routine: Routine | undefined = useMemo(() => routines.find((p) => p.id === routineId), [routines, routineId]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isEditMode, setIsEditMode] = useState(
    () => routine?.workouts.length === 1 && routine.workouts[0].exercises.length === 0
  );
  const navigation = useNavigation();

  const handleWorkoutPress = (workoutId: string) => {
    console.log("workoutId", workoutId);
    router.push(`./workout/${workoutId}`);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Trainingsplan",
    });
  }, [routine]);

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Button variant="ghost" className="ml-2" onPress={() => router.back()}>
              <ChevronLeft size={24} />
            </Button>
          ),
          headerRight: () => (
            <Button variant="ghost" className="mr-2" onPress={() => setIsEditMode(!isEditMode)}>
              <Text className="text-destructive">{isEditMode ? "Fertig" : "Bearbeiten"}</Text>
            </Button>
          ),
        }}
      />
      {routine ? (
        <RoutineOverview
          routine={routine}
          handleWorkoutPress={handleWorkoutPress}
          exercises={exercises}
          isEditMode={isEditMode}
          updateRoutine={updateRoutine}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted-foreground text-center">Trainingsplan nicht gefunden</Text>
        </View>
      )}
    </>
  );
}
