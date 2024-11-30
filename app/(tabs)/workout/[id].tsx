//app/(tabs)/workout/[id].tsx
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/stores/userStore";
import { Routine } from "~/lib/types";
import { WorkoutPage } from "~/components/exercise/WorkoutPage";
import { RoutineOverview } from "~/components/exercise/RoutineOverview";

export default function RoutineDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userStore = useUserStore();
  const routine: Routine | undefined = userStore.userData?.routines.find((p) => p.id === Number(id));

  const handleExercisePress = (exerciseId: number) => {
    router.push(`./exercise/${exerciseId}`);
  };

  if (!routine) {
    return <Text className="text-muted-foreground">Trainingsplan nicht gefunden</Text>;
  } else return <RoutineOverview routine={routine} handleExercisePress={handleExercisePress} />;
}
