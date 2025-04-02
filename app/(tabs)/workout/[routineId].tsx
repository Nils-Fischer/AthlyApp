import React, { useState, useEffect, useMemo } from "react";
import { router, useLocalSearchParams, Stack, useNavigation } from "expo-router";
import { Text } from "~/components/ui/text";
import { Routine } from "~/lib/types";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";
import { ChevronLeft } from "~/lib/icons/Icons";
import { Button } from "~/components/ui/button";
import { TextInput, View } from "react-native";
import { useUserRoutineStore } from "~/stores/userRoutineStore";

export default function RoutineDetails() {
  const { routineId } = useLocalSearchParams<{ routineId: string }>();
  const { routines } = useUserRoutineStore();
  const routine: Routine | undefined = useMemo(() => routines.find((p) => p.id === routineId), [routines, routineId]);
  const [isEditMode, setIsEditMode] = useState(
    () => routine?.workouts.length === 1 && routine.workouts[0].exercises.length === 0
  );
  const navigation = useNavigation();

  const handleExercisePress = (exerciseId: number) => {
    router.push(`./exercise/${exerciseId}`);
  };

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: routine?.name,
    });
  }, [routine]);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () =>
            isEditMode ? (
              <TextInput className="font-medium text-lg" defaultValue={routine?.name} />
            ) : (
              <Text className="font-medium text-lg">{routine?.name ?? "Trainingsplan"}</Text>
            ),
          headerLeft: () => (
            <Button variant="ghost" className="ml-2" onPress={() => router.back()}>
              <ChevronLeft size={24} />
            </Button>
          ),
          headerRight: () =>
            routine ? (
              <Button variant="ghost" className="mr-2" onPress={() => setIsEditMode(!isEditMode)}>
                <Text className="text-destructive">{isEditMode ? "Fertig" : "Bearbeiten"}</Text>
              </Button>
            ) : null,
        }}
      />
      {routine ? (
        <RoutineOverview routine={routine} handleExercisePress={handleExercisePress} isEditMode={isEditMode} />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-muted-foreground text-center">Trainingsplan nicht gefunden</Text>
        </View>
      )}
    </>
  );
}
