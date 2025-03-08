import React, { useMemo, useState } from "react";
import { View, ScrollView } from "react-native";
import { Text } from "~/components/ui/text";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { TodaysWorkoutWidget } from "~/components/Dashboard/TodaysWorkoutWidget";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BlockQuote, P } from "~/components/ui/typography";
import { Link } from "expo-router";
import { Button } from "~/components/ui/button";

export default function Index() {
  const workoutHistoryStore = useWorkoutHistoryStore();
  const isWorkoutRunning = useActiveWorkoutStore((state) => state.workoutTimer.isRunning);
  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);
  const cancelWorkout = useActiveWorkoutStore((state) => state.cancelWorkout);

  const { profile } = useUserProfileStore();
  const { routines, getActiveRoutine } = useUserRoutineStore();
  const activeRoutine = useMemo(() => {
    const activeRoutine = getActiveRoutine();
    if (activeRoutine) {
      console.log("New activeRoutine", activeRoutine?.name);
    }
    return activeRoutine;
  }, [routines]);

  const numWorkouts = useMemo(() => activeRoutine?.workouts.length || 0, [activeRoutine]);

  const latestWorkoutIndex = () => {
    const oldestWorkoutIndex = activeRoutine?.workouts.reduce((oldestIndex, workout, currentIndex, workouts) => {
      const currentWorkoutLastDate = workoutHistoryStore.getLastWorkout(workout.id)?.date;
      const oldestWorkoutLastDate = workoutHistoryStore.getLastWorkout(workouts[oldestIndex].id)?.date;

      if (!currentWorkoutLastDate) return oldestIndex;
      if (!oldestWorkoutLastDate) return currentIndex;

      return currentWorkoutLastDate < oldestWorkoutLastDate ? currentIndex : oldestIndex;
    }, 0);
    return oldestWorkoutIndex || 0;
  };

  const [activeWorkoutOffset, setActiveWorkoutOffset] = useState<number>(0);

  const activeWorkout = useMemo(() => {
    const newWorkout = activeRoutine?.workouts[latestWorkoutIndex() + activeWorkoutOffset];
    console.log("New activeWorkout", newWorkout?.name);
    return newWorkout;
  }, [activeRoutine, activeWorkoutOffset]);

  // Persönliche Begrüßung
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  };

  const greeting = getGreeting();
  const userName = profile?.firstName || "Sportler";

  const motivationQuote = useMemo(() => {
    const quotes = [
      "Jeder Tag ist eine neue Chance! 💪",
      "Dein Körper kann fast alles. Es ist dein Geist, den du überzeugen musst. 🧠",
      "Wachse an deinen Herausforderungen! 🌱",
      "Es wird schwer, aber du bist stärker. 💥",
      "Konsistenz ist der Schlüssel! 🔑",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const skipWorkout = () => {
    setActiveWorkoutOffset((activeWorkoutOffset + 1) % numWorkouts);
  };

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
            <Text className="text-sm text-muted-foreground">{format(new Date(), "dd. MMMM", { locale: de })}</Text>
          </View>
        </View>

        <Link href="/workout-completion" asChild>
          <Button haptics="medium">
            <P className="text-primary-foreground">Workout Abschließen</P>
          </Button>
        </Link>

        {/* Workout Widget */}
        {activeWorkout && activeRoutine ? (
          <TodaysWorkoutWidget
            workout={activeWorkout}
            skipWorkout={skipWorkout}
            isStarted={isWorkoutRunning}
            startWorkout={() => startWorkout(activeWorkout.id)}
            cancelWorkout={() => cancelWorkout()}
          />
        ) : (
          <View className="bg-card p-6 rounded-xl border border-border/50 mb-6">
            <Text className="text-center text-muted-foreground text-lg">Kein Training für heute geplant 🛋️</Text>
          </View>
        )}

        {/* Motivationswidget */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tägliche Motivation</CardTitle>
          </CardHeader>
          <CardContent className="justify-center items-center mb-6">
            <BlockQuote className="text-lg text-foreground">{motivationQuote}</BlockQuote>
          </CardContent>
        </Card>
      </View>
    </ScrollView>
  );
}
