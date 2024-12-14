import React from 'react';
import { View, ScrollView } from 'react-native';
import { Text } from '~/components/ui/text';
import { TodayWorkoutWidget } from '~/components/dashboard/active-workout/TodayWorkoutWidget';
import { useUserStore } from '~/stores/userStore';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Index() {
  const userStore = useUserStore();
  
  // Finde das Workout für heute
  const findTodaysWorkout = () => {
    if (!userStore.userData?.routines || userStore.userData.routines.length === 0) {
      return null;
    }

    // Nehmen wir das erste Workout der ersten Routine als Beispiel
    const activeRoutine = userStore.userData.routines[0];
    return activeRoutine.workouts[0];
  };

  const todaysWorkout = findTodaysWorkout();
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
            <Text className="text-center text-muted-foreground">
              Kein Training für heute geplant
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}