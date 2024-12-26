import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { TodayWorkoutWidget } from "~/components/dashboard/active-workout/TodayWorkoutWidget";
import { useUserStore } from "~/stores/userStore";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { Workout } from "~/lib/types";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";

export default function Index() {
  const userStore = useUserStore();
  const workoutHistoryStore = useWorkoutHistoryStore();
  const activeWorkoutStore = useActiveWorkoutStore();

  const activeRoutine = userStore.userData?.routines.find((routine) => routine.active);
  const numWorkouts = activeRoutine?.workouts.length || 0;

  const [activeWorkoutIndex, setActiveWorkoutIndex] = useState(0);
  const activeWorkout = activeRoutine?.workouts[activeWorkoutIndex] || null;

  const skipWorkout = () => {
    const nextIndex = (activeWorkoutIndex + 1) % numWorkouts;
    setActiveWorkoutIndex(nextIndex);
  };

  useEffect(() => {
    const oldestWorkoutIndex = activeRoutine?.workouts.reduce((oldestIndex, workout, currentIndex, workouts) => {
      const currentWorkoutLastDate = workoutHistoryStore.getLastWorkout(workout.id)?.date;
      const oldestWorkoutLastDate = workoutHistoryStore.getLastWorkout(workouts[oldestIndex].id)?.date;

      if (!currentWorkoutLastDate) return oldestIndex;
      if (!oldestWorkoutLastDate) return currentIndex;

      return currentWorkoutLastDate < oldestWorkoutLastDate ? currentIndex : oldestIndex;
    }, 0);
    setActiveWorkoutIndex(oldestWorkoutIndex || 0);

    activeWorkout && activeWorkoutStore.setWorkout(activeWorkout);
  }, [activeRoutine, workoutHistoryStore]);

  const today = format(new Date(), "EEEE", { locale: de });

  return (
    <ScrollView className="bg-background">
      <View className="p-4">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-4xl font-bold capitalize">{today}</Text>
          <Text className="text-muted-foreground">Lass uns trainieren! 💪</Text>
        </View>

        {/* Workout Widget */}
        {activeWorkout ? (
          <TodayWorkoutWidget workout={activeWorkout} skipWorkout={skipWorkout} />
        ) : (
          <View className="bg-card p-4 rounded-lg mb-6">
            <Text className="text-center text-muted-foreground">Kein Training für heute geplant</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
