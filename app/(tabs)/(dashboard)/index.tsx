import React, { useEffect } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { TodayWorkoutWidget } from "~/components/dashboard/active-workout/TodayWorkoutWidget";
import { useUserStore } from "~/stores/userStore";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";

export default function Index() {
  const userStore = useUserStore();
  const activeWorkoutStore = useActiveWorkoutStore();

  const findActiveWorkout = () => {
    // TODO: proper workout selection
    return userStore.userData?.routines.find((routine) => routine.active)?.workouts[0] || null;
  };

  const todaysWorkout = findActiveWorkout();

  useEffect(() => {
    todaysWorkout && activeWorkoutStore.setWorkout(todaysWorkout);
  }, [todaysWorkout]);

  const today = format(new Date(), "EEEE", { locale: de });

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold capitalize">{today}</Text>
          <Text className="text-muted-foreground">Lass uns trainieren! 💪</Text>
        </View>

        {/* Workout Widget */}
        {todaysWorkout ? (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Heutiges Training</Text>
            <TodayWorkoutWidget workout={todaysWorkout} />
          </View>
        ) : (
          <View className="bg-card p-4 rounded-lg mb-6">
            <Text className="text-center text-muted-foreground">Kein Training für heute geplant</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
