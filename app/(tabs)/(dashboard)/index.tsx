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
import { BlockQuote, CardLabel, Muted, P } from "~/components/ui/typography";
import { WeeklyPreviewWidget } from "~/components/Dashboard/WeeklyPreview.Widget";
import { useExerciseStore } from "~/stores/exerciseStore";
import { getDailyIndex, getWorkoutSchedule, WeeklySchedule } from "~/lib/workoutPlanning";
import { Workout } from "~/lib/types";
import { WorkoutSession } from "~/lib/types";
import { DailyWorkoutSummary } from "~/components/Dashboard/DailyWorkoutSummary";
import { ActiveWorkoutCancelConfirmation } from "~/components/ActiveWorkout/ActiveWorkoutCancelConfirmation";
import { quotes } from "~/lib/quotes";
import { ChooseNewWorkoutSheet } from "~/components/Dashboard/ChooseNewWorkoutSheet";
import { Button } from "~/components/ui/button";
import { Plus } from "~/lib/icons/Icons";

export default function Index() {
  const isWorkoutRunning = useActiveWorkoutStore((state) => state.workoutTimer.isRunning);
  const startWorkout = useActiveWorkoutStore((state) => state.startWorkout);
  const cancelWorkout = useActiveWorkoutStore((state) => state.cancelWorkout);
  const sessions = useWorkoutHistoryStore((state) => state.sessions);
  const exercises = useExerciseStore((state) => state.exercises);
  const { profile } = useUserProfileStore();
  const { routines, getActiveRoutine } = useUserRoutineStore();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [skipOffset, setSkipOffset] = useState(0);
  const [showChooseNewWorkoutSheet, setShowChooseNewWorkoutSheet] = useState(false);
  const [customPlannedWorkout, setCustomPlannedWorkout] = useState<Workout | null>(null);

  const activeRoutine = useMemo(() => {
    const activeRoutine = getActiveRoutine();
    if (activeRoutine) {
      console.log("New activeRoutine", activeRoutine?.name);
    }
    return activeRoutine;
  }, [routines]);

  const weeklySchedule: WeeklySchedule = useMemo(() => {
    console.log("skipOffset", skipOffset);
    return getWorkoutSchedule(activeRoutine, sessions, exercises || [], skipOffset);
  }, [activeRoutine, sessions, exercises, skipOffset]);

  const dailyIndex = getDailyIndex(new Date());

  const todaysActivity: WorkoutSession[] | Workout | null =
    customPlannedWorkout ?? (weeklySchedule.get(dailyIndex)?.activity || null);

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
    return quotes[Math.floor(Math.random() * quotes.length)];
  }, []);

  const skipWorkout = () => {
    if (customPlannedWorkout) setCustomPlannedWorkout(null);
    else setSkipOffset((prev) => (prev + 1) % (activeRoutine?.workouts.length || 100));
  };

  const today = format(new Date(), "EEEE", { locale: de });

  return (
    <ScrollView className="bg-background">
      <View className="p-4 gap-4">
        {/* Personalisierter Header */}
        <View className="flex-row items-center justify-between mb-2 px-1">
          <P className="text-2xl text-foreground font-bold">
            {greeting}, {userName}!
          </P>
          <P className="text-muted-foreground">
            {today}, {format(new Date(), "dd. MMMM", { locale: de })}
          </P>
        </View>

        <WeeklyPreviewWidget schedule={weeklySchedule} />
        {/* Workout Widget */}
        {Array.isArray(todaysActivity) ? (
          <DailyWorkoutSummary sessions={todaysActivity} onStartNewWorkout={() => setShowChooseNewWorkoutSheet(true)} />
        ) : todaysActivity ? (
          <TodaysWorkoutWidget
            workout={todaysActivity as Workout}
            skipWorkout={skipWorkout}
            isStarted={isWorkoutRunning}
            startWorkout={() => {
              startWorkout((todaysActivity as Workout).id);
            }}
            showCancelDialog={() => setShowCancelDialog(true)}
            cancelWorkout={() => cancelWorkout()}
            isCustomWorkout={customPlannedWorkout !== null}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                <CardLabel>Training</CardLabel>
              </CardTitle>
            </CardHeader>
            <CardContent className="justify-center items-center mb-2 gap-6">
              <Text className="text-center text-foreground text-lg">Kein Training für heute geplant 🛋️</Text>
              <Button
                variant="ghost"
                className="flex-row gap-2 w-full border border-border/50"
                haptics="light"
                onPress={() => setShowChooseNewWorkoutSheet(true)}
              >
                <Plus size={16} className="text-muted-foreground" />
                <Muted className="text-sm">Neues Training starten</Muted>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Motivationswidget */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tägliche Motivation</CardTitle>
          </CardHeader>
          <CardContent className="justify-center items-center mb-6">
            <BlockQuote className="text-md self-start">„{motivationQuote.translation}“</BlockQuote>
            <P className="text-muted-foreground self-end">- {motivationQuote.author}</P>
          </CardContent>
        </Card>
      </View>

      <ActiveWorkoutCancelConfirmation
        showCancelDialog={showCancelDialog}
        setShowCancelDialog={setShowCancelDialog}
        confirmCancel={cancelWorkout}
      />

      <ChooseNewWorkoutSheet
        isOpen={showChooseNewWorkoutSheet}
        onClose={() => setShowChooseNewWorkoutSheet(false)}
        onSelect={(workout) => {
          setCustomPlannedWorkout(workout);
          setShowChooseNewWorkoutSheet(false);
        }}
        routines={routines}
        exercises={exercises || []}
      />
    </ScrollView>
  );
}
