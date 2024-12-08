import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/stores/userStore";
import { Routine } from "~/lib/types";
import { RoutineOverview } from "~/components/Routine/RoutineOverview";

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
