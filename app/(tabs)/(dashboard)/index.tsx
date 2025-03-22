import React, { useMemo, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { Text } from "~/components/ui/text";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useActiveWorkoutStore } from "~/stores/activeWorkoutStore";
import { useWorkoutHistoryStore } from "~/stores/workoutHistoryStore";
import { useUserProfileStore } from "~/stores/userProfileStore";
import { TodaysWorkoutWidget } from "~/components/Dashboard/TodaysWorkoutWidget";
import { useUserRoutineStore } from "~/stores/userRoutineStore";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { BlockQuote, H1, Lead } from "~/components/ui/typography";
import { WeeklyPreviewWidget } from "~/components/Dashboard/WeeklyPreview.Widget";
import { useExerciseStore } from "~/stores/exerciseStore";
import { getDailyIndex, getWorkoutSchedule, WeekDay, WeeklySchedule } from "~/lib/workoutPlanning";
import { Workout } from "~/lib/types";
import { WorkoutSession } from "~/lib/types";

export default function Index() {
  const isWorkoutRunning = useActiveWorkoutStore((state) => state.workoutTimer.isRunning);
  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);
  const cancelWorkout = useActiveWorkoutStore((state) => state.cancelWorkout);
  const sessions = useWorkoutHistoryStore((state) => state.sessions);
  const exercises = useExerciseStore((state) => state.exercises);
  const { profile } = useUserProfileStore();
  const { routines, getActiveRoutine } = useUserRoutineStore();

  const activeRoutine = useMemo(() => {
    const activeRoutine = getActiveRoutine();
    if (activeRoutine) {
      console.log("New activeRoutine", activeRoutine?.name);
    }
    return activeRoutine;
  }, [routines]);

  const weeklySchedule: WeeklySchedule = useMemo(() => {
    return getWorkoutSchedule(activeRoutine, sessions, exercises || []);
  }, [activeRoutine, sessions, exercises]);

  const dailyIndex = getDailyIndex(new Date());

  const todaysActivity: WorkoutSession[] | Workout | null = weeklySchedule.get(dailyIndex)?.activity || null;

  // Persönliche Begrüßung
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Hey";
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
    // TODO: Implement skip workout
  };

  const today = format(new Date(), "EEEE", { locale: de });

  return (
    <ScrollView className="bg-background">
      <View className="p-4 gap-4">
        {/* Personalisierter Header */}
        <View className="flex-row items-center justify-between mb-2 px-1">
          <H1>
            {greeting}, {userName}!
          </H1>
          <View className="flex-row items-end">
            <Lead>
              {today}, {format(new Date(), "dd. MMMM", { locale: de })}
            </Lead>
          </View>
        </View>

        <WeeklyPreviewWidget schedule={weeklySchedule} />

        {/* Workout Widget */}
        {Array.isArray(todaysActivity) ? (
          <></>
        ) : todaysActivity ? (
          <TodaysWorkoutWidget
            workout={todaysActivity as Workout}
            skipWorkout={skipWorkout}
            isStarted={isWorkoutRunning}
            startWorkout={() => startWorkout((todaysActivity as Workout).id)}
            cancelWorkout={() => cancelWorkout()}
          />
        ) : (
          <View className="bg-card p-6 rounded-xl border border-border/50">
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
