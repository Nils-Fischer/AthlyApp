import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { useUserStore } from "~/stores/userStore";
import { format, startOfWeek, isWithinInterval } from "date-fns";
import { de } from "date-fns/locale";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { Workout } from "~/lib/types";
import { TodaysWorkoutWidget } from "~/components/dashboard/TodaysWorkoutWidget";
import { Button } from "~/components/ui/button";
import { Plus, CalendarCheck } from "~/lib/icons/Icons";

export default function Index() {
  const userStore = useUserStore();
  const workoutHistoryStore = useWorkoutHistoryStore();
  const activeWorkoutStore = useActiveWorkoutStore();
  const { profile } = useUserProfileStore();

  const activeRoutine = userStore.userData?.routines.find(
    (routine) => routine.active
  );
  const numWorkouts = activeRoutine?.workouts.length || 0;

  const [activeWorkoutIndex, setActiveWorkoutIndex] = useState(0);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);

  // Persönliche Begrüßung
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  const greeting = getGreeting();
  const userName = profile?.firstName || "Sportler";

  // Motivationszitate
  const motivationQuotes = [
    "Jeder Tag ist eine neue Chance! 💪",
    "Dein Körper kann fast alles. Es ist dein Geist, den du überzeugen musst. 🧠",
    "Wachse an deinen Herausforderungen! 🌱",
    "Es wird schwer, aber du bist stärker. 💥",
    "Konsistenz ist der Schlüssel! 🔑",
  ];

  const skipWorkout = () => {
    const nextIndex = (activeWorkoutIndex + 1) % numWorkouts;
    setActiveWorkoutIndex(nextIndex);
  };

  useEffect(() => {
    const newWorkout = activeRoutine?.workouts[activeWorkoutIndex];
    if (newWorkout) {
      setActiveWorkout(newWorkout);
      activeWorkoutStore.setWorkout(newWorkout);
    }
  }, [activeWorkoutIndex]);

  useEffect(() => {
    const oldestWorkoutIndex = activeRoutine?.workouts.reduce(
      (oldestIndex, workout, currentIndex, workouts) => {
        const currentWorkoutLastDate =
          workoutHistoryStore.getLastWorkout(workout.id)?.date;
        const oldestWorkoutLastDate =
          workoutHistoryStore.getLastWorkout(workouts[oldestIndex].id)?.date;

        if (!currentWorkoutLastDate) return oldestIndex;
        if (!oldestWorkoutLastDate) return currentIndex;

        return currentWorkoutLastDate < oldestWorkoutLastDate
          ? currentIndex
          : oldestIndex;
      },
      0
    );
    setActiveWorkoutIndex(oldestWorkoutIndex || 0);
  }, [activeRoutine, workoutHistoryStore]);

  const today = format(new Date(), "EEEE", { locale: de });

  return (
    <ScrollView className="bg-background">
      <View className="p-4">
        {/* Personalisierter Header */}
        <View className="mb-6">
          <Text className="text-2xl text-muted-foreground">
            {greeting}, {userName}! 👋
          </Text>
          <View className="flex-row items-baseline gap-2 mt-1">
            <Text className="text-4xl font-bold capitalize">{today}</Text>
            <Text className="text-sm text-muted-foreground">
              {format(new Date(), "dd. MMMM", { locale: de })}
            </Text>
          </View>
        </View>

        {/* Workout Widget */}
        {activeWorkout ? (
          <TodaysWorkoutWidget workout={activeWorkout} skipWorkout={skipWorkout} />
        ) : (
          <View className="bg-card p-6 rounded-xl border border-border/50 mb-6">
            <Text className="text-center text-muted-foreground text-lg">
              Kein Training für heute geplant 🛋️
            </Text>
          </View>
        )}

        {/* Motivationswidget */}
        <View className="bg-card p-6 rounded-xl border border-border/50">
          <Text className="text-center italic text-lg">
            "
            {
              motivationQuotes[
                Math.floor(Math.random() * motivationQuotes.length)
              ]
            }
            "
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
