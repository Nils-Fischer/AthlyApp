import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/stores/userStore";
import { Routine } from "~/lib/types";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";
import { TextInput, View } from "react-native";
import { Button } from "~/components/ui/button";
import { ChevronLeft } from "lucide-react-native";

export default function RoutineDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userStore = useUserStore();
  const routine: Routine | undefined = userStore.userData?.routines.find((p) => p.id === Number(id));
  const [isEditMode, setIsEditMode] = useState(
    () => routine?.workouts.length === 1 && routine.workouts[0].exercises.length === 0
  );

  const handleExercisePress = (exerciseId: number) => {
    router.push(`./exercise/${exerciseId}`);
  };

  if (!routine) {
    return <Text className="text-muted-foreground">Trainingsplan nicht gefunden</Text>;
  }

  return (
    <View className="flex-1 mt-14">
      {/* Custom Header */}
      <View className="mr-1 flex-row items-center py-3 border-b border-border bg-background">
        <View className="z-10">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center"
          >
            <ChevronLeft className="text-destructive" size={30} />
          </Button>
        </View>

        <View className="absolute inset-x-0 flex items-center justify-center">
          <Text numberOfLines={1} className="text-xl font-bold text-center text-foreground px-12">
            {routine.name}
          </Text>
        </View>

        <View className="flex-1" />
        <Button variant="ghost" className="items-center justify-center" onPress={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? (
            <Text className="text-destructive text-xl font-medium">Fertig</Text>
          ) : (
            <Text className="text-destructive text-xl font-medium">Bearbeiten</Text>
          )}
        </Button>
      </View>

      {/* Content */}
      <RoutineOverview routine={routine} handleExercisePress={handleExercisePress} isEditMode={isEditMode} />
    </View>
  );
}
