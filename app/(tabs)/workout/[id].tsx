import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/stores/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Routine } from "~/lib/types";
import { WorkoutPage } from "~/components/exercise/WorkoutPage";

export default function RoutineDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const userStore = useUserStore();
  const routine: Routine | undefined = userStore.userData?.routines.find((p) => p.id === Number(id));
  const [activeTab, setActiveTab] = useState(routine?.workouts[0]?.id.toString() || "0");

  const handleExercisePress = (exerciseId: number) => {
    router.push(`./exercise/${exerciseId}`);
  };

  if (!routine) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center">
        <Text className="text-muted-foreground">Trainingsplan nicht gefunden</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
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
                <WorkoutPage workout={workout} routineName={routine.name} onExercisePress={handleExercisePress} />
              </TabsContent>
            ))}
          </Tabs>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
